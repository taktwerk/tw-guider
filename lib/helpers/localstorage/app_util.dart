import 'dart:io';
import 'package:path_provider/path_provider.dart';

class AppUtil {
  static String getFileName(int instructionId) =>
      'Instruction_$instructionId.png';

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

  static Future<String> filePath(int instructionId) async {
    final Directory appDocDir = await getApplicationDocumentsDirectory();
    final path =
        '${getInstructionImagesFolderPath(appDocDir)}$instructionId/${getFileName(instructionId)}';
    if (await File(path).exists()) {
      return path;
    } else {
      return "";
    }
  }
}
