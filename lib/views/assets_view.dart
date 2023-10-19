import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/widgets/file_widgets.dart';

class AssetsView extends StatefulWidget {
  const AssetsView({super.key, required this.asset});
  final Asset asset;

  @override
  State<StatefulWidget> createState() => _AssetsViewState();
}

class _AssetsViewState extends State<AssetsView> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body:
          Center(child: fileTypeToWidget[widget.asset.type.key]!(widget.asset)),
    );
  }
}
