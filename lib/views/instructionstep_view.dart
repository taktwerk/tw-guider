import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:guider/objects/instruction_steps.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';

class InstructionStepView extends StatefulWidget {
  const InstructionStepView(
      {super.key,
      required this.instructionTitle,
      required this.instructionStep});

  final String instructionTitle;
  final InstructionStep instructionStep;

  @override
  State<InstructionStepView> createState() => _InstructionStepViewState();
}

class _InstructionStepViewState extends State<InstructionStepView> {
  String? fileData;

  @override
  void initState() {
    super.initState();
    getHtmlData();
  }

  Future getHtmlData() async {
    var response = await rootBundle.loadString('assets/html/htmlText.html');
    setState(() {
      fileData = response;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          child: fileData != null
              ? HtmlWidget(
                  fileData!,
                )
              : Container(),
        ),
        Text("Step ${widget.instructionStep.stepNr}")
      ],
    );
  }
}
