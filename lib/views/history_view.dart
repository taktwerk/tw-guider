import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/device_info.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/instruction_view.dart';
import 'package:guider/widgets/instruction_overview_widget.dart';
import 'package:guider/widgets/listitem.dart';

class HistoryView extends StatefulWidget {
  const HistoryView({super.key});

  @override
  State<HistoryView> createState() => _HistoryViewState();
}

class _HistoryViewState extends State<HistoryView> {
  final ScrollController _scrollController = ScrollController();
  final ValueNotifier<Instruction?> _instruction = ValueNotifier(null);

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Widget _listing(ValueChanged<Instruction> itemSelectedCallback) {
    var historyEntries =
        Singleton().getDatabase().getUserHistoryAsInstructions(currentUser!);
    return Scaffold(
        body: Column(
      children: [
        StreamBuilder(
            stream: historyEntries,
            builder: (BuildContext context,
                AsyncSnapshot<List<InstructionWithCount>> snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const CircularProgressIndicator();
              } else if (snapshot.connectionState == ConnectionState.active ||
                  snapshot.connectionState == ConnectionState.done) {
                if (snapshot.hasError) {
                  return errorOrLoadingCard('🚨 Error: ${snapshot.error}');
                } else if (snapshot.hasData) {
                  return Expanded(
                      child: Scrollbar(
                    controller: _scrollController,
                    thumbVisibility: true,
                    child: ListView.builder(
                      controller: _scrollController,
                      physics: const BouncingScrollPhysics(),
                      itemCount: snapshot.data?.length,
                      itemBuilder: (context, index) {
                        return ListItem(
                            itemSelectedCallback: itemSelectedCallback,
                            instruction: snapshot.data![index].instruction,
                            count: snapshot.data![index].count);
                      },
                    ),
                  ));
                } else {
                  return const Text("Empty data");
                }
              } else {
                return Text('State: ${snapshot.connectionState}');
              }
            })
      ],
    ));
  }

  Widget _buildMobileLayout() {
    return _listing(mobileCallback);
  }

  void mobileCallback(Instruction instruction) {
    Navigator.push(
      context,
      MaterialPageRoute(
          builder: (context) => InstructionView(
                instruction: instruction,
                open: false,
                additionalData: null,
              )),
    );
  }

  void tabletCallback(Instruction instruction) {
    _instruction.value = instruction;
  }

  Widget _buildTabletLayout() {
    return Row(
      children: <Widget>[
        Expanded(child: _listing(tabletCallback)),
        ValueListenableBuilder(
            valueListenable: _instruction,
            builder: (_, instruction, __) {
              return instruction != null
                  ? Expanded(
                      child: InstructionOverviewWidget(
                        instruction: instruction,
                        additionalData: null,
                        open: false,
                      ),
                    )
                  : const Expanded(
                      child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('No history entry selected!'),
                      ],
                    ));
            })
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: OrientationBuilder(
        builder: (context, orientation) {
          if (kIsWeb ||
              (orientation == Orientation.landscape &&
                  DeviceInfo.landscapeAllowed(context))) {
            return _buildTabletLayout();
          } else {
            return _buildMobileLayout();
          }
        },
      ),
    );
  }

  Widget errorOrLoadingCard(input) {
    return InkWell(
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Card(
          elevation: 4,
          child: Center(
            child: Text(input),
          ),
        ),
      ),
    );
  }
}
