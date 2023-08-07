import 'dart:convert';

Categories categoriesFromJson(String str) =>
    Categories.fromJson(json.decode(str));

String categoriesToJson(Categories data) => json.encode(data.toJson());

class Categories {
  List<Category> categories;

  Categories({
    required this.categories,
  });

  factory Categories.fromJson(List<dynamic> json) => Categories(
        categories: List<Category>.from(json.map((x) => Category.fromJson(x))),
      );

  Map<String, dynamic> toJson() => {
        "category": List<dynamic>.from(categories.map((x) => x.toJson())),
      };
}

class Category {
  int id;
  String name;
  String updatedAt;
  int updatedBy;
  String createdAt;
  int createdBy;
  String? deletedAt;
  int? deletedBy;

  Category(
      {required this.id,
      required this.name,
      required this.updatedAt,
      required this.updatedBy,
      required this.createdAt,
      required this.createdBy,
      required this.deletedAt,
      required this.deletedBy});

  factory Category.fromJson(Map<String, dynamic> json) => Category(
      id: json["id"],
      name: json["name"],
      updatedAt: json["updated_at"],
      updatedBy: json["updated_by"],
      createdBy: json["created_by"],
      createdAt: json["created_at"],
      deletedAt: json["deleted_at"],
      deletedBy: json["deleted_by"]);

  Map<String, dynamic> toJson() => {
        "id": id,
        "name": name,
      };

  @override
  String toString() {
    return '{id: $id, name: $name}';
  }
}
