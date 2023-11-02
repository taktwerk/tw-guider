import 'dart:io';
import 'package:drift/drift.dart' as drift;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/constants.dart';
import 'package:guider/helpers/localstorage/app_util.dart';
import 'package:guider/helpers/localstorage/localstorage.dart' as local;
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/helpers/localstorage/supabase_to_drift.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/edit_feedback.dart';
import 'package:http/http.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;

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

  void sync() async {
    try {
      await SupabaseToDrift.sync();
    } catch (e) {
      logger.w("Could not sync (user feedback view)");
    }
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
                                key: const Key(
                                    "listview_feedback"), //included for integration test purposes
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

  void changeLikedFlag(id, liked) async {
    await Singleton().getDatabase().updateFeedback(FeedbackCompanion(
        id: drift.Value(id),
        liked: drift.Value(liked),
        updatedAt: drift.Value(DateTime.now().toUtc()),
        updatedBy: drift.Value(currentUser!)));
    sync();
  }

  Card buildCard(feedback) {
    final l = Languages.of(context);
    var heading = feedback.message;
    var subheading = feedback.id;
    final DateFormat formatter = DateFormat.yMd('de').add_Hms();
    Future<Response>? response;
    if (feedback.image != null) {
      response = http.get(Uri.parse(feedback.image));
    }
    var supportingText =
        '${l!.createdAt}: ${formatter.format(feedback.createdAt)} \n${l.lastUpdate}: ${formatter.format(feedback.updatedAt)}';
    return Card(
        elevation: 4.0,
        child: Column(
          children: [
            ListTile(
              title: Text(heading),
              subtitle: Text(subheading),
              trailing: feedback != null
                  ? IconButton(
                      icon: feedback.liked
                          ? const Icon(Icons.favorite)
                          : const Icon(Icons.favorite_outline),
                      onPressed: () {
                        changeLikedFlag(feedback.id, !feedback.liked);
                      },
                    )
                  : const Icon(Icons.favorite_outline),
            ),
            feedback.image != null
                ? Container(
                    child: (kIsWeb)
                        ? FutureBuilder(
                            future: response,
                            builder: (BuildContext context,
                                AsyncSnapshot<Response> snapshot) {
                              if (snapshot.hasData) {
                                if (snapshot.data?.statusCode == 200) {
                                  return Image.network(
                                    feedback.image,
                                    height: 300.0,
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
                                  );
                                }
                                return Text(l.feedbackImageError);
                              }
                              return const CircularProgressIndicator();
                            },
                          )
                        : FutureBuilder(
                            future: AppUtil.filePath(
                                feedback.id,
                                feedback.image,
                                Const.feedbackImagesFolderName.key),
                            builder: (_, snapshot) {
                              if (snapshot.hasError) {
                                return Text(l.somethingWentWrong);
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
                              return Text(l.noImageAvailable);
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
                    sync();
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
