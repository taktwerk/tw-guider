import 'package:flutter/material.dart';
import 'package:guider/helpers/search.dart';
import 'package:guider/objects/instruction.dart';
import 'package:guider/objects/instruction_steps.dart';

class InstructionView extends StatefulWidget {
  const InstructionView({super.key, required this.instruction});

  final InstructionElement instruction;
  
  @override
    State<InstructionView> createState() => _InstructionViewState();

  
}

class _InstructionViewState extends State<InstructionView> {
  List<InstructionStep>? _steps;

  void initState() {
    super.initState();
    getAllInstructionSteps();
  }

  Future getAllInstructionSteps() async{
    var result = await Search.getInstructionSteps(widget.instruction.id);
    setState(() {
      _steps = result;
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text('${widget.instruction.title}'),
      ),
      body: _steps != null
      ? Text("Number of steps: ${_steps!.length}") 
      : Text("Empty."),
    );
  }
  
}