import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/widgets/listitem.dart';

class HistoryView extends StatefulWidget {
  const HistoryView({super.key});

  @override
  State<HistoryView> createState() => _HistoryViewState();
}

class _HistoryViewState extends State<HistoryView> {
  final ScrollController _scrollController = ScrollController();

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
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
