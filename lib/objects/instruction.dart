// To parse this JSON data, do
//
//     final instruction = instructionFromJson(jsonString);

import 'dart:convert';

Instructions instructionFromJson(String str) =>
    Instructions.fromJson(json.decode(str));

String instructionToJson(Instructions data) => json.encode(data.toJson());

class Instructions {
  List<InstructionElement> instructionElements;

  Instructions({
    required this.instructionElements,
  });

  factory Instructions.fromJson(Map<String, dynamic> json) => Instructions(
        instructionElements: List<InstructionElement>.from(
            json["instructions"].map((x) => InstructionElement.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "instructions":
            List<dynamic>.from(instructionElements.map((x) => x.toJson())),
      };
}

class InstructionElement {
  int id;
  String title;
  String shortTitle;
  String image;
  String description;

  InstructionElement(
      {required this.id,
      required this.title,
      required this.shortTitle,
      required this.image,
      required this.description});

  factory InstructionElement.fromJson(Map<String, dynamic> json) =>
      InstructionElement(
          id: json["id"],
          title: json["title"],
          shortTitle: json["short_title"],
          image: json["image"],
          description: json["description"]);

  Map<String, dynamic> toJson() => {
        "id": id,
        "title": title,
        "short_title": shortTitle,
        "image": image,
        "description": description
      };

  @override
  String toString() {
    return '{id: $id, title: $title}';
  }
}
