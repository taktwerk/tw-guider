import 'dart:convert';

Instructions instructionFromJson(String str) =>
    Instructions.fromJson(json.decode(str));

String instructionToJson(Instructions data) => json.encode(data.toJson());

class Instructions {
  List<InstructionElement> instructionElements;

  Instructions({
    required this.instructionElements,
  });

  factory Instructions.fromJson(List<dynamic> json) => Instructions(
        instructionElements: List<InstructionElement>.from(
            json.map((x) => InstructionElement.fromJson(x))),
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
  String updatedAt;
  int updatedBy;
  String createdAt;
  int createdBy;
  String? deletedAt;
  int? deletedBy;

  InstructionElement(
      {required this.id,
      required this.title,
      required this.shortTitle,
      required this.image,
      required this.description,
      required this.updatedAt,
      required this.updatedBy,
      required this.createdAt,
      required this.createdBy,
      required this.deletedAt,
      required this.deletedBy});

  factory InstructionElement.fromJson(Map<String, dynamic> json) =>
      InstructionElement(
          id: json["id"],
          title: json["title"],
          shortTitle: json["short_title"],
          image: json["image"],
          description: json["description"],
          updatedAt: json["updated_at"],
          updatedBy: json["updated_by"],
          createdBy: json["created_by"],
          createdAt: json["created_at"],
          deletedAt: json["deleted_at"],
          deletedBy: json["deleted_by"]);

  Map<String, dynamic> toJson() => {
        "id": id,
        "title": title,
        "short_title": shortTitle,
        "image": image,
        "description": description
      };

  @override
  String toString() {
    return '{title: $title}';
  }
}
