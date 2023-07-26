import 'package:flutter/material.dart';
import 'package:guider/helpers/search.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/category.dart';
import 'package:guider/objects/instruction.dart';
import 'package:guider/objects/instruction_steps.dart';
import 'package:guider/views/fullscreen_image_viewer.dart';
import 'package:guider/views/instructionstep_overview.dart';
import 'package:guider/widgets/tag.dart';

class InstructionView extends StatefulWidget {
  const InstructionView({super.key, required this.instruction});

  final InstructionElement instruction;

  @override
  State<InstructionView> createState() => _InstructionViewState();
}

class _InstructionViewState extends State<InstructionView> {
  List<InstructionStep>? _steps;
  List<Category>? _categories;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    getData();
  }

  Future getData() async {
    var steps = await Search.getInstructionSteps(widget.instruction.id);
    var categories =
        await Search.getCategoriesOfInstruction(widget.instruction.id);
    setState(() {
      _steps = steps;
      _categories = categories;
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
              padding: const EdgeInsets.fromLTRB(20, 5, 20, 20),
              child: Center(
                child: Column(
                  children: [
                    const Text("Categories:"),
                    _categories!.isEmpty
                        ? const Text("---")
                        : Wrap(
                            children: List.generate(
                                _categories!.length,
                                (index) => TagContainer(
                                    child: getTagContent(
                                        _categories![index].name))),
                          ),
                    Text("Short title: ${widget.instruction.shortTitle}"),
                    const SizedBox(height: 10),
                    const Text("Description"),
                    buildDesc(),
                    buildImage(),
                    const SizedBox(height: 10),
                    buildButton(),
                  ],
                ),
              ))
          : const Center(
              child: CircularProgressIndicator(),
            ),
    );
  }

  Widget buildDesc() => Expanded(
      flex: 1,
      child: Container(
        margin: const EdgeInsets.all(5),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(10),
              topRight: Radius.circular(10),
              bottomLeft: Radius.circular(10),
              bottomRight: Radius.circular(10)),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.5),
              spreadRadius: 5,
              blurRadius: 7,
              offset: const Offset(0, 3), // changes position of shadow
            ),
          ],
        ),
        child: Scrollbar(
          thumbVisibility: true,
          controller: _scrollController,
          child: SingleChildScrollView(
            controller: _scrollController,
            scrollDirection: Axis.vertical,
            child: Text(
              widget.instruction.description,
              textAlign: TextAlign.center,
            ),
          ),
        ),
      ));

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
              logger.i("No instruction steps available.");
            }
          },
          label: const Text("Instruction Steps"),
        ),
      );

  Widget getTagContent(category) => Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            constraints: const BoxConstraints(maxWidth: 200),
            child: Padding(
              padding: const EdgeInsets.only(left: 10),
              child: Text(
                category,
                style: const TextStyle(
                  color: Color.fromARGB(255, 35, 38, 68),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const Icon(
            Icons.close,
            color: Color.fromARGB(255, 146, 146, 146),
          ),
        ],
      );
}