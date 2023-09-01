import 'dart:io';
import 'package:drift/drift.dart' as drift;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/constants.dart';
import 'package:guider/helpers/localstorage/app_util.dart';
import 'package:guider/helpers/localstorage/localstorage.dart' as local;
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/edit_feedback.dart';

class UserFeedbackView extends StatefulWidget {
  const UserFeedbackView({super.key});

  @override
  State<StatefulWidget> createState() => _UserFeedbackViewState();
}

class _UserFeedbackViewState extends State<UserFeedbackView> {
  final ScrollController _scrollController = ScrollController();

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final feedback = Singleton().getDatabase().getUserFeedback(currentUser!);
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.black45,
          title: const Text("Feedback"),
        ),
        body: Column(
          children: [
            StreamBuilder(
                stream: feedback,
                builder: (BuildContext context,
                    AsyncSnapshot<List<local.Feedback>> snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const CircularProgressIndicator();
                  } else if (snapshot.connectionState ==
                          ConnectionState.active ||
                      snapshot.connectionState == ConnectionState.done) {
                    if (snapshot.hasError) {
                      return Text('🚨 Error: ${snapshot.error}');
                    } else if (snapshot.hasData) {
                      return Expanded(
                          child: Scrollbar(
                              controller: _scrollController,
                              thumbVisibility: true,
                              child: ListView.builder(
                                itemCount: snapshot.data?.length,
                                controller: _scrollController,
                                physics: const BouncingScrollPhysics(),
                                itemBuilder: (context, index) {
                                  return buildCard(snapshot.data![index]);
                                },
                              )));
                    } else {
                      return const Text("Empty data");
                    }
                  } else {
                    return Text('State: ${snapshot.connectionState}');
                  }
                })
          ],
        ));
  }

  Card buildCard(feedback) {
    final l = Languages.of(context);
    var heading = feedback.message;
    var subheading = feedback.id;
    var supportingText =
        '${l!.createdAt}: ${feedback.createdAt}, ${l.lastUpdate}: ${feedback.updatedAt}';
    return Card(
        elevation: 4.0,
        child: Column(
          children: [
            ListTile(
              title: Text(heading),
              subtitle: Text(subheading),
              trailing: const Icon(Icons.favorite_outline),
            ),
            feedback.image != null
                ? Container(
                    height: 300.0,
                    child: (kIsWeb)
                        ? Image.network(
                            feedback.image,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
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
                                feedback, Const.feedbackImagesFolderName.key),
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
                                  fit: BoxFit.cover,
                                );
                              }
                              return Text(l!.noImageAvailable);
                            }),
                  )
                : Container(),
            Container(
              padding: const EdgeInsets.all(16.0),
              alignment: Alignment.centerLeft,
              child: Text(supportingText),
            ),
            ButtonBar(
              children: [
                IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed: () {
                    _showDialog(context, feedback);
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () {
                    showDialog(
                        context: context,
                        builder: (context) => EditFeedback(feedback: feedback));
                  },
                ),
              ],
            )
          ],
        ));
  }

  void _showDialog(BuildContext context, feedback) {
    final l = Languages.of(context);
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          content: Text(
            l!.confirmFeedbackDelete,
            style: const TextStyle(fontSize: 20),
          ),
          actions: <Widget>[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                FilledButton(
                  style: ButtonStyle(
                      backgroundColor: MaterialStateProperty.all(Colors.grey)),
                  child: Text(l.cancel),
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                ),
                FilledButton(
                  child: Text(l.confirm),
                  onPressed: () async {
                    Navigator.of(context).pop();
                    await Singleton().getDatabase().updateFeedback(
                        FeedbackCompanion(
                            id: drift.Value(feedback.id),
                            updatedAt: drift.Value(DateTime.now().toUtc()),
                            updatedBy: drift.Value(currentUser!),
                            deletedAt: drift.Value(DateTime.now().toUtc()),
                            deletedBy: drift.Value(currentUser!)));
                  },
                ),
              ],
            )
          ],
        );
      },
    );
  }
}
