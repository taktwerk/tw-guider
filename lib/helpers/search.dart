import 'dart:convert';
import 'package:guider/main.dart';
import 'package:guider/objects/category.dart';
import 'package:guider/objects/instruction.dart';
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

  static Future<List<Category>> getCategoriesOfInstruction(
      instructionId) async {
    final data = await supabase
        .from('category')
        .select('*, instruction_category!inner(*)')
        .eq('instruction_category.instruction_id', instructionId);
    final Categories categories = categoriesFromJson(jsonEncode(data));
    return categories.categories;
  }
}
