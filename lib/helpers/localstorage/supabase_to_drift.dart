import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:guider/helpers/localstorage/app_util.dart';
import 'package:http/http.dart' as http;
import 'package:drift/drift.dart';
import 'package:guider/helpers/localstorage/key_value.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/category.dart';
import 'package:guider/objects/feedback.dart';
import 'package:guider/objects/setting.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/objects/history.dart';
import 'package:guider/objects/instruction.dart';
import 'package:guider/objects/instruction_category.dart';
import 'package:guider/objects/instruction_steps.dart';
import 'package:guider/objects/user.dart';
import 'package:path/path.dart';

class SupabaseToDrift {
  static Future<void> getAllInstructions() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.instruction.key);
    final data = await supabase
        .from('instruction')
        .select("*")
        .gt('updated_at', lastSynced);
    var instructions =
        instructionFromJson(jsonEncode(data)).instructionElements;
    int len = instructions.length;
    for (int i = 0; i < len; i++) {
      var instr = instructions[i];

      if (!kIsWeb) {
        //only downloads the first 10 images (not all 1000)
        if (i >= 0 && i <= 10) {
          _downloadImages(instr);
        }
      }

      await Singleton()
          .getDatabase()
          .createOrUpdateInstruction(InstructionsCompanion.insert(
            id: Value(instr.id),
            title: instr.title,
            shortTitle: instr.shortTitle,
            image: instr.image,
            description: instr.description,
            createdAt: DateTime.parse(instr.createdAt),
            createdBy: instr.createdBy,
            updatedAt: DateTime.parse(instr.updatedAt),
            updatedBy: instr.updatedBy,
            deletedAt: Value(DateTime.tryParse(instr.deletedAt ?? "")),
            deletedBy: Value(instr.deletedBy),
          ));
    }
  }

  static void _downloadImages(InstructionElement instruction) async {
    final response = await http.get(Uri.parse(instruction.image));
    String folderInAppDocDir =
        await AppUtil.createFolderInAppDocDir(instruction.id.toString());
    final file =
        File(join(folderInAppDocDir, AppUtil.getFileName(instruction.id)));
    if (!(await file.exists())) {
      file.writeAsBytesSync(response.bodyBytes);
    }
  }

  static Future<void> getAllInstructionSteps() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.steps.key);
    final data = await supabase
        .from('instruction_step')
        .select('*')
        .gt('updated_at', lastSynced);
    var instructionSteps =
        instructionStepsFromJson(jsonEncode(data)).instructionSteps;
    int len = instructionSteps.length;
    for (int i = 0; i < len; i++) {
      var step = instructionSteps[i];
      await Singleton()
          .getDatabase()
          .createOrUpdateInstructionStep(InstructionStepsCompanion.insert(
            instructionId: step.instructionId,
            stepNr: step.stepNr,
            id: Value(step.id),
            image: step.image,
            description: step.description,
            createdAt: DateTime.parse(step.createdAt),
            createdBy: step.createdBy,
            updatedAt: DateTime.parse(step.updatedAt),
            updatedBy: step.updatedBy,
            deletedAt: Value(DateTime.tryParse(step.deletedAt ?? "")),
            deletedBy: Value(step.deletedBy),
          ));
    }
  }

  static Future<void> getAllCategories() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.category.key);
    final data = await supabase
        .from('category')
        .select('*')
        .gt('updated_at', lastSynced);
    var categories = categoriesFromJson(jsonEncode(data)).categories;
    int len = categories.length;
    for (int i = 0; i < len; i++) {
      var category = categories[i];
      await Singleton().getDatabase().createOrUpdateCategory(
            CategoriesCompanion.insert(
              id: Value(category.id),
              name: category.name,
              createdAt: DateTime.parse(category.createdAt),
              createdBy: category.createdBy,
              updatedAt: DateTime.parse(category.updatedAt),
              updatedBy: category.updatedBy,
              deletedAt: Value(DateTime.tryParse(category.deletedAt ?? "")),
              deletedBy: Value(category.deletedBy),
            ),
          );
    }
  }

  static Future<void> getHistory() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.history.key);
    print("Last synced history: $lastSynced");
    final data =
        await supabase.from('history').select('*').gt('updated_at', lastSynced);
    print("Got history changes: $data");
    var histories = historiesFromJson(jsonEncode(data)).histories;
    int len = histories.length;
    for (int i = 0; i < len; i++) {
      var history = histories[i];
      await Singleton().getDatabase().createOrUpdateHistory(
            HistoriesCompanion.insert(
                instructionId: history.instructionId,
                userId: history.userId,
                createdAt: DateTime.parse(history.createdAt),
                createdBy: history.createdBy,
                updatedAt: DateTime.parse(history.updatedAt),
                updatedBy: history.updatedBy,
                deletedAt: Value(DateTime.tryParse(history.deletedAt ?? "")),
                deletedBy: Value(history.deletedBy),
                instructionStepId: Value(history.instructionStepId)),
          );
    }
  }

  static Future<void> getInstructionsCategories() async {
    var lastSynced =
        await KeyValue.getValue(KeyValueEnum.instructionCategory.key);
    final data = await supabase
        .from('instruction_category')
        .select('*')
        .gt('updated_at', lastSynced);
    var instructionsCategories =
        instructionsCategoriesFromJson(jsonEncode(data)).instructionsCategories;
    int len = instructionsCategories.length;
    for (int i = 0; i < len; i++) {
      var instructionCategory = instructionsCategories[i];
      await Singleton().getDatabase().createOrUpdateInstructionCategory(
            InstructionsCategoriesCompanion.insert(
              categoryId: instructionCategory.categoryId,
              instructionId: instructionCategory.instructionId,
              createdAt: DateTime.parse(instructionCategory.createdAt),
              createdBy: instructionCategory.createdBy,
              updatedAt: DateTime.parse(instructionCategory.updatedAt),
              updatedBy: instructionCategory.updatedBy,
              deletedAt:
                  Value(DateTime.tryParse(instructionCategory.deletedAt ?? "")),
              deletedBy: Value(instructionCategory.deletedBy),
            ),
          );
    }
  }

  static Future<void> getFeedback() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.feedback.key);
    final data = await supabase
        .from('feedback')
        .select('*')
        .gt('updated_at', lastSynced);
    var feedback = feedbackFromJson(jsonEncode(data)).feedbackelements;
    int len = feedback.length;
    for (int i = 0; i < len; i++) {
      var feedbackElement = feedback[i];
      await Singleton()
          .getDatabase()
          .createOrUpdateFeedback(FeedbackCompanion.insert(
            id: feedbackElement.id,
            isSynced: true,
            instructionId: feedbackElement.instructionId,
            userId: feedbackElement.userId,
            message: feedbackElement.message,
            image: Value(feedbackElement.image),
            createdAt: DateTime.parse(feedbackElement.createdAt),
            createdBy: feedbackElement.createdBy,
            updatedAt: DateTime.parse(feedbackElement.updatedAt),
            updatedBy: feedbackElement.updatedBy,
            deletedAt:
                Value(DateTime.tryParse(feedbackElement.deletedAt ?? "")),
            deletedBy: Value(feedbackElement.deletedBy),
          ));
    }
  }

  static Future<void> getUsers() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.user.key);
    final data =
        await supabase.from('user').select('*').gt('updated_at', lastSynced);
    var users = usersFromJson(jsonEncode(data)).users;
    int len = users.length;
    for (int i = 0; i < len; i++) {
      var user = users[i];
      await Singleton().getDatabase().createOrUpdateUser(UsersCompanion.insert(
            id: Value(user.id),
            username: user.username,
            role: user.role,
            createdAt: DateTime.parse(user.createdAt),
            createdBy: user.createdBy,
            updatedAt: DateTime.parse(user.updatedAt),
            updatedBy: user.updatedBy,
            deletedAt: Value(DateTime.tryParse(user.deletedAt ?? "")),
            deletedBy: Value(user.deletedBy),
          ));
    }
  }

  static Future<void> getSettings() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.setting.key);
    final data =
        await supabase.from('setting').select('*').gt('updated_at', lastSynced);
    var settings = settingsFromJson(jsonEncode(data)).settings;
    int len = settings.length;
    for (int i = 0; i < len; i++) {
      var setting = settings[i];
      await Singleton()
          .getDatabase()
          .createOrUpdateSetting(SettingsCompanion.insert(
            userId: Value(setting.userId),
            language: setting.language,
            createdAt: DateTime.parse(setting.createdAt),
            createdBy: setting.createdBy,
            updatedAt: DateTime.parse(setting.updatedAt),
            updatedBy: setting.updatedBy,
            deletedAt: Value(DateTime.tryParse(setting.deletedAt ?? "")),
            deletedBy: Value(setting.deletedBy),
          ));
    }
  }

  static Future<void> sync() async {
    await SupabaseToDrift.getAllInstructions().then((value) {
      logger.i("Got instructions from supabase.");
      KeyValue.setNewValue(KeyValueEnum.instruction.key,
          DateTime.now().toUtc().toIso8601String());
    });

    await SupabaseToDrift.getAllInstructionSteps().then((value) {
      logger.i("Got instructionsteps from supabase.");
      KeyValue.setNewValue(
          KeyValueEnum.steps.key, DateTime.now().toUtc().toIso8601String());
    });

    await SupabaseToDrift.getAllCategories().then((value) {
      logger.i("Got categories from supabase.");
      KeyValue.setNewValue(
          KeyValueEnum.category.key, DateTime.now().toUtc().toIso8601String());
    });

    await SupabaseToDrift.getHistory().then((value) {
      logger.i("Got history from supabase.");
      KeyValue.setNewValue(
          KeyValueEnum.history.key, DateTime.now().toUtc().toIso8601String());
    });

    await SupabaseToDrift.getInstructionsCategories().then((value) {
      logger.i("Got instructions-categories from supabase.");
      KeyValue.setNewValue(KeyValueEnum.instructionCategory.key,
          DateTime.now().toUtc().toIso8601String());
    });

    await SupabaseToDrift.getFeedback().then((value) {
      logger.i("Got feedback from supabase.");
      KeyValue.setNewValue(
          KeyValueEnum.feedback.key, DateTime.now().toUtc().toIso8601String());
    });

    await SupabaseToDrift.getUsers().then((value) {
      logger.i("Got users from supabase.");
      KeyValue.setNewValue(
          KeyValueEnum.user.key, DateTime.now().toUtc().toIso8601String());
      KeyValue.setInitialUser();
    });

    await SupabaseToDrift.getSettings().then((value) {
      logger.i("Got settings from supabase.");
      KeyValue.setNewValue(
          KeyValueEnum.setting.key, DateTime.now().toUtc().toIso8601String());
    });
  }
}
