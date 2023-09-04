import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart' as foundation;
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
    List<Insertable<Instruction>> instructionBatch = [];
    for (int i = 0; i < len; i++) {
      var instruction = data[i];
      if (!foundation.kIsWeb) {
        //only downloads the first 10 images (not all 1000)
        if (i >= 0 && i <= 10) {
          await _downloadImages(
              instruction, Const.instructionImagesFolderName.key);
        }
      }
      instructionBatch.add(InstructionsCompanion.insert(
        id: Value(instruction[Const.id.key]),
        title: instruction[Const.title.key],
        shortTitle: instruction[Const.shortTitle.key],
        image: instruction[Const.image.key],
        description: instruction[Const.description.key],
        createdAt: DateTime.parse(instruction[Const.createdAt.key]),
        createdBy: instruction[Const.createdBy.key],
        updatedAt: DateTime.parse(instruction[Const.updatedAt.key]),
        updatedBy: instruction[Const.updatedBy.key],
        deletedAt:
            Value(DateTime.tryParse(instruction[Const.deletedAt.key] ?? "")),
        deletedBy: Value(instruction[Const.deletedBy.key]),
      ));
    }
    await Singleton()
        .getDatabase()
        .insertMultipleInstructions(instructionBatch);
    return newLastSynced;
  }

  static Future<void> _downloadImages(entry, foldername) async {
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
    List<Insertable<InstructionStep>> instructionStepBatch = [];
    for (int i = 0; i < len; i++) {
      var step = data[i];

      if (!foundation.kIsWeb) {
        //only downloads the first 30 images (not all 1000)
        if (i >= 0 && i <= 30) {
          await _downloadImages(
              step, Const.instructionStepsImagesFolderName.key);
        }
      }
      instructionStepBatch.add(InstructionStepsCompanion.insert(
        instructionId: step[Const.instructionId.key],
        stepNr: step[Const.stepNr.key],
        id: Value(step[Const.id.key]),
        image: step[Const.image.key],
        description: step[Const.description.key],
        createdAt: DateTime.parse(step[Const.createdAt.key]),
        createdBy: step[Const.createdBy.key],
        updatedAt: DateTime.parse(step[Const.updatedAt.key]),
        updatedBy: step[Const.updatedBy.key],
        deletedAt: Value(DateTime.tryParse(step[Const.deletedAt.key] ?? "")),
        deletedBy: Value(step[Const.deletedBy.key]),
      ));
    }
    await Singleton()
        .getDatabase()
        .insertMultipleInstructionSteps(instructionStepBatch);
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
    List<Insertable<Category>> categoryBatch = [];
    int len = data.length;
    for (int i = 0; i < len; i++) {
      //var category = categories[i];
      var category = data[i];
      categoryBatch.add(CategoriesCompanion.insert(
        id: Value(category[Const.id.key]),
        name: category[Const.name.key],
        createdAt: DateTime.parse(category[Const.createdAt.key]),
        createdBy: category[Const.createdBy.key],
        updatedAt: DateTime.parse(category[Const.updatedAt.key]),
        updatedBy: category[Const.updatedBy.key],
        deletedAt:
            Value(DateTime.tryParse(category[Const.deletedAt.key] ?? "")),
        deletedBy: Value(category[Const.deletedBy.key]),
      ));
    }
    await Singleton().getDatabase().insertMultipleCategories(categoryBatch);
    return newLastSynced;
  }

  static Future<String> getHistory() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.history.key);
    var newLastSynced = lastSynced;
    final data =
        await supabase.from('history').select('*').gt('updated_at', lastSynced);
    newLastSynced = DateTime.now().toUtc().toIso8601String();

    await DriftToSupabase.uploadHistory(data);
    int len = data.length;
    for (int i = 0; i < len; i++) {
      var history = data[i];
      Singleton().getDatabase().createOrUpdateHistory(
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
                instructionStepId: Value(history[Const.instructionStepId.key]),
                open: history[Const.open.key],
                additionalData:
                    Value(jsonEncode(history[Const.additionalData.key]))),
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
    List<Insertable<InstructionCategory>> instructionCategoryBatch = [];

    for (int i = 0; i < len; i++) {
      var instructionCategory = data[i];
      instructionCategoryBatch.add(InstructionsCategoriesCompanion.insert(
        categoryId: instructionCategory[Const.categoryId.key],
        instructionId: instructionCategory[Const.instructionId.key],
        createdAt: DateTime.parse(instructionCategory[Const.createdAt.key]),
        createdBy: instructionCategory[Const.createdBy.key],
        updatedAt: DateTime.parse(instructionCategory[Const.updatedAt.key]),
        updatedBy: instructionCategory[Const.updatedBy.key],
        deletedAt: Value(
            DateTime.tryParse(instructionCategory[Const.deletedAt.key] ?? "")),
        deletedBy: Value(instructionCategory[Const.deletedBy.key]),
      ));
    }
    await Singleton()
        .getDatabase()
        .insertMultipleInstructionCategories(instructionCategoryBatch);
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

      if (!foundation.kIsWeb) {
        if (feedbackElement[Const.image.key] != null) {
          await _downloadImages(
              feedbackElement, Const.feedbackImagesFolderName.key);
        }
      }
      Singleton().getDatabase().createOrUpdateFeedback(FeedbackCompanion.insert(
            id: feedbackElement[Const.id.key],
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
    List<Insertable<User>> usersBatch = [];

    for (int i = 0; i < len; i++) {
      var user = data[i];
      usersBatch.add(UsersCompanion.insert(
        id: Value(user[Const.id.key]),
        username: user[Const.username.key],
        role: user[Const.role.key],
        createdAt: DateTime.parse(user[Const.createdAt.key]),
        createdBy: user[Const.createdBy.key],
        updatedAt: DateTime.parse(user[Const.updatedAt.key]),
        updatedBy: user[Const.updatedBy.key],
        deletedAt: Value(DateTime.tryParse(user[Const.deletedAt.key] ?? "")),
        deletedBy: Value(user[Const.deletedBy.key]),
      ));
    }
    await Singleton().getDatabase().insertMultipleUsers(usersBatch);
    return newLastSynced;
  }

  static Future<void> initializeUsers() async {
    await SupabaseToDrift.getUsers().then(
      (value) async {
        KeyValue.setNewValue(KeyValueEnum.user.key, value);
      },
    );
  }

  static Future<void> initializeSettings() async {
    await SupabaseToDrift.getSettings().then(
      (value) async {
        KeyValue.setNewValue(KeyValueEnum.setting.key, value);
      },
    );
  }

  static Future<String> getSettings() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.setting.key);
    var newLastSynced = lastSynced;
    final data =
        await supabase.from('setting').select('*').gt('updated_at', lastSynced);
    newLastSynced = DateTime.now().toUtc().toIso8601String();

    int len = data.length;
    for (int i = 0; i < len; i++) {
      var setting = data[i];
      Singleton().getDatabase().createOrUpdateSetting(SettingsCompanion.insert(
          userId: Value(setting[Const.userId.key]),
          language: setting[Const.language.key],
          createdAt: DateTime.parse(setting[Const.createdAt.key]),
          createdBy: setting[Const.createdBy.key],
          updatedAt: DateTime.parse(setting[Const.updatedAt.key]),
          updatedBy: setting[Const.updatedBy.key],
          deletedAt:
              Value(DateTime.tryParse(setting[Const.deletedAt.key] ?? "")),
          deletedBy: Value(setting[Const.deletedBy.key]),
          realtime: setting[Const.realtime.key],
          lightmode: setting[Const.lightmode.key]));
    }
    return newLastSynced;
  }

  static Future<void> sync() async {
    if (!Singleton().getSyncing()) {
      await Singleton().setSyncing(newSyncing: true);
      await SupabaseToDrift.getUsers().then((value) {
        KeyValue.setNewValue(KeyValueEnum.user.key, value);
      });

      await SupabaseToDrift.getAllInstructions().then((value) {
        KeyValue.setNewValue(KeyValueEnum.instruction.key, value);
      });

      await SupabaseToDrift.getAllInstructionSteps().then((value) {
        KeyValue.setNewValue(KeyValueEnum.steps.key, value);
      });

      await SupabaseToDrift.getAllCategories().then((value) {
        KeyValue.setNewValue(KeyValueEnum.category.key, value);
      });

      await SupabaseToDrift.getHistory().then((value) async {
        KeyValue.setNewValue(KeyValueEnum.history.key, value);
      });

      await SupabaseToDrift.getInstructionsCategories().then((value) {
        KeyValue.setNewValue(KeyValueEnum.instructionCategory.key, value);
      });

      await DriftToSupabase.uploadFeedbackImages();

      await SupabaseToDrift.getFeedback().then((value) async {
        await DriftToSupabase.uploadFeedback();
        KeyValue.setNewValue(KeyValueEnum.feedback.key, value);
      });

      await SupabaseToDrift.getSettings().then((value) async {
        await DriftToSupabase.uploadSettings();
        KeyValue.setNewValue(KeyValueEnum.setting.key, value);
      });
      await Singleton().setSyncing(newSyncing: false);
      await Singleton().setIsSynced(newSyncing: true);
    }
  }
}
