import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/main.dart';
import 'package:guider/widgets/listitem.dart';

class HistoryView extends ConsumerStatefulWidget {
  const HistoryView({super.key});

  @override
  ConsumerState<HistoryView> createState() => _HistoryViewState();
}

class _HistoryViewState extends ConsumerState<HistoryView>
    with AutomaticKeepAliveClientMixin<HistoryView> {
  final ScrollController _scrollController = ScrollController();

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final database = ref.watch(todoDBProvider);

    var historyEntries = database.getUserHistoryAsInstructions(currentUser!);
    return Scaffold(
        body: Column(
      children: [
        StreamBuilder(
            stream: historyEntries,
            builder: (BuildContext context,
                AsyncSnapshot<List<Instruction>> snapshot) {
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
                        return ListItem(instruction: snapshot.data![index]);
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
