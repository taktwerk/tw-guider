import 'dart:io';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/insert.dart';
import 'package:guider/objects/instruction.dart';
import 'package:image_picker/image_picker.dart';

class FeedbackView extends StatefulWidget {
  const FeedbackView({super.key, required this.instruction});

  final InstructionElement instruction;

  @override
  State<StatefulWidget> createState() => _FeedbackViewState();
}

class _FeedbackViewState extends State<FeedbackView> {
  final TextEditingController _controller = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey();
  Image? selectedImage;
  String? _imagesBytes;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  // selectFile() async {
  //   FilePickerResult? result = null;
  //   if (kIsWeb) {
  //     // result = await FilePickerWeb.platform
  //     //     .pickFiles(type: FileType.custom, allowedExtensions: ['jpg', 'png']);
  //   } else {
  //     result = await FilePicker.platform
  //         .pickFiles(type: FileType.custom, allowedExtensions: ['jpg', 'png']);
  //   }

  //   if (result != null) {
  //     setState(() {
  //       String? path = result!.files.first.path;
  //       selectedfile = File(path!);
  //     });
  //   } else {
  //     print("No file selected");
  //   }

  //   setState(() {}); //update the UI so that file name is shown
  // }

  selectImage() async {
    XFile? pickedFile =
        await ImagePicker().pickImage(source: ImageSource.gallery);
    _imagesBytes = base64Encode(await pickedFile!.readAsBytes());
    if (pickedFile != null) {
      if (kIsWeb) {
        selectedImage = Image.network(pickedFile.path);
      } else {
        selectedImage = Image.file(File(pickedFile.path));
      }
    } else {
      print("No image selected");
    }

    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              controller: _controller,
              keyboardType: TextInputType.multiline,
              decoration: const InputDecoration(
                hintText: 'Enter your feedback here',
                filled: true,
              ),
              maxLines: 5,
              maxLength: 4096,
              textInputAction: TextInputAction.done,
              validator: (String? text) {
                if (text == null || text.isEmpty) {
                  return 'Please enter a value';
                }
                return null;
              },
            ),
            Container(
                margin: EdgeInsets.all(10),
                //TODO: show file name here
                child: selectedImage == null
                    ? const Text("No Image selected.")
                    : const Text("Image uploaded.")),
            ElevatedButton.icon(
              onPressed: () {
                selectImage();
              },
              icon: const Icon(Icons.folder_open),
              label: const Text("CHOOSE FILE"),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          child: const Text('Cancel'),
          onPressed: () => Navigator.pop(context),
        ),
        TextButton(
          child: const Text('Send'),
          onPressed: () async {
            if (_formKey.currentState!.validate()) {
              Insert.sendFeedback(
                  text: _controller.text,
                  instructionId: widget.instruction.id,
                  image: _imagesBytes);
              String message = 'Feedback sent successfully!';
              ScaffoldMessenger.of(context)
                  .showSnackBar(SnackBar(content: Text(message)));
              Navigator.pop(context);
            }
          },
        )
      ],
    );
  }
}
