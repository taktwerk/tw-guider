import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/localstorage.dart' as local;
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
    final l = Languages.of(context);
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
    var heading = feedback.message;
    var subheading = feedback.id;
    NetworkImage? cardImage =
        feedback.image != null ? NetworkImage(feedback.image) : null;
    var supportingText =
        'Created at: ${feedback.createdAt}, Updated at: ${feedback.updatedAt}';
    return Card(
        elevation: 4.0,
        child: Column(
          children: [
            ListTile(
              title: Text(heading),
              subtitle: Text(subheading),
              trailing: const Icon(Icons.favorite_outline),
            ),
            cardImage != null
                ? Container(
                    height: 200.0,
                    child: Ink.image(
                      image: cardImage,
                      fit: BoxFit.cover,
                    ),
                  )
                : Container(),
            Container(
              padding: const EdgeInsets.all(16.0),
              alignment: Alignment.centerLeft,
              child: Text(supportingText),
            ),
            ButtonBar(
              children: [
                TextButton(
                  child: const Text('Edit'),
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
}