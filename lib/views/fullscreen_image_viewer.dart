import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/constants.dart';
import 'package:guider/helpers/localstorage/app_util.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';

class FullScreenImageViewer extends StatelessWidget {
  const FullScreenImageViewer(this.object, this.folderName, this.tagName,
      {Key? key})
      : super(key: key);
  final object;
  final String folderName;
  final String tagName;
  @override
  Widget build(BuildContext context) {
    final l = Languages.of(context);
    return Scaffold(
      appBar: AppBar(),
      body: GestureDetector(
        child: SizedBox(
          width: MediaQuery.of(context).size.width,
          height: MediaQuery.of(context).size.height,
          child: Hero(
            tag: tagName,
            child: (kIsWeb)
                ? Image.network(
                    object.image,
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
                    future: AppUtil.filePath(object, folderName),
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
          ),
        ),
        onTap: () {
          Navigator.pop(context);
        },
      ),
    );
  }
}
