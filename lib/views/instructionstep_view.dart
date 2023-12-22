import 'package:flutter/material.dart';
import 'package:guider/helpers/constants.dart';
import 'package:guider/helpers/device_info.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';
import 'package:guider/views/assets_view.dart';
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
    ContentType type = step.type;
    FileObject fileObject = FileObject(
        id: widget.instructionStep.id,
        url: widget.instructionStep.image,
        textfield: widget.instructionStep.description,
        type: widget.instructionStep.type,
        folderName: Const.instructionStepsImagesFolderName.key);

    switch (type) {
      case ContentType.text:
        return Container();
      case ContentType.image:
        return fileTypeToWidget[widget.instructionStep.type.key]!(fileObject);
      case ContentType.video:
        return fileTypeToWidget[widget.instructionStep.type.key]!(fileObject);
      case ContentType.pdf:
        return Card(
          elevation: 4,
          child: ListTile(
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => AssetsView(
                    title: "PDF (Instr. Step ${widget.instructionStep.stepNr})",
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
      case ContentType.audio:
        return fileTypeToWidget[widget.instructionStep.type.key]!(fileObject);
      case ContentType.threeD:
        return Card(
          elevation: 4,
          child: ListTile(
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => AssetsView(
                    title: "3D (Instr. Step ${widget.instructionStep.stepNr})",
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
    }
  }

  Widget _buildTabletLayout() {
    return SizedBox(
        height: MediaQuery.of(context).size.height,
        width: MediaQuery.of(context).size.width,
        child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Flexible(
            flex: 1,
            child: SingleChildScrollView(
              child: Column(
                children: [
                  HtmlWidget(
                    widget.instructionStep.description,
                  ),
                ], // scrollable Column
              ),
            ),
          ),
          widget.instructionStep.type != ContentType.text
              ? Flexible(
                  flex: 1,
                  child: Column(
                    children: [
                      Flexible(
                        child: getFileWidget(widget.instructionStep),
                      )
                    ], //non scrollable Column
                  ),
                )
              : Container(),
        ]));
  }

  Widget _buildMobileLayout() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          HtmlWidget(
            widget.instructionStep.description,
          ),
          getFileWidget(widget.instructionStep),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return OrientationBuilder(
      builder: (context, orientation) {
        if (DeviceInfo.inTabletLayout(context, orientation)) {
          return _buildTabletLayout();
        } else {
          return _buildMobileLayout();
        }
      },
    );
  }
}
