import 'dart:convert';

Histories historiesFromJson(String str) => Histories.fromJson(json.decode(str));

String historiesToJson(Histories data) => json.encode(data.toJson());

class Histories {
  List<History> histories;

  Histories({
    required this.histories,
  });

  factory Histories.fromJson(List<dynamic> json) => Histories(
        histories: List<History>.from(json.map((x) => History.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "histories": List<dynamic>.from(histories.map((x) => x.toJson())),
      };
}

class History {
  int userId;
  int instructionId;
  String updatedAt;
  int updatedBy;
  String createdAt;
  int createdBy;
  String? deletedAt;
  int? deletedBy;
  int? instructionStepId;

  History(
      {required this.userId,
      required this.instructionId,
      required this.updatedAt,
      required this.updatedBy,
      required this.createdAt,
      required this.createdBy,
      required this.deletedAt,
      required this.deletedBy,
      required this.instructionStepId});

  factory History.fromJson(Map<String, dynamic> json) => History(
      userId: json["user_id"],
      instructionId: json["instruction_id"],
      updatedAt: json["updated_at"],
      updatedBy: json["updated_by"],
      createdBy: json["created_by"],
      createdAt: json["created_at"],
      deletedAt: json["deleted_at"],
      deletedBy: json["deleted_by"],
      instructionStepId: json["instruction_step_id"]);

  Map<String, dynamic> toJson() => {
        "id": userId,
        "name": instructionId,
      };

  @override
  String toString() {
    return '{id: $userId, name: $instructionId}';
  }
}
