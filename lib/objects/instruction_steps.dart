// To parse this JSON data, do
//
//     final instructionSteps = instructionStepsFromJson(jsonString);

import 'dart:convert';

InstructionSteps instructionStepsFromJson(String str) =>
    InstructionSteps.fromJson(json.decode(str));

String instructionStepsToJson(InstructionSteps data) =>
    json.encode(data.toJson());

class InstructionSteps {
  List<InstructionStep> instructionSteps;

  InstructionSteps({
    required this.instructionSteps,
  });

  factory InstructionSteps.fromJson(List<dynamic> json) => InstructionSteps(
        instructionSteps: List<InstructionStep>.from(
            json.map((x) => InstructionStep.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "instruction-steps":
            List<dynamic>.from(instructionSteps.map((x) => x.toJson())),
      };
}

class InstructionStep {
  int id;
  int instructionId;
  int stepNr;
  String description;
  String image;
  String updatedAt;
  int updatedBy;
  String createdAt;
  int createdBy;
  String? deletedAt;
  int? deletedBy;

  InstructionStep(
      {required this.id,
      required this.instructionId,
      required this.stepNr,
      required this.description,
      required this.image,
      required this.updatedAt,
      required this.updatedBy,
      required this.createdAt,
      required this.createdBy,
      required this.deletedAt,
      required this.deletedBy});

  factory InstructionStep.fromJson(Map<String, dynamic> json) =>
      InstructionStep(
          id: json["id"],
          instructionId: json["instruction_id"],
          stepNr: json["step_nr"],
          description: json["description"],
          image: json["image"],
          updatedAt: json["updated_at"],
          updatedBy: json["updated_by"],
          createdBy: json["created_by"],
          createdAt: json["created_at"],
          deletedAt: json["deleted_at"],
          deletedBy: json["deleted_by"]);

  Map<String, dynamic> toJson() => {
        "id": id,
        "instruction_id": instructionId,
        "step_nr": stepNr,
        "description": description,
      };

  @override
  String toString() {
    return '{id: $id, stepNr: $stepNr}';
  }
}
