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

  factory InstructionSteps.fromJson(Map<String, dynamic> json) =>
      InstructionSteps(
        instructionSteps: List<InstructionStep>.from(
            json["instruction-steps"].map((x) => InstructionStep.fromJson(x))),
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

  InstructionStep({
    required this.id,
    required this.instructionId,
    required this.stepNr,
    required this.description,
  });

  factory InstructionStep.fromJson(Map<String, dynamic> json) =>
      InstructionStep(
        id: json["id"],
        instructionId: json["instruction_id"],
        stepNr: json["step_nr"],
        description: json["description"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "instruction_id": instructionId,
        "step_nr": stepNr,
        "description": description,
      };
}
