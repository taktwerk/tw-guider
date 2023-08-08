import 'dart:io';
import 'dart:convert';
import 'package:file_selector/file_selector.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/insert.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:image_picker/image_picker.dart';

class FeedbackView extends StatefulWidget {
  const FeedbackView({super.key, required this.instruction});

  final Instruction instruction;

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

  bool isDevice() {
    return Platform.isAndroid || Platform.isIOS;
  }

  bool isDesktop() {
    return Platform.isMacOS || Platform.isLinux || Platform.isWindows;
  }

  selectImage() async {
    if (kIsWeb || isDevice()) {
      XFile? pickedFile =
          await ImagePicker().pickImage(source: ImageSource.gallery);
      if (pickedFile != null) {
        _imagesBytes = base64Encode(await pickedFile.readAsBytes());

        if (kIsWeb) {
          selectedImage = Image.network(pickedFile.path);
        } else {
          selectedImage = Image.file(File(pickedFile.path));
        }
      } else {
        logger.i("No image chosen.");
      }

      setState(() {});
    } else {
      logger.i("Desktop image.");

      const XTypeGroup typeGroup = XTypeGroup(
        label: 'images',
        extensions: <String>['jpg', 'png'],
      );
      final XFile? pickedFile =
          await openFile(acceptedTypeGroups: <XTypeGroup>[typeGroup]);
      if (pickedFile != null) {
        _imagesBytes = base64Encode(await pickedFile.readAsBytes());
        selectedImage = Image.file(File(pickedFile.path));
      }
      setState(() {});
    }
  }

  takeImage() async {
    if (!kIsWeb && !isDesktop()) {
      XFile? takenImage =
          await ImagePicker().pickImage(source: ImageSource.camera);

      if (takenImage != null) {
        _imagesBytes = base64Encode(await takenImage.readAsBytes());

        selectedImage = Image.file(File(takenImage.path));
        setState(() {});
      } else {
        logger.i("No image selected");
      }
    } else {
      selectImage();
    }
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final l = Languages.of(context);
    return AlertDialog(
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              controller: _controller,
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
            Container(
                margin: const EdgeInsets.all(10),
                //TODO: show file name here
                child: selectedImage == null
                    ? Text(l.noImageSelected)
                    : Text(l.imageSelected)),
            _getPopupMenuButton(),
          ],
        ),
      ),
      actions: [
        TextButton(
          child: Text(l.cancel),
          onPressed: () => Navigator.pop(context),
        ),
        TextButton(
          child: Text(l.send),
          onPressed: () async {
            if (_formKey.currentState!.validate()) {
              Insert.sendFeedback(
                  userId: currentUser,
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

  Widget _getPopupMenuButton() {
    final l = Languages.of(context);
    return PopupMenuButton(
      key: _popupMenu,
      child: ElevatedButton.icon(
        onPressed: () {
          _popupMenu.currentState?.showButtonMenu();
        },
        icon: const Icon(Icons.folder_open),
        label: Text(l!.chooseImage.toUpperCase()),
      ),
      itemBuilder: (context) => [
        _buildPopupMenuItem(l.fromGallery, Icons.collections, 0, selectImage),
        _buildPopupMenuItem(l.takeImage, Icons.photo_camera, 1, takeImage)
      ],
    );
  }

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
