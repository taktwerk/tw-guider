import 'dart:io';
import 'package:flutter/material.dart';
import 'package:guider/helpers/constants.dart';
import 'package:guider/helpers/localstorage/app_util.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';
import 'package:flutter/foundation.dart' as foundation;

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
        Text("${l!.step} ${widget.instructionStep.stepNr}"),
        GestureDetector(
          child: Hero(
            tag: "stepHero",
            child: (foundation.kIsWeb)
                ? Image.network(
                    widget.instructionStep.image,
                    height: 300,
                    width: 300,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        color: Colors.red,
                        alignment: Alignment.center,
                        child: const Text(
                          'No image',
                        ),
                      );
                    },
                  )
                : FutureBuilder(
                    future: AppUtil.filePath(widget.instructionStep,
                        Const.instructionStepsImagesFolderName.key),
                    builder: (_, snapshot) {
                      if (snapshot.hasError) {
                        return Text(l.somethingWentWrong);
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
                      return Text(l.noImageAvailable);
                    }),
          ),
        )
      ],
    );
  }
}
