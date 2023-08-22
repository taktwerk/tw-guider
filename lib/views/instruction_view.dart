import 'dart:io';

import 'package:flutter/foundation.dart' as foundation;
import 'package:flutter/material.dart';
import 'package:guider/helpers/constants.dart';
import 'package:guider/helpers/localstorage/app_util.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/fullscreen_image_viewer.dart';
import 'package:guider/views/instructionstep_overview.dart';
import 'package:guider/widgets/tag.dart';
import 'package:guider/views/feedback_view.dart';

class InstructionView extends StatefulWidget {
  const InstructionView({super.key, required this.instruction});

  final Instruction instruction;

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
    await getCategories();
    await getSteps();
  }

  Future<void> getCategories() async {
    var categories = await Singleton()
        .getDatabase()
        .getCategoriesOfInstruction(widget.instruction.id);
    setState(() {
      _categories = categories;
    });
  }

  Future<void> getSteps() async {
    var steps = await Singleton()
        .getDatabase()
        .getInstructionStepsByInstructionId(widget.instruction.id);
    setState(() {
      _steps = steps;
    });
  }

  @override
  Widget build(BuildContext context) {
    final instruction =
        Singleton().getDatabase().getInstructionById(widget.instruction.id);
    final l = Languages.of(context);
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
          title: StreamBuilder(
              stream: instruction,
              builder:
                  (BuildContext context, AsyncSnapshot<Instruction> snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const CircularProgressIndicator();
                } else if (snapshot.connectionState == ConnectionState.active ||
                    snapshot.connectionState == ConnectionState.done) {
                  if (snapshot.hasError) {
                    return Text('🚨 Error: ${snapshot.error}');
                  } else if (snapshot.hasData) {
                    return Text(snapshot.data!.title);
                  } else {
                    return const Text("Empty data");
                  }
                } else {
                  return Text('State: ${snapshot.connectionState}');
                }
              }),
        ),
        body: StreamBuilder(
            stream: instruction,
            builder:
                (BuildContext context, AsyncSnapshot<Instruction> snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const CircularProgressIndicator();
              } else if (snapshot.connectionState == ConnectionState.active ||
                  snapshot.connectionState == ConnectionState.done) {
                if (snapshot.hasError) {
                  return Text('🚨 Error: ${snapshot.error}');
                } else if (snapshot.hasData) {
                  return Container(
                      padding: const EdgeInsets.fromLTRB(20, 5, 20, 20),
                      child: Center(
                        child: Column(
                          children: [
                            Text("${l!.categorieButtonText}:"),
                            _categories!.isEmpty
                                ? const Text("---")
                                : Wrap(
                                    children: List.generate(
                                        _categories!.length,
                                        (index) => TagContainer(
                                            child: getTagContent(
                                                _categories![index].name))),
                                  ),
                            Text(
                                "${l.shortTitle}: ${snapshot.data!.shortTitle}"),
                            const SizedBox(height: 10),
                            Text(l.description),
                            buildDesc(snapshot.data!),
                            buildImage(snapshot.data!),
                            const SizedBox(height: 10),
                            buildButtons(snapshot.data!),
                          ],
                        ),
                      ));
                } else {
                  return const Text("Empty data");
                }
              } else {
                return Text('State: ${snapshot.connectionState}');
              }
            }));
  }

  Widget buildButtons(instruction) => Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          getFeedbackButton(instruction),
          buildStepButton(instruction)
        ],
      );

  Widget getFeedbackButton(instruction) => TextButton(
        onPressed: () {
          showDialog(
              context: context,
              builder: (context) => FeedbackView(instruction: instruction));
        },
        child: Text(Languages.of(context)!.feedback),
      );

  Widget buildStepButton(instruction) => Directionality(
        textDirection: TextDirection.rtl,
        child: ElevatedButton.icon(
          icon: const Icon(Icons.arrow_back_ios),
          onPressed: () {
            if (_steps!.isNotEmpty) {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => InstructionStepOverview(
                    instruction: instruction,
                    steps: _steps!,
                  ),
                ),
              );
            } else {
              logger.i("No instruction steps available.");
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                  content:
                      Text(Languages.of(context)!.noInstructionsAvailable)));
            }
          },
          label: Text(Languages.of(context)!.instructionSteps),
        ),
      );

  Widget buildDesc(instruction) => Expanded(
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
              instruction.description,
              textAlign: TextAlign.center,
            ),
          ),
        ),
      ));

  Widget buildImage(instruction) {
    final l = Languages.of(context);
    return Expanded(
      flex: 1,
      child: GestureDetector(
        child: Hero(
            tag: "imageHero",
            child: (foundation.kIsWeb)
                ? Image.network(
                    instruction.image,
                    fit: BoxFit.cover,
                  )
                : FutureBuilder(
                    future: AppUtil.filePath(
                        instruction, Const.instructionImagesFolderName.key),
                    builder: (_, snapshot) {
                      if (snapshot.hasError) {
                        return Text(l!.somethingWentWrong);
                      }
                      if ((snapshot.connectionState ==
                          ConnectionState.waiting)) {
                        return const CircularProgressIndicator();
                      }
                      if (snapshot.data!.isNotEmpty) {
                        return Image.file(
                          File(snapshot.data!),
                          fit: BoxFit.cover,
                        );
                      }
                      return Text(l!.noImageAvailable);
                    })),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => FullScreenImageViewer(instruction)),
          );
        },
      ),
    );
  }

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
