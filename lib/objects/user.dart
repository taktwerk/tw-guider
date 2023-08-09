// To parse this JSON data, do
//
//     final users = usersFromJson(jsonString);

import 'dart:convert';

Users usersFromJson(String str) => Users.fromJson(json.decode(str));

class Users {
  List<User> users;

  Users({
    required this.users,
  });

  factory Users.fromJson(List<dynamic> json) => Users(
        users: List<User>.from(json.map((x) => User.fromJson(x))),
      );
}

class User {
  int id;
  String username;
  String role;
  String createdAt;
  int createdBy;
  String updatedAt;
  int updatedBy;
  String? deletedAt;
  int? deletedBy;

  User({
    required this.id,
    required this.username,
    required this.role,
    required this.createdAt,
    required this.createdBy,
    required this.updatedAt,
    required this.updatedBy,
    required this.deletedAt,
    required this.deletedBy,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
      id: json["id"],
      username: json["username"],
      role: json["role"],
      createdAt: json["created_at"],
      createdBy: json["created_by"],
      updatedAt: json["updated_at"],
      updatedBy: json["updated_by"],
      deletedAt: json["deleted_at"],
      deletedBy: json["deleted_by"]);
}
