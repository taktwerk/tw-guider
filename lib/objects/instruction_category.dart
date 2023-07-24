// To parse this JSON data, do
//
//     final instructionCategory = instructionCategoryFromJson(jsonString);

import 'dart:convert';

InstructionCategory instructionCategoryFromJson(String str) =>
    InstructionCategory.fromJson(json.decode(str));

String instructionCategoryToJson(InstructionCategory data) =>
    json.encode(data.toJson());

class InstructionCategory {
  List<InstructionCategoryElement> instructionCategory;

  InstructionCategory({
    required this.instructionCategory,
  });

  factory InstructionCategory.fromJson(Map<String, dynamic> json) =>
      InstructionCategory(
        instructionCategory: List<InstructionCategoryElement>.from(
            json["instruction_category"]
                .map((x) => InstructionCategoryElement.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "instruction_category":
            List<dynamic>.from(instructionCategory.map((x) => x.toJson())),
      };
}

class InstructionCategoryElement {
  int id;
  int instructionId;
  int category;

  InstructionCategoryElement({
    required this.id,
    required this.instructionId,
    required this.category,
  });

  factory InstructionCategoryElement.fromJson(Map<String, dynamic> json) =>
      InstructionCategoryElement(
        id: json["id"],
        instructionId: json["instruction_id"],
        category: json["category"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "instruction_id": instructionId,
        "category": category,
      };
}
