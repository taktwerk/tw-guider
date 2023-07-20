import 'package:flutter/material.dart';
import 'package:guider/helpers/search.dart';
import 'package:guider/objects/instruction.dart';
import 'package:guider/objects/instruction_steps.dart';
import 'package:guider/views/fullscreen_image_viewer.dart';
import 'package:guider/views/instructionstep_overview.dart';

class InstructionView extends StatefulWidget {
  const InstructionView({super.key, required this.instruction});

  final InstructionElement instruction;

  @override
  State<InstructionView> createState() => _InstructionViewState();
}

class _InstructionViewState extends State<InstructionView> {
  List<InstructionStep>? _steps;

  @override
  void initState() {
    super.initState();
    getAllInstructionSteps();
  }

  Future getAllInstructionSteps() async {
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
        title: Text(widget.instruction.title),
      ),
      body: _steps != null
          ? Container(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  Text("Short title: ${widget.instruction.shortTitle}"),
                  const SizedBox(height: 10),
                  const Text("Description"),
                  buildDesc(),
                  buildImage(),
                  const SizedBox(height: 10),
                  buildButton(),
                ],
              ),
            )
          : const Text("Empty."),
    );
  }

  Widget buildDesc() => Expanded(
        flex: 1,
        // child: SafeArea(
        //   child: Scrollbar(
        // thumbVisibility: true,
        child: SingleChildScrollView(
          scrollDirection: Axis.vertical,
          child: Text(widget.instruction.description),
        ),
        //   ),
        // ),
      );

  Widget buildImage() => Expanded(
        flex: 1,
        child: GestureDetector(
          child: Hero(
              tag: "imageHero",
              child:
                  Image.network(widget.instruction.image, fit: BoxFit.cover)),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) =>
                      FullScreenImageViewer(widget.instruction.image)),
            );
          },
        ),
      );

  Widget buildButton() => Directionality(
        textDirection: TextDirection.rtl,
        child: ElevatedButton.icon(
          icon: const Icon(Icons.arrow_back_ios),
          onPressed: () {
            if (_steps!.isNotEmpty) {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => InstructionStepOverview(
                    instruction: widget.instruction,
                    steps: _steps!,
                  ),
                ),
              );
            } else {
              print("No instruction steps available.");
            }
          },
          label: const Text("Instruction Steps"),
        ),
      );
}
