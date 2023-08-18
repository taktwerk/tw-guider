import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:guider/helpers/constants.dart';
import 'package:guider/helpers/localstorage/app_util.dart';
import 'package:guider/helpers/localstorage/drift_to_supabase.dart';
import 'package:http/http.dart' as http;
import 'package:drift/drift.dart';
import 'package:guider/helpers/localstorage/key_value.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:path/path.dart';

class SupabaseToDrift {
  static Future<String> getAllInstructions() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.instruction.key);
    var newLastSynced = lastSynced;
    final data = await supabase
        .from('instruction')
        .select("*")
        .gt('updated_at', lastSynced)
        .order('id', ascending: true);
    newLastSynced = DateTime.now().toUtc().toIso8601String();

    int len = data.length;
    for (int i = 0; i < len; i++) {
      var instruction = data[i];
      if (!kIsWeb) {
        //only downloads the first 10 images (not all 1000)
        if (i >= 0 && i <= 10) {
          _downloadImages(instruction, Const.instructionImagesFolderName.key);
        }
      }
      Singleton()
          .getDatabase()
          .createOrUpdateInstruction(InstructionsCompanion.insert(
            id: Value(instruction[Const.id.key]),
            title: instruction[Const.title.key],
            shortTitle: instruction[Const.shortTitle.key],
            image: instruction[Const.image.key],
            description: instruction[Const.description.key],
            createdAt: DateTime.parse(instruction[Const.createdAt.key]),
            createdBy: instruction[Const.createdBy.key],
            updatedAt: DateTime.parse(instruction[Const.updatedAt.key]),
            updatedBy: instruction[Const.updatedBy.key],
            deletedAt: Value(
                DateTime.tryParse(instruction[Const.deletedAt.key] ?? "")),
            deletedBy: Value(instruction[Const.deletedBy.key]),
          ));
    }
    return newLastSynced;
  }

  static void _downloadImages(entry, foldername) async {
    final response = await http.get(Uri.parse(entry[Const.image.key]));
    String folderInAppDocDir = await AppUtil.createFolderInAppDocDir(
        entry[Const.id.key].toString(), foldername);
    final file = File(
        join(folderInAppDocDir, AppUtil.getFileName(entry[Const.image.key])));
    if (!(await file.exists())) {
      if (folderInAppDocDir.isNotEmpty) {
        await AppUtil.deleteFolderContent(folderInAppDocDir);
      }
      file.writeAsBytesSync(response.bodyBytes);
    }
  }

  static Future<String> getAllInstructionSteps() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.steps.key);
    var newLastSynced = lastSynced;

    final data = await supabase
        .from('instruction_step')
        .select('*')
        .gt('updated_at', lastSynced);
    newLastSynced = DateTime.now().toUtc().toIso8601String();

    int len = data.length;
    for (int i = 0; i < len; i++) {
      var step = data[i];

      if (!kIsWeb) {
        //only downloads the first 30 images (not all 1000)
        if (i >= 0 && i <= 30) {
          _downloadImages(step, Const.instructionStepsImagesFolderName.key);
        }
      }
      await Singleton()
          .getDatabase()
          .createOrUpdateInstructionStep(InstructionStepsCompanion.insert(
            instructionId: step[Const.instructionId.key],
            stepNr: step[Const.stepNr.key],
            id: Value(step[Const.id.key]),
            image: step[Const.image.key],
            description: step[Const.description.key],
            createdAt: DateTime.parse(step[Const.createdAt.key]),
            createdBy: step[Const.createdBy.key],
            updatedAt: DateTime.parse(step[Const.updatedAt.key]),
            updatedBy: step[Const.updatedBy.key],
            deletedAt:
                Value(DateTime.tryParse(step[Const.deletedAt.key] ?? "")),
            deletedBy: Value(step[Const.deletedBy.key]),
          ));
    }
    return newLastSynced;
  }

  static Future<String> getAllCategories() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.category.key);
    var newLastSynced = lastSynced;
    final data = await supabase
        .from('category')
        .select('*')
        .gt('updated_at', lastSynced);

    newLastSynced = DateTime.now().toUtc().toIso8601String();

    int len = data.length;
    for (int i = 0; i < len; i++) {
      //var category = categories[i];
      var category = data[i];
      await Singleton().getDatabase().createOrUpdateCategory(
            CategoriesCompanion.insert(
              id: Value(category[Const.id.key]),
              name: category[Const.name.key],
              createdAt: DateTime.parse(category[Const.createdAt.key]),
              createdBy: category[Const.createdBy.key],
              updatedAt: DateTime.parse(category[Const.updatedAt.key]),
              updatedBy: category[Const.updatedBy.key],
              deletedAt:
                  Value(DateTime.tryParse(category[Const.deletedAt.key] ?? "")),
              deletedBy: Value(category[Const.deletedBy.key]),
            ),
          );
    }
    return newLastSynced;
  }

  static Future<String> getHistory() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.history.key);
    var newLastSynced = lastSynced;
    print("Last synced history: $lastSynced");
    final data =
        await supabase.from('history').select('*').gt('updated_at', lastSynced);
    newLastSynced = DateTime.now().toUtc().toIso8601String();

    print("Got history changes: $data");
    int len = data.length;
    for (int i = 0; i < len; i++) {
      var history = data[i];
      await Singleton().getDatabase().createOrUpdateHistory(
            HistoriesCompanion.insert(
                instructionId: history[Const.instructionId.key],
                userId: history[Const.userId.key],
                createdAt: DateTime.parse(history[Const.createdAt.key]),
                createdBy: history[Const.createdBy.key],
                updatedAt: DateTime.parse(history[Const.updatedAt.key]),
                updatedBy: history[Const.updatedBy.key],
                deletedAt: Value(
                    DateTime.tryParse(history[Const.deletedAt.key] ?? "")),
                deletedBy: Value(history[Const.deletedBy.key]),
                instructionStepId: Value(history[Const.instructionStepId.key])),
          );
    }
    return newLastSynced;
  }

  static Future<String> getInstructionsCategories() async {
    var lastSynced =
        await KeyValue.getValue(KeyValueEnum.instructionCategory.key);
    var newLastSynced = lastSynced;
    final data = await supabase
        .from('instruction_category')
        .select('*')
        .gt('updated_at', lastSynced);
    newLastSynced = DateTime.now().toUtc().toIso8601String();

    int len = data.length;
    for (int i = 0; i < len; i++) {
      var instructionCategory = data[i];
      await Singleton().getDatabase().createOrUpdateInstructionCategory(
            InstructionsCategoriesCompanion.insert(
              categoryId: instructionCategory[Const.categoryId.key],
              instructionId: instructionCategory[Const.instructionId.key],
              createdAt:
                  DateTime.parse(instructionCategory[Const.createdAt.key]),
              createdBy: instructionCategory[Const.createdBy.key],
              updatedAt:
                  DateTime.parse(instructionCategory[Const.updatedAt.key]),
              updatedBy: instructionCategory[Const.updatedBy.key],
              deletedAt: Value(DateTime.tryParse(
                  instructionCategory[Const.deletedAt.key] ?? "")),
              deletedBy: Value(instructionCategory[Const.deletedBy.key]),
            ),
          );
    }
    return newLastSynced;
  }

  static Future<String> getFeedback() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.feedback.key);
    var newLastSynced = lastSynced;
    final data = await supabase
        .from('feedback')
        .select('*')
        .gt('updated_at', lastSynced);
    newLastSynced = DateTime.now().toUtc().toIso8601String();

    int len = data.length;
    for (int i = 0; i < len; i++) {
      var feedbackElement = data[i];
      await Singleton()
          .getDatabase()
          .createOrUpdateFeedback(FeedbackCompanion.insert(
            id: feedbackElement[Const.id.key],
            isSynced: true,
            instructionId: feedbackElement[Const.instructionId.key],
            userId: feedbackElement[Const.userId.key],
            message: feedbackElement[Const.message.key],
            image: Value(feedbackElement[Const.image.key]),
            createdAt: DateTime.parse(feedbackElement[Const.createdAt.key]),
            createdBy: feedbackElement[Const.createdBy.key],
            updatedAt: DateTime.parse(feedbackElement[Const.updatedAt.key]),
            updatedBy: feedbackElement[Const.updatedBy.key],
            deletedAt: Value(
                DateTime.tryParse(feedbackElement[Const.deletedAt.key] ?? "")),
            deletedBy: Value(feedbackElement[Const.deletedBy.key]),
          ));
    }
    return newLastSynced;
  }

  static Future<String> getUsers() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.user.key);
    var newLastSynced = lastSynced;
    final data =
        await supabase.from('user').select('*').gt('updated_at', lastSynced);
    newLastSynced = DateTime.now().toUtc().toIso8601String();

    int len = data.length;
    for (int i = 0; i < len; i++) {
      var user = data[i];
      await Singleton().getDatabase().createOrUpdateUser(UsersCompanion.insert(
            id: Value(user[Const.id.key]),
            username: user[Const.username.key],
            role: user[Const.role.key],
            createdAt: DateTime.parse(user[Const.createdAt.key]),
            createdBy: user[Const.createdBy.key],
            updatedAt: DateTime.parse(user[Const.updatedAt.key]),
            updatedBy: user[Const.updatedBy.key],
            deletedAt:
                Value(DateTime.tryParse(user[Const.deletedAt.key] ?? "")),
            deletedBy: Value(user[Const.deletedBy.key]),
          ));
    }
    return newLastSynced;
  }

  static Future<void> initializeUsers() async {
    await SupabaseToDrift.getUsers().then(
      (value) async {
        logger.i("Got users from supabase. (INIT)");
        KeyValue.setNewValue(KeyValueEnum.user.key, value);
      },
    );
  }

  static Future<String> getSettings() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.setting.key);
    var newLastSynced = lastSynced;
    print("Settings last synced $lastSynced");
    final data =
        await supabase.from('setting').select('*').gt('updated_at', lastSynced);
    newLastSynced = DateTime.now().toUtc().toIso8601String();

    print("Settings data from supabase $data");
    int len = data.length;
    for (int i = 0; i < len; i++) {
      var setting = data[i];
      await Singleton()
          .getDatabase()
          .createOrUpdateSetting(SettingsCompanion.insert(
            userId: Value(setting[Const.userId.key]),
            language: setting[Const.language.key],
            createdAt: DateTime.parse(setting[Const.createdAt.key]),
            createdBy: setting[Const.createdBy.key],
            updatedAt: DateTime.parse(setting[Const.updatedAt.key]),
            updatedBy: setting[Const.updatedBy.key],
            deletedAt:
                Value(DateTime.tryParse(setting[Const.deletedAt.key] ?? "")),
            deletedBy: Value(setting[Const.deletedBy.key]),
          ));
    }
    return newLastSynced;
  }

  static Future<void> sync() async {
    await SupabaseToDrift.getAllInstructions().then((value) {
      logger.i("Got instructions from supabase.");
      KeyValue.setNewValue(KeyValueEnum.instruction.key, value);
    });

    await SupabaseToDrift.getAllInstructionSteps().then((value) {
      logger.i("Got instructionsteps from supabase.");
      KeyValue.setNewValue(KeyValueEnum.steps.key, value);
    });

    await SupabaseToDrift.getAllCategories().then((value) {
      logger.i("Got categories from supabase.");
      KeyValue.setNewValue(KeyValueEnum.category.key, value);
    });

    await SupabaseToDrift.getHistory().then((value) async {
      logger.i("Got history from supabase.");
      await DriftToSupabase.uploadHistory();
      KeyValue.setNewValue(KeyValueEnum.history.key, value);
    });

    await SupabaseToDrift.getInstructionsCategories().then((value) {
      logger.i("Got instructions-categories from supabase.");
      KeyValue.setNewValue(KeyValueEnum.instructionCategory.key, value);
    });

    await SupabaseToDrift.getFeedback().then((value) async {
      logger.i("Got feedback from supabase.");
      await DriftToSupabase.uploadFeedback();
      KeyValue.setNewValue(KeyValueEnum.feedback.key, value);
    });

    await SupabaseToDrift.getUsers().then((value) {
      logger.i("Got users from supabase.");
      KeyValue.setNewValue(KeyValueEnum.user.key, value);
      KeyValue.setInitialUser();
    });

    await SupabaseToDrift.getSettings().then((value) async {
      logger.i("Got settings from supabase.");
      await DriftToSupabase.uploadSettings();
      KeyValue.setNewValue(KeyValueEnum.setting.key, value);
    });
  }
}
