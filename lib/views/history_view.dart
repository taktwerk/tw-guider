import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/widgets/listitem.dart';

class HistoryView extends StatefulWidget {
  const HistoryView({super.key});

  @override
  State<StatefulWidget> createState() => _HistoryViewState();
}

class _HistoryViewState extends State<HistoryView> {
  List<Instruction>? _instructions;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    getData();
  }

  Future getData() async {
    if (currentUser != null) {
      var data = await Singleton()
          .getDatabase()
          .getUserHistoryAsInstructions(currentUser!);
      setState(() {
        _instructions = data;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Column(
      children: [
        _instructions != null
            ? _instructions!.isNotEmpty
                ? Expanded(
                    child: Scrollbar(
                    controller: _scrollController,
                    thumbVisibility: true,
                    child: ListView.builder(
                      controller: _scrollController,
                      physics: const BouncingScrollPhysics(),
                      itemCount: _instructions!.length,
                      itemBuilder: (context, index) {
                        return ListItem(instruction: _instructions![index]);
                      },
                    ),
                  ))
                : Text(Languages.of(context)!.noHistoryAvailable)
            : Center(
                child: Text(Languages.of(context)!.noHistoryAvailable),
              ),
      ],
    ));
  }
}
