import 'dart:convert';

Feedback feedbackFromJson(String str) => Feedback.fromJson(json.decode(str));

class Feedback {
  List<FeedbackElements> feedbackelements;

  Feedback({
    required this.feedbackelements,
  });

  factory Feedback.fromJson(List<dynamic> json) => Feedback(
        feedbackelements: List<FeedbackElements>.from(
            json.map((x) => FeedbackElements.fromJson(x))),
      );
}

class FeedbackElements {
  String id;
  int userId;
  int instructionId;
  String message;
  String? image;
  String updatedAt;
  int updatedBy;
  String createdAt;
  int createdBy;
  String? deletedAt;
  int? deletedBy;

  FeedbackElements(
      {required this.id,
      required this.userId,
      required this.instructionId,
      required this.message,
      required this.image,
      required this.updatedAt,
      required this.updatedBy,
      required this.createdAt,
      required this.createdBy,
      required this.deletedAt,
      required this.deletedBy});

  factory FeedbackElements.fromJson(Map<String, dynamic> json) =>
      FeedbackElements(
          id: json["id"],
          userId: json["user_id"],
          instructionId: json["instruction_id"],
          message: json["message"],
          image: json["image"],
          updatedAt: json["updated_at"],
          updatedBy: json["updated_by"],
          createdBy: json["created_by"],
          createdAt: json["created_at"],
          deletedAt: json["deleted_at"],
          deletedBy: json["deleted_by"]);

  @override
  String toString() {
    return '{message: $message}';
  }
}
