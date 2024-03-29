import 'dart:io';
import 'dart:convert';
import 'package:drift/drift.dart' as drift;
import 'package:file_selector/file_selector.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/constants.dart';
import 'package:guider/helpers/device_info.dart';
import 'package:guider/helpers/localstorage/app_util.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/helpers/localstorage/supabase_to_drift.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/widgets/feedback_dialog.dart';
import 'package:image_picker/image_picker.dart';
import 'package:xid/xid.dart';

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
  drift.Uint8List? image;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  selectImage() async {
    if (kIsWeb || DeviceInfo.isDevice()) {
      XFile? pickedFile =
          await ImagePicker().pickImage(source: ImageSource.gallery);
      if (pickedFile != null) {
        _imagesBytes = base64Encode(await pickedFile.readAsBytes());

        if (kIsWeb) {
          selectedImage = Image.network(pickedFile.path);
          image = await pickedFile.readAsBytes();
        } else {
          selectedImage = Image.file(File(pickedFile.path));
          image = await pickedFile.readAsBytes();
        }
      } else {
        logger.i("No image chosen.");
      }

      setState(() {});
    } else {
      const XTypeGroup typeGroup = XTypeGroup(
        label: 'images',
        extensions: <String>['jpg', 'png'],
      );
      final XFile? pickedFile =
          await openFile(acceptedTypeGroups: <XTypeGroup>[typeGroup]);
      if (pickedFile != null) {
        _imagesBytes = base64Encode(await pickedFile.readAsBytes());
        selectedImage = Image.file(File(pickedFile.path));
        image = await pickedFile.readAsBytes();
      }
      setState(() {});
    }
  }

  takeImage() async {
    if (!kIsWeb && !DeviceInfo.isDesktop()) {
      XFile? takenImage =
          await ImagePicker().pickImage(source: ImageSource.camera);

      if (takenImage != null) {
        _imagesBytes = base64Encode(await takenImage.readAsBytes());

        selectedImage = Image.file(File(takenImage.path));
        image = await takenImage.readAsBytes();

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
    return FeedbackDialog(
        controller: _controller,
        formKey: _formKey,
        feedbackDialogActions: getFeedbackActions(),
        additionalFeedbackContent: additionalFeedbackContent());
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
          // SYNC NOTE:
          if (_formKey.currentState!.validate() && currentUser != null) {
            String xid = Xid().toString();
            String? url;
            if (_imagesBytes != null) {
              String xidImage = Xid().toString();
              url =
                  "${Const.supabaseFeedbackImagesBucketUrl}$xidImage.png"; // TODO: png
              Singleton().getDatabase().insertFeedbackImageBytes(
                  BytesCompanion.insert(
                      feedbackId: xid,
                      image: _imagesBytes!,
                      imageXid: xidImage));
              if (!kIsWeb) {
                AppUtil.saveFeedbackImage(image!, xid, url);
              }
            }
            await Singleton().getDatabase().insertFeedback(
                FeedbackCompanion.insert(
                    id: xid,
                    instructionId: widget.instruction.id,
                    userId: currentUser!,
                    message: _controller.text,
                    image: drift.Value(url),
                    createdAt: DateTime.now().toUtc(),
                    createdBy: currentUser!,
                    updatedAt: DateTime.now().toUtc(),
                    updatedBy: currentUser!));
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

  Widget additionalFeedbackContent() {
    final l = Languages.of(context);
    return Column(
      children: [
        Container(
            margin: const EdgeInsets.all(10),
            // TODO: Show file name
            child: selectedImage == null
                ? Text(l!.noImageSelected)
                : Text(l!.imageSelected)),
        _getPopupMenuButton(),
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
    final l = Languages.of(context);
    return PopupMenuItem(
      enabled: (kIsWeb || DeviceInfo.isDesktop())
          ? title == l!.takeImage
              ? false
              : true
          : true,
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
