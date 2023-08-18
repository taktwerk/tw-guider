import 'dart:convert';
import 'dart:io';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:path_provider/path_provider.dart';
import 'package:crypto/crypto.dart';

class AppUtil {
  static String getFileName(String url) {
    String hash = "${md5.convert(utf8.encode(url))}";
    if (url.contains(".jpg")) {
      return "$hash.jpg";
    } else if (url.contains(".png")) {
      return "$hash.png";
    }
    return "$hash.png";
  }

  static String getInstructionImagesFolderPath(
      Directory directory, String foldername) {
    //App Document Directory + folder name
    return '${directory.path}/$foldername/';
  }

  static Future<String> createFolderInAppDocDir(
      String folderNameOfInstruction, String folderName) async {
    //Get Guider's Document Directory
    final Directory appDocDir = await getApplicationDocumentsDirectory();

    String path = getInstructionImagesFolderPath(appDocDir, folderName);

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

  static Future<String> filePath(entity, String foldername) async {
    final Directory appDocDir = await getApplicationDocumentsDirectory();
    final path =
        '${getInstructionImagesFolderPath(appDocDir, foldername)}${entity.id}/${getFileName(entity.image)}';
    if (await File(path).exists()) {
      return path;
    } else {
      return "";
    }
  }
}
