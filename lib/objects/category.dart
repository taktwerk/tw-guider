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

  Category({
    required this.id,
    required this.name,
  });

  factory Category.fromJson(Map<String, dynamic> json) => Category(
        id: json["id"],
        name: json["name"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "name": name,
      };

  @override
  String toString() {
    return '{id: $id, name: $name}';
  }
}
