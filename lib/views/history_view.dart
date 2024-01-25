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

  void mobileCallback(Instruction instruction) {
    _instruction.value = instruction;
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

  @override
  Widget build(BuildContext context) {
    bool tabletLayout = DeviceInfo.inTabletLayout(context) ? true : false;
    return Scaffold(
        body: Row(
      children: <Widget>[
        Expanded(
          flex: 1,
          child: Column(
            children: [
              HistoryListing(
                callback: tabletLayout ? tabletCallback : mobileCallback,
              )
            ],
          ),
        ),
        Visibility(
          visible: tabletLayout,
          child: ValueListenableBuilder(
              valueListenable: _instruction,
              builder: (_, instruction, __) {
                return instruction != null
                    ? Expanded(
                        flex: tabletLayout ? 1 : 0,
                        child: InstructionOverviewWidget(
                          instruction: instruction,
                          additionalData: null,
                          open: false,
                        ),
                      )
                    : Expanded(
                        flex: tabletLayout ? 1 : 0,
                        child: const Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('No history entry selected!'),
                          ],
                        ));
              }),
        ),
      ],
    ));
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

class HistoryListing extends StatefulWidget {
  final Function callback;

  const HistoryListing({
    super.key,
    required this.callback,
  });

  @override
  State<HistoryListing> createState() => _HistoryListingState();
}

class _HistoryListingState extends State<HistoryListing> {
  final ScrollController _scrollController = ScrollController();
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

  @override
  Widget build(BuildContext context) {
    var historyEntries =
        Singleton().getDatabase().getUserHistoryAsInstructions(currentUser!);
    return StreamBuilder(
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
                        itemSelectedCallback: widget.callback,
                        key: Key("${snapshot.data![index].instruction.id}"),
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
        });
  }
}
