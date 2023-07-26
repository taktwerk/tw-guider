import 'package:flutter/material.dart';
import 'package:guider/helpers/search.dart';
import 'package:guider/objects/instruction.dart';
import 'package:guider/widgets/listitem.dart';

class History extends StatefulWidget {
  const History({super.key});

  @override
  State<StatefulWidget> createState() => _HistoryState();
}

class _HistoryState extends State<History> {
  List<InstructionElement>? _instructions;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    getData();
  }

  void getData() async {
    var data = await Search.getHistory();
    setState(() {
      _instructions = data;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Column(
      children: [
        _instructions != null
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
            : const CircularProgressIndicator(),
      ],
    ));
  }
}
