import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
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
    final l = Languages.of(context);
    return Column(
      children: [
        HtmlWidget(
          widget.instructionStep.description,
        ),
        Text("${l!.step} ${widget.instructionStep.stepNr}")
      ],
    );
  }
}
