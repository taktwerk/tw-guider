import 'package:flutter/material.dart';
import 'package:guider/languages/languages.dart';

class FeedbackDialog extends StatelessWidget {
  final TextEditingController controller;
  final GlobalKey<FormState> formKey;
  final List<Widget> feedbackDialogActions;
  final Widget? additionalFeedbackContent;

  const FeedbackDialog(
      {super.key,
      required this.controller,
      required this.formKey,
      required this.feedbackDialogActions,
      required this.additionalFeedbackContent});

  @override
  Widget build(BuildContext context) {
    final l = Languages.of(context);
    return AlertDialog(
        content: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: controller,
                keyboardType: TextInputType.multiline,
                decoration: InputDecoration(
                  hintText: l!.feedbackContent,
                  filled: true,
                ),
                maxLines: 5,
                maxLength: 4096,
                textInputAction: TextInputAction.done,
                validator: (String? text) {
                  if (text == null || text.isEmpty) {
                    return l.pleaseEnterValue;
                  }
                  return null;
                },
              ),
              additionalFeedbackContent != null
                  ? additionalFeedbackContent!
                  : Container()
            ],
          ),
        ),
        actions: feedbackDialogActions);
  }
}
