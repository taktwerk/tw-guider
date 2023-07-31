import 'dart:io';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/insert.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/instruction.dart';
import 'package:image_picker/image_picker.dart';

class FeedbackView extends StatefulWidget {
  const FeedbackView({super.key, required this.instruction});

  final InstructionElement instruction;

  @override
  State<StatefulWidget> createState() => _FeedbackViewState();
}

class _FeedbackViewState extends State<FeedbackView> {
  final _popupMenu = GlobalKey<PopupMenuButtonState>();
  final TextEditingController _controller = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey();
  Image? selectedImage;
  String? _imagesBytes;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  selectImage() async {
    XFile? pickedFile =
        await ImagePicker().pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      _imagesBytes = base64Encode(await pickedFile!.readAsBytes());

      if (kIsWeb) {
        selectedImage = Image.network(pickedFile.path);
      } else {
        selectedImage = Image.file(File(pickedFile.path));
      }
    } else {
      logger.i("No image chosen.");
    }

    setState(() {});
  }

  takeImage() async {
    XFile? takenImage =
        await ImagePicker().pickImage(source: ImageSource.camera);

    if (takenImage != null) {
      _imagesBytes = base64Encode(await takenImage.readAsBytes());

      if (kIsWeb) {
        selectedImage = Image.network(takenImage.path);
      } else {
        selectedImage = Image.file(File(takenImage.path));
      }
    } else {
      logger.i("No image taken.");
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
                margin: const EdgeInsets.all(10),
                //TODO: show file name here
                child: selectedImage == null
                    ? const Text("No Image selected.")
                    : const Text("Image uploaded.")),
            _getPopupMenuButton(),
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

  Widget _getPopupMenuButton() => PopupMenuButton(
        onSelected: (value) => print(value),
        key: _popupMenu,
        child: ElevatedButton.icon(
          onPressed: () {
            _popupMenu.currentState?.showButtonMenu();
          },
          icon: const Icon(Icons.folder_open),
          label: const Text("CHOOSE IMAGE"),
        ),
        itemBuilder: (context) => [
          _buildPopupMenuItem(
              "From Gallery", Icons.collections, 0, selectImage),
          _buildPopupMenuItem("Take Image", Icons.photo_camera, 1, takeImage)
        ],
      );

  PopupMenuItem _buildPopupMenuItem(
      String title, IconData iconData, int position, Function function) {
    return PopupMenuItem(
      onTap: () {
        function();
      },
      value: position,
      child: Row(
        children: [
          Icon(
            iconData,
            color: Colors.black,
          ),
          Text(title),
        ],
      ),
    );
  }
}
