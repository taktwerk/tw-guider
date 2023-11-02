import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart' as foundation;
import 'package:flutter/material.dart';
import 'package:guider/helpers/constants.dart';
import 'package:guider/helpers/localstorage/app_util.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/helpers/localstorage/supabase_to_drift.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/fullscreen_image_viewer.dart';
import 'package:guider/views/instructionstep_overview.dart';
import 'package:guider/widgets/streambuilder_widgets.dart';
import 'package:guider/widgets/tag.dart';
import 'package:guider/views/feedback_view.dart';

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
  List<Category>? _categories;
  final ScrollController _scrollController = ScrollController();
  final String tagName = "instructionTag";

  @override
  void initState() {
    super.initState();
    getData();
  }

  Future getData() async {
    await getCategories();
  }

  Future<void> getCategories() async {
    var categories = await Singleton()
        .getDatabase()
        .getCategoriesOfInstruction(widget.instruction.id);
    setState(() {
      _categories = categories;
    });
  }

  void sync() async {
    try {
      await SupabaseToDrift.sync();
    } catch (e) {
      logger.w("Could not sync (instruction view)");
    }
  }

  @override
  Widget build(BuildContext context) {
    final instruction =
        Singleton().getDatabase().getInstructionById(widget.instruction.id);
    final l = Languages.of(context);
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
        body: StreamBuilder(
            stream: instruction,
            builder: (BuildContext context,
                AsyncSnapshot<List<Instruction>> snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const CircularProgressIndicator();
              } else if (snapshot.connectionState == ConnectionState.active ||
                  snapshot.connectionState == ConnectionState.done) {
                if (snapshot.hasError) {
                  return Text('🚨 Error: ${snapshot.error}');
                } else if (snapshot.hasData) {
                  var data = snapshot.data!.first;
                  return Container(
                      padding: const EdgeInsets.fromLTRB(20, 5, 20, 20),
                      child: Center(
                        child: Column(
                          children: [
                            Text("${l!.categorieButtonText}:"),
                            _categories != null
                                ? _categories!.isEmpty
                                    ? const Text("---")
                                    : Wrap(
                                        children: List.generate(
                                            _categories!.length,
                                            (index) => TagContainer(
                                                child: getTagContent(
                                                    _categories![index].name))),
                                      )
                                : const CircularProgressIndicator(),
                            Text("${l.shortTitle}: ${data.shortTitle}"),
                            widget.open && widget.additionalData != "null"
                                ? buildTable(widget.additionalData)
                                : Container(),
                            Text(l.description),
                            buildDesc(data),
                            buildImage(data),
                            const SizedBox(height: 10),
                            buildButtons(data),
                          ],
                        ),
                      ));
                } else {
                  return const Text("Empty data INSTRUCTION");
                }
              } else {
                return Text('State: ${snapshot.connectionState}');
              }
            }));
  }

  Widget buildTable(data) {
    Map<String, dynamic> keyvalue = jsonDecode(data);
    return Expanded(
        flex: 1,
        child: ListView(
          children: [
            Center(
              child: DataTable(
                headingRowHeight: 0,
                columns: const [
                  DataColumn(
                      label: Text(
                    '',
                  )),
                  DataColumn(
                      label: Text(
                    '',
                  )),
                ],
                rows: keyvalue.entries
                    .map((e) => DataRow(cells: [
                          DataCell(Text(e.key.toString())),
                          DataCell(Text(e.value.toString()))
                        ]))
                    .toList(),
              ),
            )
          ],
        ));
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

  Widget buildStepButton(instruction) {
    final steps = Singleton()
        .getDatabase()
        .getInstructionStepsByInstructionId(instruction.id);
    return StreamBuilder(
        stream: steps,
        builder: (BuildContext context,
            AsyncSnapshot<List<InstructionStep>> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const CircularProgressIndicator();
          } else if (snapshot.connectionState == ConnectionState.active ||
              snapshot.connectionState == ConnectionState.done) {
            if (snapshot.hasError) {
              return Text('🚨 Error: ${snapshot.error}');
            } else if (snapshot.hasData) {
              return Directionality(
                  textDirection: TextDirection.rtl,
                  child: Visibility(
                    visible: snapshot.data!.isNotEmpty,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.arrow_back_ios),
                      onPressed: () async {
                        if (snapshot.data!.isNotEmpty) {
                          await Singleton().getDatabase().updateHistoryEntry(
                              instruction.id,
                              DateTime.now().toUtc(),
                              currentUser!,
                              currentUser!,
                              DateTime.now().toUtc(),
                              currentUser!);
                          if (mounted) {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => InstructionStepOverview(
                                  instruction: instruction,
                                ),
                              ),
                            );
                          }
                          sync();
                        } else {
                          logger.i("No instruction steps available.");
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                              content: Text(Languages.of(context)!
                                  .noInstructionsAvailable)));
                        }
                      },
                      label: Text(Languages.of(context)!.instructionSteps),
                    ),
                  ));
            } else {
              return const Text("Empty data STEPS");
            }
          } else {
            return Text('State: ${snapshot.connectionState}');
          }
        });
  }

  Widget buildDesc(instruction) => Expanded(
      flex: 1,
      child: Container(
        margin: const EdgeInsets.all(5),
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
            tag: tagName,
            child: (foundation.kIsWeb)
                ? Image.network(
                    instruction.image,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        width: 250,
                        color: Colors.red,
                        alignment: Alignment.center,
                        child: const Text(
                          'No image',
                          style: TextStyle(fontSize: 30),
                        ),
                      );
                    },
                  )
                : FutureBuilder(
                    future: AppUtil.filePath(instruction.id, instruction.image,
                        Const.instructionImagesFolderName.key),
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
                builder: (context) => FullScreenImageViewer(
                    id: instruction.id,
                    url: instruction.image,
                    folderName: Const.instructionImagesFolderName.key,
                    tagName: tagName)),
          );
        },
      ),
    );
  }

  Widget getTagContent(category) => Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            alignment: Alignment.center,
            child: Padding(
              padding:
                  const EdgeInsets.only(left: 10, right: 10, bottom: 5, top: 5),
              child: Text(
                category,
                style: const TextStyle(
                  color: Color.fromARGB(255, 35, 38, 68),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      );
}
