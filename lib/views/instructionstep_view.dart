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
  static const htmlData = r"""
<p id='top'><a href='#'>This is the Link</a></p>
  
      <h1>Header 1</h1>
      <h2>Header 2</h2>
      <h3>Header 3</h3>
      <h4>Header 4</h4>
      <h5>Header 5</h5>
      <h6>Header 6</h6>
      <h3>This is the HTML page that we want to integrate with Flutter.</h3>
       
""";

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
