import 'package:flutter/services.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/category.dart';
import 'package:guider/objects/instruction.dart';
import 'package:guider/objects/instruction_category.dart';
import 'package:guider/objects/instruction_steps.dart';

class Search {
  static Future<List<InstructionElement>> getAllInstructions() async {
    final String response =
        await rootBundle.loadString('assets/jsons/instruction.json');
    final Instructions instructions = instructionFromJson(response);
    return instructions.instructionElements;
  }

  static Future<List<InstructionElement>> getInstructionBySearch(value) async {
    var allInstructions = await getAllInstructions();
    final result = <InstructionElement>[];
    for (var item in allInstructions) {
      if (_isContained(item, value)) {
        result.add(item);
      }
    }
    logger.i("Found ${result.length} instructions.");
    return result;
  }

  static bool _isContained(item, value) {
    var lowercaseItemTitle = item.title.toLowerCase();
    var lowercaseItemShorttitle = item.shortTitle.toLowerCase();
    var lowercaseValue = value.toLowerCase();
    if (lowercaseItemTitle.contains(lowercaseValue) ||
        lowercaseItemShorttitle.contains(lowercaseValue)) {
      return true;
    }
    return false;
  }

  static Future<List<InstructionStep>> getInstructionSteps(
      instructionId) async {
    final String response =
        await rootBundle.loadString('assets/jsons/instruction_step.json');
    final InstructionSteps instructionsteps =
        instructionStepsFromJson(response);
    final filteredList = <InstructionStep>[];
    for (var step in instructionsteps.instructionSteps) {
      if (_filterByInstructionId(step, instructionId)) {
        filteredList.add(step);
      }
    }
    filteredList.sort(((a, b) => a.stepNr.compareTo(b.stepNr)));
    return filteredList;
  }

  static bool _filterByInstructionId(step, instructionId) {
    if (step.instructionId == instructionId) {
      return true;
    }
    return false;
  }

  static Future<List<Category>> getCategories() async {
    final String response =
        await rootBundle.loadString('assets/jsons/category.json');
    final Categories categories = categoriesFromJson(response);
    return categories.categoryElements;
  }

  static Future<List<InstructionElement>> getInstructionByCategory(
      category) async {
    var allInstructions = await getAllInstructions();
    final String response =
        await rootBundle.loadString('assets/jsons/instruction_category.json');
    final InstructionCategory instructionCategory =
        instructionCategoryFromJson(response);
    final result = <InstructionElement>[];
    for (var instruction in allInstructions) {
      if (_isInCategory(
          instruction, category, instructionCategory.instructionCategory)) {
        result.add(instruction);
      }
    }
    return result;
  }

  static bool _isInCategory(instruction, category, instructionCategory) {
    for (var item in instructionCategory) {
      if (item.instructionId == instruction.id && item.category == category) {
        return true;
      }
    }
    return false;
  }
}
