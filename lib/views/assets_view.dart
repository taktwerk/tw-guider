import 'package:flutter/material.dart';
import 'package:guider/widgets/file_widgets.dart';

class AssetsView extends StatefulWidget {
  const AssetsView({super.key, required this.fileObject});
  final FileObject fileObject;

  @override
  State<StatefulWidget> createState() => _AssetsViewState();
}

class _AssetsViewState extends State<AssetsView> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("${widget.fileObject.type.key} Viewer"),
      ),
      body: Center(
          child:
              fileTypeToWidget[widget.fileObject.type.key]!(widget.fileObject)),
    );
  }
}
