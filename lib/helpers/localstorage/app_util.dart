import 'dart:convert';
import 'dart:io';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:path_provider/path_provider.dart';
import 'package:crypto/crypto.dart';

class AppUtil {
  static String getFileName(String url) {
    if (url.contains(".jpg")) {
      return "${md5.convert(utf8.encode(url))}.jpg";
    } else if (url.contains(".png")) {
      print("Was png");
      return "${md5.convert(utf8.encode(url))}.png";
    }
    return "${md5.convert(utf8.encode(url))}.png";
  }

  static String getInstructionImagesFolderPath(Directory directory) {
    //App Document Directory + folder name
    return '${directory.path}/instructionImages/';
  }

  static Future<String> createFolderInAppDocDir(
      String folderNameOfInstruction) async {
    //Get Guider's Document Directory
    final Directory appDocDir = await getApplicationDocumentsDirectory();

    String path = getInstructionImagesFolderPath(appDocDir);

    final Directory instructionsFolder = Directory(path);
    if (!(await instructionsFolder.exists())) {
      // Create the instructionsImages folder if it does not exist
      await instructionsFolder.create(recursive: true);
    }
    // Folder where image will be saved
    final Directory appDocDirFolder =
        Directory('$path/$folderNameOfInstruction/');

    if (await appDocDirFolder.exists()) {
      //if folder already exists return path
      return appDocDirFolder.path;
    } else {
      //if folder not exists create folder and then return its path
      final Directory appDocDirNewFolder =
          await appDocDirFolder.create(recursive: true);
      return appDocDirNewFolder.path;
    }
  }

  static Future<void> deleteFolderContent(String directory) async {
    final List<FileSystemEntity> entities =
        await Directory(directory).list().toList();
    for (FileSystemEntity entity in entities) {
      entity.delete();
    }
  }

  static Future<String> filePath(Instruction instruction) async {
    final Directory appDocDir = await getApplicationDocumentsDirectory();
    final path =
        '${getInstructionImagesFolderPath(appDocDir)}${instruction.id}/${getFileName(instruction.image)}';
    if (await File(path).exists()) {
      return path;
    } else {
      return "";
    }
  }
}
