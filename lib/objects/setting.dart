import 'dart:convert';

Settings settingsFromJson(String str) => Settings.fromJson(json.decode(str));

class Settings {
  List<Setting> settings;

  Settings({
    required this.settings,
  });

  factory Settings.fromJson(List<dynamic> json) => Settings(
        settings: List<Setting>.from(json.map((x) => Setting.fromJson(x))),
      );
}

class Setting {
  int userId;
  String language;
  String updatedAt;
  int updatedBy;
  String createdAt;
  int createdBy;
  String? deletedAt;
  int? deletedBy;

  Setting(
      {required this.userId,
      required this.language,
      required this.updatedAt,
      required this.updatedBy,
      required this.createdAt,
      required this.createdBy,
      required this.deletedAt,
      required this.deletedBy});

  factory Setting.fromJson(Map<String, dynamic> json) => Setting(
      userId: json["user_id"],
      language: json["language"],
      updatedAt: json["updated_at"],
      updatedBy: json["updated_by"],
      createdBy: json["created_by"],
      createdAt: json["created_at"],
      deletedAt: json["deleted_at"],
      deletedBy: json["deleted_by"]);

  @override
  String toString() {
    return '{user: $userId}';
  }
}
