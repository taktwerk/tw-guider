import 'package:flutter/material.dart';
import 'package:guider/objects/instruction.dart';

class InstructionView extends StatelessWidget {
  const InstructionView({super.key, required this.user});

  final InstructionElement user;

    @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text('${user.title}'),
      ),
      body: _InstructionViewState(user),
    );
  }
  
}

class _InstructionViewState extends StatelessWidget {
  final InstructionElement user;
  const _InstructionViewState(this.user);
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Text("${user.id}"),
    );
  }
  
}