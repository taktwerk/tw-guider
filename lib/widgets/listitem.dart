import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/constants.dart';
import 'package:guider/helpers/localstorage/app_util.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:intl/intl.dart';

class ListItem extends StatelessWidget {
  const ListItem(
      {super.key,
      required Instruction instruction,
      required int count,
      required this.itemSelectedCallback})
      : _instruction = instruction,
        _count = count;

  final Instruction _instruction;
  final int _count;
  final Function itemSelectedCallback;

  @override
  Widget build(BuildContext context) {
    final DateFormat formatter = DateFormat.yMd('de').add_Hms();
    final l = Languages.of(context);

    return Card(
      elevation: 4,
      margin: const EdgeInsets.all(10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
      child: InkWell(
        onTap: () => itemSelectedCallback(_instruction),
        child: SizedBox(
          height: 160,
          child: Container(
            padding: const EdgeInsets.all(10),
            child: Row(
              children: [
                Expanded(
                    flex: 20,
                    child: Container(
                        alignment: Alignment.topLeft,
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(5),
                          child: (kIsWeb)
                              ? Image.network(
                                  _instruction.image,
                                  height: 150,
                                  width: 250,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Container(
                                      height: 150,
                                      width: 250,
                                      color: Colors.red,
                                      alignment: Alignment.center,
                                      child: const Text(
                                        'No image',
                                      ),
                                    );
                                  },
                                )
                              : FutureBuilder(
                                  future: AppUtil.filePath(
                                      _instruction.id,
                                      _instruction.image,
                                      Const.instructionImagesFolderName.key),
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
                                        height: 150,
                                        width: 250,
                                        fit: BoxFit.cover,
                                      );
                                    }
                                    return Text(l!.noImageAvailable);
                                  }),
                        ))),
                const Spacer(flex: 2),
                Expanded(
                  flex: 50,
                  child: Column(
                    children: [
                      Expanded(
                          flex: 1,
                          child: Align(
                              alignment: Alignment.topLeft,
                              child: Container(
                                  padding:
                                      const EdgeInsets.fromLTRB(7, 2, 7, 2),
                                  decoration: BoxDecoration(
                                      color: Colors.grey.shade400,
                                      border: Border.all(
                                          color: Colors.grey.shade400),
                                      borderRadius: const BorderRadius.all(
                                          Radius.circular(20))),
                                  child: Text(
                                    _instruction.shortTitle,
                                    style: const TextStyle(
                                        fontSize: 15, color: Colors.white),
                                  )))),
                      Expanded(
                        flex: 2,
                        child: Align(
                            alignment: Alignment.topLeft,
                            child: Text(_instruction.title,
                                key: const Key(
                                    "listitem_title"), //included for integration test purposes
                                style: const TextStyle(fontSize: 23))),
                      ),
                      Expanded(
                        flex: 1,
                        child: Align(
                          alignment: Alignment.bottomLeft,
                          child: Text(
                            '${l!.steps}: $_count | ${l.lastUpdate}: ${formatter.format(_instruction.updatedAt)}',
                            style: const TextStyle(color: Colors.grey),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.arrow_forward_ios)
              ],
            ),
          ),
        ),
      ),
    );
  }
}
