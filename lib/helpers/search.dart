import 'dart:convert';
import 'package:guider/main.dart';
import 'package:guider/objects/category.dart';
import 'package:guider/objects/instruction.dart';
import 'package:guider/objects/instruction_steps.dart';
import 'package:guider/objects/user.dart';

class Search {
  static Future<List<InstructionElement>> getAllInstructions() async {
    final data = await supabase.from('instruction').select("*");
    return _mapToInstructions(data);
  }

  static Future<List<InstructionElement>> getInstructionBySearch(value) async {
    final data = await supabase
        .from('instruction')
        .select('*')
        .or('title.ilike.%$value%, short_title.ilike.%$value%');
    return _mapToInstructions(data);
  }

  static Future<List<InstructionStep>> getInstructionSteps(
      instructionId) async {
    final data = await supabase
        .from('instruction_step')
        .select('*')
        .eq('instruction_id', instructionId);
    final List<InstructionStep> instructionSteps = _mapToInstructionSteps(data);
    instructionSteps.sort(((a, b) => a.stepNr.compareTo(b.stepNr)));
    return instructionSteps;
  }

  static Future<List<Category>> getCategories() async {
    final data = await supabase.from('category').select('*');
    return _mapToCategories(data);
  }

  static Future<List<InstructionElement>> getInstructionByCategory(
      category) async {
    final data = await supabase
        .from('instruction')
        .select('*, instruction_category!inner(*)')
        .eq('instruction_category.category_id', category);
    return _mapToInstructions(data);
  }

  static Future<List<Category>> getCategoriesOfInstruction(
      instructionId) async {
    final data = await supabase
        .from('category')
        .select('*, instruction_category!inner(*)')
        .eq('instruction_category.instruction_id', instructionId);
    return _mapToCategories(data);
  }

  static List<Category> _mapToCategories(data) {
    final Categories categories = categoriesFromJson(jsonEncode(data));
    return categories.categories;
  }

  static List<InstructionElement> _mapToInstructions(data) {
    final Instructions instructions = instructionFromJson(jsonEncode(data));
    return instructions.instructionElements;
  }

  static List<InstructionStep> _mapToInstructionSteps(data) {
    final List<InstructionStep> instructionSteps =
        instructionStepsFromJson(jsonEncode(data)).instructionSteps;
    return instructionSteps;
  }

  static List<User> _mapToUsers(data) {
    final Users users = usersFromJson(jsonEncode(data));
    return users.users;
  }

  // Default: fetch history of user with id = 2
  static Future<List<InstructionElement>> getHistory({userId = 2}) async {
    final data = await supabase
        .from('history')
        .select('*, instruction(*)')
        .eq('user_id', userId)
        .limit(5)
        .order('updated_at', ascending: false);

    final instructions = [];

    for (final value in data) {
      instructions.add(value['instruction']);
    }
    return _mapToInstructions(instructions);
  }

  static Future<InstructionStep> getLastVisitedStep(
      {userId = 2, instructionId}) async {
    final data = await supabase
        .from('history')
        .select('instruction_step_id, instruction_step(*)')
        .eq('instruction_id', instructionId)
        .eq('user_id', userId);
    final steps = [data[0]['instruction_step']];
    final List<InstructionStep> instructionSteps =
        _mapToInstructionSteps(steps);
    return instructionSteps[0];
  }

  static Future<List<User>> getUsers() async {
    final data = await supabase.from('user').select('*');
    return _mapToUsers(data);
  }
}
