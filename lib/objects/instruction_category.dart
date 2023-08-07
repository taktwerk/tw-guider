import 'dart:convert';

InstructionsCategories instructionsCategoriesFromJson(String str) =>
    InstructionsCategories.fromJson(json.decode(str));

String categoriesToJson(InstructionsCategories data) =>
    json.encode(data.toJson());

class InstructionsCategories {
  List<InstructionCategory> instructionsCategories;

  InstructionsCategories({
    required this.instructionsCategories,
  });

  factory InstructionsCategories.fromJson(List<dynamic> json) =>
      InstructionsCategories(
        instructionsCategories: List<InstructionCategory>.from(
            json.map((x) => InstructionCategory.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "instruction_category":
            List<dynamic>.from(instructionsCategories.map((x) => x.toJson())),
      };
}

class InstructionCategory {
  int instructionId;
  int categoryId;
  String updatedAt;
  int updatedBy;
  String createdAt;
  int createdBy;
  String? deletedAt;
  int? deletedBy;

  InstructionCategory(
      {required this.instructionId,
      required this.categoryId,
      required this.updatedAt,
      required this.updatedBy,
      required this.createdAt,
      required this.createdBy,
      required this.deletedAt,
      required this.deletedBy});

  factory InstructionCategory.fromJson(Map<String, dynamic> json) =>
      InstructionCategory(
          instructionId: json["instruction_id"],
          categoryId: json["category_id"],
          updatedAt: json["updated_at"],
          updatedBy: json["updated_by"],
          createdBy: json["created_by"],
          createdAt: json["created_at"],
          deletedAt: json["deleted_at"],
          deletedBy: json["deleted_by"]);

  Map<String, dynamic> toJson() => {
        "id": instructionId,
        "name": categoryId,
      };

  @override
  String toString() {
    return '{id: $instructionId, name: $categoryId}';
  }
}
