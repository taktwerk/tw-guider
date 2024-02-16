import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/widgets/instruction_overview_widget.dart';
import 'package:guider/widgets/streambuilder_widgets.dart';

class InstructionView extends StatefulWidget {
  const InstructionView(
      {super.key,
      required this.instruction,
      required this.open,
      required this.additionalData});

  final Instruction instruction;
  final bool open;
  final String? additionalData;

  @override
  State<InstructionView> createState() => _InstructionViewState();
}

class _InstructionViewState extends State<InstructionView> {
  @override
  Widget build(BuildContext context) {
    final instruction =
        Singleton().getDatabase().getInstructionById(widget.instruction.id);
    return Scaffold(
        appBar: AppBar(
          leading: widget.open
              ? IconButton(
                  onPressed: () {
                    Navigator.of(context).pop(false);
                  },
                  icon: const Icon(Icons.close),
                )
              : null,
          title: getTitleStream(instruction),
        ),
        body: InstructionOverviewWidget(
          instruction: widget.instruction,
          additionalData: widget.additionalData,
          open: widget.open,
        ));
  }
}
