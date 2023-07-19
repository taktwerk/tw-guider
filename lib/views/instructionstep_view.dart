import 'package:flutter/material.dart';
import 'package:guider/objects/instruction_steps.dart';

class InstructionStepView extends StatefulWidget {
  const InstructionStepView({super.key, required this.instructionTitle, required this.instructionStep});

  final String instructionTitle;
  final InstructionStep instructionStep;
  
  @override
    State<InstructionStepView> createState() => _InstructionStepViewState();

  
}

class _InstructionStepViewState extends State<InstructionStepView> {

  @override
  void initState() {
    super.initState();
    // getAllInstructionSteps();
  }

  // Future getAllInstructionSteps() async{
  //   var result = await Search.getInstructionSteps(widget.instructionTitle);
  //   setState(() {
  //     _steps = result;
  //   });
  // }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text('${widget.instructionTitle}'),
      ),
      body: widget.instructionStep != null?
      Text("Step ${widget.instructionStep.stepNr}") : Text("No instruction step.")
    );
  }
  
}