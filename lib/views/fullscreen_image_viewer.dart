import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/app_util.dart';
import 'package:guider/languages/languages.dart';

class FullScreenImageViewer extends StatefulWidget {
  const FullScreenImageViewer(this.object, this.folderName, this.tagName,
      {Key? key})
      : super(key: key);
  final object;
  final String folderName;
  final String tagName;

  @override
  State<FullScreenImageViewer> createState() => _FullScreenImageViewerState();
}

class _FullScreenImageViewerState extends State<FullScreenImageViewer> {
  final _transformationController = TransformationController();
  late TapDownDetails _doubleTapDetails;

  void _handleDoubleTap() {
    if (_transformationController.value != Matrix4.identity()) {
      _transformationController.value = Matrix4.identity();
    } else {
      final position = _doubleTapDetails.localPosition;
      // For a 3x zoom
      _transformationController.value = Matrix4.identity()
        ..translate(-position.dx * 2, -position.dy * 2)
        ..scale(3.0);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l = Languages.of(context);
    return Scaffold(
      appBar: AppBar(),
      body: GestureDetector(
        onDoubleTapDown: (d) => _doubleTapDetails = d,
        onDoubleTap: _handleDoubleTap,
        child: SizedBox(
          width: MediaQuery.of(context).size.width,
          height: MediaQuery.of(context).size.height,
          child: Hero(
              tag: widget.tagName,
              child: InteractiveViewer(
                transformationController: _transformationController,
                boundaryMargin: const EdgeInsets.all(20.0),
                minScale: 1,
                maxScale: 5,
                child: (kIsWeb)
                    ? Image.network(
                        widget.object.image,
                        fit: BoxFit.contain,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
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
                        future:
                            AppUtil.filePath(widget.object, widget.folderName),
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
                              fit: BoxFit.contain,
                            );
                          }
                          return Center(
                            child: Text(l!.noImageAvailable),
                          );
                        }),
              )),
        ),
      ),
    );
  }
}
