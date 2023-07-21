import 'package:flutter/services.dart';
import 'package:guider/objects/category.dart';
import 'package:guider/objects/instruction.dart';
import 'package:guider/objects/instruction_steps.dart';

class Search {
  static Future<List<InstructionElement>> getAllInstructions() async {
    final String response =
        await rootBundle.loadString('assets/jsons/instruction.json');
    final Instructions instructions = instructionFromJson(response);
    return instructions.instructionElements;
  }

  static Future<List<InstructionElement>> getInstructionBySearch(value) async {
    // TODO: take from localstorage
    var allInstructions = await getAllInstructions();
    final result = <InstructionElement>[];
    for (var item in allInstructions) {
      if (_isContained(item, value)) {
        result.add(item);
      }
    }
    print("Found ${result.length} instructions");
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
}
