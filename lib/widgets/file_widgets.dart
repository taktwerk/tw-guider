import 'dart:async';
import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:media_kit/media_kit.dart';

Map<String, Function> fileTypeToWidget = {
  // 'jpg', 'png', 'jpeg', 'webp'
  for (var ext in ['image']) ext: (file) => ImageFileWidget(asset: file),
  for (var ext in ['pdf']) ext: (file) => PdfFileWidget(asset: file),
  // 'mp3', 'wav'
  for (var ext in ['audio']) ext: (file) => AudioFileWidget(asset: file),
  // 'mp4'
  for (var ext in ['video']) ext: (file) => VideoFileWidget(asset: file),
  for (var ext in ['text']) ext: (file) => TextWidget(asset: file),
};

abstract class FileWidget extends StatefulWidget {
  final Asset asset;

  const FileWidget({super.key, required this.asset});

  @override
  State<FileWidget> createState() => _FileWidgetState();
}

class _FileWidgetState extends State<FileWidget> {
  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
