import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/app_util.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';

class FullScreenImageViewer extends StatelessWidget {
  const FullScreenImageViewer(this.instruction, {Key? key}) : super(key: key);
  final Instruction instruction;
  @override
  Widget build(BuildContext context) {
    final l = Languages.of(context);
    return Scaffold(
      body: GestureDetector(
        child: SizedBox(
          width: MediaQuery.of(context).size.width,
          height: MediaQuery.of(context).size.height,
          child: Hero(
            tag: 'imageHero',
            child: (kIsWeb)
                ? Image.network(
                    instruction.image,
                    fit: BoxFit.contain,
                  )
                : FutureBuilder(
                    future: AppUtil.filePath(instruction.id),
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
                      return Text(l!.noImageAvailable);
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
