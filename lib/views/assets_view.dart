import 'package:flutter/material.dart';
import 'package:guider/widgets/file_widgets.dart';

class AssetsView extends StatefulWidget {
  const AssetsView({super.key, required this.fileObject, required this.title});
  final FileObject fileObject;
  final String title;

  @override
  State<StatefulWidget> createState() => _AssetsViewState();
}

class _AssetsViewState extends State<AssetsView> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
          child:
              fileTypeToWidget[widget.fileObject.type.key]!(widget.fileObject)),
    );
  }
}
