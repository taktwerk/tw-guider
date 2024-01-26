import 'package:drift/drift.dart' as drift;
import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/helpers/localstorage/supabase_to_drift.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/helpers/localstorage/localstorage.dart' as local;
import 'package:guider/widgets/feedback_dialog.dart';

class EditFeedback extends StatefulWidget {
  const EditFeedback({super.key, required this.feedback});
  final local.Feedback feedback;
  @override
  State<StatefulWidget> createState() => _EditFeedbackState();
}

class _EditFeedbackState extends State<EditFeedback> {
  final TextEditingController _controller = TextEditingController(text: "");
  final GlobalKey<FormState> _formKey = GlobalKey();
  Image? selectedImage;
  drift.Uint8List? image;

  @override
  void initState() {
    super.initState();
    _controller.text = widget.feedback.message;
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return getEditableForm();
  }

  Widget getEditableForm() {
    return FeedbackDialog(
      controller: _controller,
      formKey: _formKey,
      feedbackDialogActions: getFeedbackActions(),
      additionalFeedbackContent: null,
    );
  }

  List<Widget> getFeedbackActions() {
    final l = Languages.of(context);
    return [
      TextButton(
        child: Text(l!.cancel),
        onPressed: () => Navigator.pop(context),
      ),
      TextButton(
        child: Text(l.save),
        onPressed: () async {
          if (_formKey.currentState!.validate() && currentUser != null) {
            await Singleton().getDatabase().updateFeedback(FeedbackCompanion(
                id: drift.Value(widget.feedback.id),
                message: drift.Value(_controller.text),
                updatedAt: drift.Value(DateTime.now().toUtc()),
                updatedBy: drift.Value(currentUser!)));
            if (mounted) {
              ScaffoldMessenger.of(context)
                  .showSnackBar(SnackBar(content: Text(l.feedbackSaved)));
              Navigator.pop(context);
            }
            SupabaseToDrift.sync();
          }
        },
      )
    ];
  }
}
