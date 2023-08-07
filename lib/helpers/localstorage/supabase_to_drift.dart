import 'dart:convert';

import 'package:drift/drift.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/category.dart';
import 'package:guider/objects/guider_database.dart';
import 'package:guider/objects/history.dart';
import 'package:guider/objects/instruction.dart';
import 'package:guider/objects/instruction_category.dart';
import 'package:guider/objects/instruction_steps.dart';

class SupabaseToDrift {
  static Future<void> getAllInstructions() async {
    final data = await supabase.from('instruction').select("*");
    var instructions =
        instructionFromJson(jsonEncode(data)).instructionElements;
    int len = instructions.length;
    for (int i = 0; i < len; i++) {
      var instr = instructions[i];
      await Singleton().getDatabase().createOrUpdateInstruction(
          InstructionsCompanion.insert(
              id: Value(instr.id),
              title: instr.title,
              shortTitle: instr.shortTitle,
              image: instr.image,
              description: instr.description,
              createdAt: DateTime.parse(instr.createdAt),
              createdBy: instr.createdBy,
              updatedAt: DateTime.parse(instr.updatedAt),
              updatedBy: instr.updatedBy,
              deletedAt: Value(DateTime.parse(instr.updatedAt)),
              deletedBy: Value(instr.deletedBy)));
    }
  }

  static Future<void> getAllInstructionSteps() async {
    final data = await supabase.from('instruction_step').select('*');
    var instructionSteps =
        instructionStepsFromJson(jsonEncode(data)).instructionSteps;
    int len = instructionSteps.length;
    for (int i = 0; i < len; i++) {
      var step = instructionSteps[i];
      await Singleton().getDatabase().createOrUpdateInstructionStep(
          InstructionStepsCompanion.insert(
              instructionId: step.instructionId,
              stepNr: step.stepNr,
              id: Value(step.id),
              image: step.image,
              description: step.description,
              createdAt: DateTime.parse(step.createdAt),
              createdBy: step.createdBy,
              updatedAt: DateTime.parse(step.updatedAt),
              updatedBy: step.updatedBy,
              deletedAt: Value(DateTime.parse(step.updatedAt)),
              deletedBy: Value(step.deletedBy)));
    }
  }

  static Future<void> getAllCategories() async {
    final data = await supabase.from('category').select('*');
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
              deletedAt: Value(DateTime.parse(category.updatedAt)),
              deletedBy: Value(category.deletedBy),
            ),
          );
    }
  }

  static Future<void> getHistory() async {
    final data = await supabase.from('history').select('*');
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
                deletedAt: Value(DateTime.parse(history.updatedAt)),
                deletedBy: Value(history.deletedBy),
                instructionStepId: Value(history.instructionStepId)),
          );
    }
  }

  static Future<void> getInstructionsCategories() async {
    final data = await supabase.from('instruction_category').select('*');
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
              deletedAt: Value(DateTime.parse(instructionCategory.updatedAt)),
              deletedBy: Value(instructionCategory.deletedBy),
            ),
          );
    }
  }

  static Future<void> sync() async {
    await SupabaseToDrift.getAllInstructions().then((value) {
      logger.i("Got instructions from supabase.");
    });
    await SupabaseToDrift.getAllInstructionSteps().then((value) {
      logger.i("Got instructionsteps from supabase.");
    });

    await SupabaseToDrift.getAllCategories().then((value) {
      logger.i("Got categories from supabase.");
    });

    await SupabaseToDrift.getHistory().then((value) {
      logger.i("Got history from supabase.");
    });

    await SupabaseToDrift.getInstructionsCategories().then((value) {
      logger.i("Got instructions-categories from supabase.");
    });
  }
}
