// To parse this JSON data, do
//
//     final users = usersFromJson(jsonString);

import 'dart:convert';

Users usersFromJson(String str) => Users.fromJson(json.decode(str));

String usersToJson(Users data) => json.encode(data.toJson());

class Users {
  List<User> users;

  Users({
    required this.users,
  });

  factory Users.fromJson(List<dynamic> json) => Users(
        users: List<User>.from(json.map((x) => User.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "users": List<dynamic>.from(users.map((x) => x.toJson())),
      };
}

class User {
  int id;
  String username;
  String role;
  String lastOnline;

  User({
    required this.id,
    required this.username,
    required this.role,
    required this.lastOnline,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
        id: json["id"],
        username: json["username"],
        role: json["role"],
        lastOnline: json["last_online"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "username": username,
        "role": role,
        "last_online": lastOnline,
      };
}
