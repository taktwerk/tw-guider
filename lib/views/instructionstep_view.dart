import 'dart:io';
import 'package:flutter/material.dart';
import 'package:guider/helpers/constants.dart';
import 'package:guider/helpers/localstorage/app_util.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';
import 'package:flutter/foundation.dart' as foundation;
import 'package:guider/views/assets_view.dart';
import 'package:guider/views/fullscreen_image_viewer.dart';
import 'package:guider/widgets/file_widgets.dart';
import 'package:guider/helpers/content_type_enum.dart';

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
  final String tagName = "stepTag";
  @override
  void initState() {
    super.initState();
  }

  Widget getFileWidget(InstructionStep step) {
    FileObject fileObject = FileObject(
        id: widget.instructionStep.id,
        url: widget.instructionStep.image,
        textfield: widget.instructionStep.description,
        type: widget.instructionStep.type,
        folderName: Const.instructionStepsImagesFolderName.key);
    if (step.type == ContentType.text) {
      return Container();
    } else if (step.type == ContentType.threeD ||
        step.type == ContentType.pdf) {
      return Card(
        elevation: 4,
        child: ListTile(
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => AssetsView(
                  fileObject: fileObject,
                ),
              ),
            );
          },
          contentPadding: const EdgeInsets.all(12),
          leading: step.type.icon,
          title: Text(step.type.key),
        ),
      );
    } else if (step.type == ContentType.image ||
        step.type == ContentType.audio) {
      return fileTypeToWidget[widget.instructionStep.type.key]!(
        fileObject,
      );
    } else if (step.type == ContentType.video) {
      return SizedBox(
          //width: MediaQuery.of(context).size.width,
          height: MediaQuery.of(context).size.width * 0.75,
          child:
              fileTypeToWidget[widget.instructionStep.type.key]!(fileObject));
    } else {
      return Container();
    }
  }

  @override
  Widget build(BuildContext context) {
    final l = Languages.of(context);
    return Column(
      children: [
        HtmlWidget(
          widget.instructionStep.description,
        ),
        getFileWidget(widget.instructionStep),
      ],
    );
  }
}
