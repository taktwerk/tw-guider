import 'package:flutter/material.dart';
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
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        HtmlWidget(
          widget.instructionStep.htmlText,
        ),
        Text("Step ${widget.instructionStep.stepNr}")
      ],
    );
  }
}
