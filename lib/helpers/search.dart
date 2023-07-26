import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/category.dart';
import 'package:guider/objects/instruction.dart';
import 'package:guider/objects/instruction_category.dart';
import 'package:guider/objects/instruction_steps.dart';

class Search {
  static Future<List<InstructionElement>> getAllInstructions() async {
    final data = await supabase.from('instruction').select("*");
    final Instructions instructions = instructionFromJson(jsonEncode(data));
    return instructions.instructionElements;
  }

  static Future<List<InstructionElement>> getInstructionBySearch(value) async {
    final data = await supabase
        .from('instruction')
        .select('*')
        .or('title.ilike.%$value%, short_title.ilike.%$value%');
    final Instructions instructions = instructionFromJson(jsonEncode(data));
    return instructions.instructionElements;
  }

  static Future<List<InstructionStep>> getInstructionSteps(
      instructionId) async {
    final data = await supabase
        .from('instruction_step')
        .select('*')
        .eq('instruction_id', instructionId);
    final List<InstructionStep> instructionSteps =
        instructionStepsFromJson(jsonEncode(data)).instructionSteps;
    instructionSteps.sort(((a, b) => a.stepNr.compareTo(b.stepNr)));
    return instructionSteps;
  }

  static Future<List<Category>> getCategories() async {
    final data = await supabase.from('category').select('*');
    final Categories categories = categoriesFromJson(jsonEncode(data));
    return categories.categories;
  }

  static Future<List<InstructionElement>> getInstructionByCategory(
      category) async {
    final data = await supabase
        .from('instruction')
        .select('*, instruction_category!inner(*)')
        .eq('instruction_category.category_id', category);
    final Instructions instructions = instructionFromJson(jsonEncode(data));
    return instructions.instructionElements;
  }

  static Future<List<InstructionCategoryElement>>
      _getInstructionCategoryTuples() async {
    final String response =
        await rootBundle.loadString('assets/jsons/instruction_category.json');
    final InstructionCategory instructionCategory =
        instructionCategoryFromJson(response);
    return instructionCategory.instructionCategories;
  }

  static Future<List<Category>> getCategoriesOfInstruction(
      instructionId) async {
    var allCategories = await getCategories();
    var instruction_category = await _getInstructionCategoryTuples();
    final ids = <int>[];
    for (var tuple in instruction_category) {
      if (tuple.instructionId == instructionId) {
        ids.add(tuple.category);
      }
    }
    final filtered =
        allCategories.where((category) => ids.contains(category.id)).toList();
    return filtered;
  }

  // static Future<List<InstructionElement>> getAllInstructions() async {
  //   final String response =
  //       await rootBundle.loadString('assets/jsons/instruction.json');
  //   final Instructions instructions = instructionFromJson(response);
  //   //print(instructions.instructionElements);
  //   return instructions.instructionElements;
  // }

  // static Future<List<InstructionElement>> getInstructionBySearch(value) async {
  //   var allInstructions = await getAllInstructions();
  //   final result = <InstructionElement>[];
  //   for (var item in allInstructions) {
  //     if (_isContained(item, value)) {
  //       result.add(item);
  //     }
  //   }
  //   logger.i("Found ${result.length} instructions.");
  //   return result;
  // }

  // static bool _isContained(item, value) {
  //   var lowercaseItemTitle = item.title.toLowerCase();
  //   var lowercaseItemShorttitle = item.shortTitle.toLowerCase();
  //   var lowercaseValue = value.toLowerCase();
  //   if (lowercaseItemTitle.contains(lowercaseValue) ||
  //       lowercaseItemShorttitle.contains(lowercaseValue)) {
  //     return true;
  //   }
  //   return false;
  // }

  // static Future<List<InstructionStep>> getInstructionSteps(
  //     instructionId) async {
  //   final String response =
  //       await rootBundle.loadString('assets/jsons/instruction_step.json');
  //   final InstructionSteps instructionsteps =
  //       instructionStepsFromJson(response);
  //   final filteredList = <InstructionStep>[];
  //   for (var step in instructionsteps.instructionSteps) {
  //     if (_filterByInstructionId(step, instructionId)) {
  //       filteredList.add(step);
  //     }
  //   }
  //   filteredList.sort(((a, b) => a.stepNr.compareTo(b.stepNr)));
  //   return filteredList;
  // }

  //   static bool _filterByInstructionId(step, instructionId) {
  //   if (step.instructionId == instructionId) {
  //     return true;
  //   }
  //   return false;
  // }

  // static Future<List<Category>> getCategories() async {
  //   final String response =
  //       await rootBundle.loadString('assets/jsons/category.json');
  //   final Categories categories = categoriesFromJson(response);
  //   return categories.categories;
  // }

  // static Future<List<InstructionElement>> getInstructionByCategory(
  //     category) async {
  //   var allInstructions = await getAllInstructions();
  //   var instruction_category = await _getInstructionCategoryTuples();
  //   final result = <InstructionElement>[];
  //   for (var instruction in allInstructions) {
  //     if (_isInCategory(instruction, category, instruction_category)) {
  //       result.add(instruction);
  //     }
  //   }
  //   return result;
  // }

  // static bool _isInCategory(instruction, category, instructionCategory) {
  //   for (var item in instructionCategory) {
  //     if (item.instructionId == instruction.id && item.category == category) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }
}
