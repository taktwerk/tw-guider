// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'localstorage.dart';

// ignore_for_file: type=lint
class Categories extends Table with TableInfo<Categories, Category> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  Categories(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
      'name', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdByMeta =
      const VerificationMeta('createdBy');
  late final GeneratedColumn<int> createdBy = GeneratedColumn<int>(
      'created_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedByMeta =
      const VerificationMeta('updatedBy');
  late final GeneratedColumn<int> updatedBy = GeneratedColumn<int>(
      'updated_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _deletedAtMeta =
      const VerificationMeta('deletedAt');
  late final GeneratedColumn<DateTime> deletedAt = GeneratedColumn<DateTime>(
      'deleted_at', aliasedName, true,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _deletedByMeta =
      const VerificationMeta('deletedBy');
  late final GeneratedColumn<int> deletedBy = GeneratedColumn<int>(
      'deleted_by', aliasedName, true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      $customConstraints: '');
  @override
  List<GeneratedColumn> get $columns => [
        id,
        name,
        createdAt,
        createdBy,
        updatedAt,
        updatedBy,
        deletedAt,
        deletedBy
      ];
  @override
  String get aliasedName => _alias ?? 'categories';
  @override
  String get actualTableName => 'categories';
  @override
  VerificationContext validateIntegrity(Insertable<Category> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('name')) {
      context.handle(
          _nameMeta, name.isAcceptableOrUnknown(data['name']!, _nameMeta));
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('created_by')) {
      context.handle(_createdByMeta,
          createdBy.isAcceptableOrUnknown(data['created_by']!, _createdByMeta));
    } else if (isInserting) {
      context.missing(_createdByMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('updated_by')) {
      context.handle(_updatedByMeta,
          updatedBy.isAcceptableOrUnknown(data['updated_by']!, _updatedByMeta));
    } else if (isInserting) {
      context.missing(_updatedByMeta);
    }
    if (data.containsKey('deleted_at')) {
      context.handle(_deletedAtMeta,
          deletedAt.isAcceptableOrUnknown(data['deleted_at']!, _deletedAtMeta));
    }
    if (data.containsKey('deleted_by')) {
      context.handle(_deletedByMeta,
          deletedBy.isAcceptableOrUnknown(data['deleted_by']!, _deletedByMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Category map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Category(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      name: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}name'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      createdBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}created_by'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}updated_at'])!,
      updatedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}updated_by'])!,
      deletedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}deleted_at']),
      deletedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}deleted_by']),
    );
  }

  @override
  Categories createAlias(String alias) {
    return Categories(attachedDatabase, alias);
  }

  @override
  List<String> get customConstraints =>
      const ['CONSTRAINT category_pkey PRIMARY KEY(id)'];
  @override
  bool get dontWriteConstraints => true;
}

class Category extends DataClass implements Insertable<Category> {
  final int id;
  final String name;
  final DateTime createdAt;
  final int createdBy;
  final DateTime updatedAt;
  final int updatedBy;
  final DateTime? deletedAt;
  final int? deletedBy;
  const Category(
      {required this.id,
      required this.name,
      required this.createdAt,
      required this.createdBy,
      required this.updatedAt,
      required this.updatedBy,
      this.deletedAt,
      this.deletedBy});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['name'] = Variable<String>(name);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['created_by'] = Variable<int>(createdBy);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    map['updated_by'] = Variable<int>(updatedBy);
    if (!nullToAbsent || deletedAt != null) {
      map['deleted_at'] = Variable<DateTime>(deletedAt);
    }
    if (!nullToAbsent || deletedBy != null) {
      map['deleted_by'] = Variable<int>(deletedBy);
    }
    return map;
  }

  CategoriesCompanion toCompanion(bool nullToAbsent) {
    return CategoriesCompanion(
      id: Value(id),
      name: Value(name),
      createdAt: Value(createdAt),
      createdBy: Value(createdBy),
      updatedAt: Value(updatedAt),
      updatedBy: Value(updatedBy),
      deletedAt: deletedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedAt),
      deletedBy: deletedBy == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedBy),
    );
  }

  factory Category.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Category(
      id: serializer.fromJson<int>(json['id']),
      name: serializer.fromJson<String>(json['name']),
      createdAt: serializer.fromJson<DateTime>(json['created_at']),
      createdBy: serializer.fromJson<int>(json['created_by']),
      updatedAt: serializer.fromJson<DateTime>(json['updated_at']),
      updatedBy: serializer.fromJson<int>(json['updated_by']),
      deletedAt: serializer.fromJson<DateTime?>(json['deleted_at']),
      deletedBy: serializer.fromJson<int?>(json['deleted_by']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'name': serializer.toJson<String>(name),
      'created_at': serializer.toJson<DateTime>(createdAt),
      'created_by': serializer.toJson<int>(createdBy),
      'updated_at': serializer.toJson<DateTime>(updatedAt),
      'updated_by': serializer.toJson<int>(updatedBy),
      'deleted_at': serializer.toJson<DateTime?>(deletedAt),
      'deleted_by': serializer.toJson<int?>(deletedBy),
    };
  }

  Category copyWith(
          {int? id,
          String? name,
          DateTime? createdAt,
          int? createdBy,
          DateTime? updatedAt,
          int? updatedBy,
          Value<DateTime?> deletedAt = const Value.absent(),
          Value<int?> deletedBy = const Value.absent()}) =>
      Category(
        id: id ?? this.id,
        name: name ?? this.name,
        createdAt: createdAt ?? this.createdAt,
        createdBy: createdBy ?? this.createdBy,
        updatedAt: updatedAt ?? this.updatedAt,
        updatedBy: updatedBy ?? this.updatedBy,
        deletedAt: deletedAt.present ? deletedAt.value : this.deletedAt,
        deletedBy: deletedBy.present ? deletedBy.value : this.deletedBy,
      );
  @override
  String toString() {
    return (StringBuffer('Category(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, name, createdAt, createdBy, updatedAt,
      updatedBy, deletedAt, deletedBy);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Category &&
          other.id == this.id &&
          other.name == this.name &&
          other.createdAt == this.createdAt &&
          other.createdBy == this.createdBy &&
          other.updatedAt == this.updatedAt &&
          other.updatedBy == this.updatedBy &&
          other.deletedAt == this.deletedAt &&
          other.deletedBy == this.deletedBy);
}

class CategoriesCompanion extends UpdateCompanion<Category> {
  final Value<int> id;
  final Value<String> name;
  final Value<DateTime> createdAt;
  final Value<int> createdBy;
  final Value<DateTime> updatedAt;
  final Value<int> updatedBy;
  final Value<DateTime?> deletedAt;
  final Value<int?> deletedBy;
  const CategoriesCompanion({
    this.id = const Value.absent(),
    this.name = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.createdBy = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.updatedBy = const Value.absent(),
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
  });
  CategoriesCompanion.insert({
    this.id = const Value.absent(),
    required String name,
    required DateTime createdAt,
    required int createdBy,
    required DateTime updatedAt,
    required int updatedBy,
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
  })  : name = Value(name),
        createdAt = Value(createdAt),
        createdBy = Value(createdBy),
        updatedAt = Value(updatedAt),
        updatedBy = Value(updatedBy);
  static Insertable<Category> custom({
    Expression<int>? id,
    Expression<String>? name,
    Expression<DateTime>? createdAt,
    Expression<int>? createdBy,
    Expression<DateTime>? updatedAt,
    Expression<int>? updatedBy,
    Expression<DateTime>? deletedAt,
    Expression<int>? deletedBy,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (createdAt != null) 'created_at': createdAt,
      if (createdBy != null) 'created_by': createdBy,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (updatedBy != null) 'updated_by': updatedBy,
      if (deletedAt != null) 'deleted_at': deletedAt,
      if (deletedBy != null) 'deleted_by': deletedBy,
    });
  }

  CategoriesCompanion copyWith(
      {Value<int>? id,
      Value<String>? name,
      Value<DateTime>? createdAt,
      Value<int>? createdBy,
      Value<DateTime>? updatedAt,
      Value<int>? updatedBy,
      Value<DateTime?>? deletedAt,
      Value<int?>? deletedBy}) {
    return CategoriesCompanion(
      id: id ?? this.id,
      name: name ?? this.name,
      createdAt: createdAt ?? this.createdAt,
      createdBy: createdBy ?? this.createdBy,
      updatedAt: updatedAt ?? this.updatedAt,
      updatedBy: updatedBy ?? this.updatedBy,
      deletedAt: deletedAt ?? this.deletedAt,
      deletedBy: deletedBy ?? this.deletedBy,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (createdBy.present) {
      map['created_by'] = Variable<int>(createdBy.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (updatedBy.present) {
      map['updated_by'] = Variable<int>(updatedBy.value);
    }
    if (deletedAt.present) {
      map['deleted_at'] = Variable<DateTime>(deletedAt.value);
    }
    if (deletedBy.present) {
      map['deleted_by'] = Variable<int>(deletedBy.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('CategoriesCompanion(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy')
          ..write(')'))
        .toString();
  }
}

class Instructions extends Table with TableInfo<Instructions, Instruction> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  Instructions(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _titleMeta = const VerificationMeta('title');
  late final GeneratedColumn<String> title = GeneratedColumn<String>(
      'title', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _shortTitleMeta =
      const VerificationMeta('shortTitle');
  late final GeneratedColumn<String> shortTitle = GeneratedColumn<String>(
      'short_title', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _imageMeta = const VerificationMeta('image');
  late final GeneratedColumn<String> image = GeneratedColumn<String>(
      'image', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _descriptionMeta =
      const VerificationMeta('description');
  late final GeneratedColumn<String> description = GeneratedColumn<String>(
      'description', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdByMeta =
      const VerificationMeta('createdBy');
  late final GeneratedColumn<int> createdBy = GeneratedColumn<int>(
      'created_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedByMeta =
      const VerificationMeta('updatedBy');
  late final GeneratedColumn<int> updatedBy = GeneratedColumn<int>(
      'updated_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _deletedAtMeta =
      const VerificationMeta('deletedAt');
  late final GeneratedColumn<DateTime> deletedAt = GeneratedColumn<DateTime>(
      'deleted_at', aliasedName, true,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _deletedByMeta =
      const VerificationMeta('deletedBy');
  late final GeneratedColumn<int> deletedBy = GeneratedColumn<int>(
      'deleted_by', aliasedName, true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      $customConstraints: '');
  @override
  List<GeneratedColumn> get $columns => [
        id,
        title,
        shortTitle,
        image,
        description,
        createdAt,
        createdBy,
        updatedAt,
        updatedBy,
        deletedAt,
        deletedBy
      ];
  @override
  String get aliasedName => _alias ?? 'instructions';
  @override
  String get actualTableName => 'instructions';
  @override
  VerificationContext validateIntegrity(Insertable<Instruction> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('title')) {
      context.handle(
          _titleMeta, title.isAcceptableOrUnknown(data['title']!, _titleMeta));
    } else if (isInserting) {
      context.missing(_titleMeta);
    }
    if (data.containsKey('short_title')) {
      context.handle(
          _shortTitleMeta,
          shortTitle.isAcceptableOrUnknown(
              data['short_title']!, _shortTitleMeta));
    } else if (isInserting) {
      context.missing(_shortTitleMeta);
    }
    if (data.containsKey('image')) {
      context.handle(
          _imageMeta, image.isAcceptableOrUnknown(data['image']!, _imageMeta));
    } else if (isInserting) {
      context.missing(_imageMeta);
    }
    if (data.containsKey('description')) {
      context.handle(
          _descriptionMeta,
          description.isAcceptableOrUnknown(
              data['description']!, _descriptionMeta));
    } else if (isInserting) {
      context.missing(_descriptionMeta);
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('created_by')) {
      context.handle(_createdByMeta,
          createdBy.isAcceptableOrUnknown(data['created_by']!, _createdByMeta));
    } else if (isInserting) {
      context.missing(_createdByMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('updated_by')) {
      context.handle(_updatedByMeta,
          updatedBy.isAcceptableOrUnknown(data['updated_by']!, _updatedByMeta));
    } else if (isInserting) {
      context.missing(_updatedByMeta);
    }
    if (data.containsKey('deleted_at')) {
      context.handle(_deletedAtMeta,
          deletedAt.isAcceptableOrUnknown(data['deleted_at']!, _deletedAtMeta));
    }
    if (data.containsKey('deleted_by')) {
      context.handle(_deletedByMeta,
          deletedBy.isAcceptableOrUnknown(data['deleted_by']!, _deletedByMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Instruction map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Instruction(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      title: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}title'])!,
      shortTitle: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}short_title'])!,
      image: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}image'])!,
      description: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}description'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      createdBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}created_by'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}updated_at'])!,
      updatedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}updated_by'])!,
      deletedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}deleted_at']),
      deletedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}deleted_by']),
    );
  }

  @override
  Instructions createAlias(String alias) {
    return Instructions(attachedDatabase, alias);
  }

  @override
  List<String> get customConstraints =>
      const ['CONSTRAINT instruction_pkey PRIMARY KEY(id)'];
  @override
  bool get dontWriteConstraints => true;
}

class Instruction extends DataClass implements Insertable<Instruction> {
  final int id;
  final String title;
  final String shortTitle;
  final String image;
  final String description;
  final DateTime createdAt;
  final int createdBy;
  final DateTime updatedAt;
  final int updatedBy;
  final DateTime? deletedAt;
  final int? deletedBy;
  const Instruction(
      {required this.id,
      required this.title,
      required this.shortTitle,
      required this.image,
      required this.description,
      required this.createdAt,
      required this.createdBy,
      required this.updatedAt,
      required this.updatedBy,
      this.deletedAt,
      this.deletedBy});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['title'] = Variable<String>(title);
    map['short_title'] = Variable<String>(shortTitle);
    map['image'] = Variable<String>(image);
    map['description'] = Variable<String>(description);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['created_by'] = Variable<int>(createdBy);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    map['updated_by'] = Variable<int>(updatedBy);
    if (!nullToAbsent || deletedAt != null) {
      map['deleted_at'] = Variable<DateTime>(deletedAt);
    }
    if (!nullToAbsent || deletedBy != null) {
      map['deleted_by'] = Variable<int>(deletedBy);
    }
    return map;
  }

  InstructionsCompanion toCompanion(bool nullToAbsent) {
    return InstructionsCompanion(
      id: Value(id),
      title: Value(title),
      shortTitle: Value(shortTitle),
      image: Value(image),
      description: Value(description),
      createdAt: Value(createdAt),
      createdBy: Value(createdBy),
      updatedAt: Value(updatedAt),
      updatedBy: Value(updatedBy),
      deletedAt: deletedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedAt),
      deletedBy: deletedBy == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedBy),
    );
  }

  factory Instruction.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Instruction(
      id: serializer.fromJson<int>(json['id']),
      title: serializer.fromJson<String>(json['title']),
      shortTitle: serializer.fromJson<String>(json['short_title']),
      image: serializer.fromJson<String>(json['image']),
      description: serializer.fromJson<String>(json['description']),
      createdAt: serializer.fromJson<DateTime>(json['created_at']),
      createdBy: serializer.fromJson<int>(json['created_by']),
      updatedAt: serializer.fromJson<DateTime>(json['updated_at']),
      updatedBy: serializer.fromJson<int>(json['updated_by']),
      deletedAt: serializer.fromJson<DateTime?>(json['deleted_at']),
      deletedBy: serializer.fromJson<int?>(json['deleted_by']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'title': serializer.toJson<String>(title),
      'short_title': serializer.toJson<String>(shortTitle),
      'image': serializer.toJson<String>(image),
      'description': serializer.toJson<String>(description),
      'created_at': serializer.toJson<DateTime>(createdAt),
      'created_by': serializer.toJson<int>(createdBy),
      'updated_at': serializer.toJson<DateTime>(updatedAt),
      'updated_by': serializer.toJson<int>(updatedBy),
      'deleted_at': serializer.toJson<DateTime?>(deletedAt),
      'deleted_by': serializer.toJson<int?>(deletedBy),
    };
  }

  Instruction copyWith(
          {int? id,
          String? title,
          String? shortTitle,
          String? image,
          String? description,
          DateTime? createdAt,
          int? createdBy,
          DateTime? updatedAt,
          int? updatedBy,
          Value<DateTime?> deletedAt = const Value.absent(),
          Value<int?> deletedBy = const Value.absent()}) =>
      Instruction(
        id: id ?? this.id,
        title: title ?? this.title,
        shortTitle: shortTitle ?? this.shortTitle,
        image: image ?? this.image,
        description: description ?? this.description,
        createdAt: createdAt ?? this.createdAt,
        createdBy: createdBy ?? this.createdBy,
        updatedAt: updatedAt ?? this.updatedAt,
        updatedBy: updatedBy ?? this.updatedBy,
        deletedAt: deletedAt.present ? deletedAt.value : this.deletedAt,
        deletedBy: deletedBy.present ? deletedBy.value : this.deletedBy,
      );
  @override
  String toString() {
    return (StringBuffer('Instruction(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('shortTitle: $shortTitle, ')
          ..write('image: $image, ')
          ..write('description: $description, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, title, shortTitle, image, description,
      createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Instruction &&
          other.id == this.id &&
          other.title == this.title &&
          other.shortTitle == this.shortTitle &&
          other.image == this.image &&
          other.description == this.description &&
          other.createdAt == this.createdAt &&
          other.createdBy == this.createdBy &&
          other.updatedAt == this.updatedAt &&
          other.updatedBy == this.updatedBy &&
          other.deletedAt == this.deletedAt &&
          other.deletedBy == this.deletedBy);
}

class InstructionsCompanion extends UpdateCompanion<Instruction> {
  final Value<int> id;
  final Value<String> title;
  final Value<String> shortTitle;
  final Value<String> image;
  final Value<String> description;
  final Value<DateTime> createdAt;
  final Value<int> createdBy;
  final Value<DateTime> updatedAt;
  final Value<int> updatedBy;
  final Value<DateTime?> deletedAt;
  final Value<int?> deletedBy;
  const InstructionsCompanion({
    this.id = const Value.absent(),
    this.title = const Value.absent(),
    this.shortTitle = const Value.absent(),
    this.image = const Value.absent(),
    this.description = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.createdBy = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.updatedBy = const Value.absent(),
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
  });
  InstructionsCompanion.insert({
    this.id = const Value.absent(),
    required String title,
    required String shortTitle,
    required String image,
    required String description,
    required DateTime createdAt,
    required int createdBy,
    required DateTime updatedAt,
    required int updatedBy,
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
  })  : title = Value(title),
        shortTitle = Value(shortTitle),
        image = Value(image),
        description = Value(description),
        createdAt = Value(createdAt),
        createdBy = Value(createdBy),
        updatedAt = Value(updatedAt),
        updatedBy = Value(updatedBy);
  static Insertable<Instruction> custom({
    Expression<int>? id,
    Expression<String>? title,
    Expression<String>? shortTitle,
    Expression<String>? image,
    Expression<String>? description,
    Expression<DateTime>? createdAt,
    Expression<int>? createdBy,
    Expression<DateTime>? updatedAt,
    Expression<int>? updatedBy,
    Expression<DateTime>? deletedAt,
    Expression<int>? deletedBy,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (title != null) 'title': title,
      if (shortTitle != null) 'short_title': shortTitle,
      if (image != null) 'image': image,
      if (description != null) 'description': description,
      if (createdAt != null) 'created_at': createdAt,
      if (createdBy != null) 'created_by': createdBy,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (updatedBy != null) 'updated_by': updatedBy,
      if (deletedAt != null) 'deleted_at': deletedAt,
      if (deletedBy != null) 'deleted_by': deletedBy,
    });
  }

  InstructionsCompanion copyWith(
      {Value<int>? id,
      Value<String>? title,
      Value<String>? shortTitle,
      Value<String>? image,
      Value<String>? description,
      Value<DateTime>? createdAt,
      Value<int>? createdBy,
      Value<DateTime>? updatedAt,
      Value<int>? updatedBy,
      Value<DateTime?>? deletedAt,
      Value<int?>? deletedBy}) {
    return InstructionsCompanion(
      id: id ?? this.id,
      title: title ?? this.title,
      shortTitle: shortTitle ?? this.shortTitle,
      image: image ?? this.image,
      description: description ?? this.description,
      createdAt: createdAt ?? this.createdAt,
      createdBy: createdBy ?? this.createdBy,
      updatedAt: updatedAt ?? this.updatedAt,
      updatedBy: updatedBy ?? this.updatedBy,
      deletedAt: deletedAt ?? this.deletedAt,
      deletedBy: deletedBy ?? this.deletedBy,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (shortTitle.present) {
      map['short_title'] = Variable<String>(shortTitle.value);
    }
    if (image.present) {
      map['image'] = Variable<String>(image.value);
    }
    if (description.present) {
      map['description'] = Variable<String>(description.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (createdBy.present) {
      map['created_by'] = Variable<int>(createdBy.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (updatedBy.present) {
      map['updated_by'] = Variable<int>(updatedBy.value);
    }
    if (deletedAt.present) {
      map['deleted_at'] = Variable<DateTime>(deletedAt.value);
    }
    if (deletedBy.present) {
      map['deleted_by'] = Variable<int>(deletedBy.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('InstructionsCompanion(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('shortTitle: $shortTitle, ')
          ..write('image: $image, ')
          ..write('description: $description, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy')
          ..write(')'))
        .toString();
  }
}

class Users extends Table with TableInfo<Users, User> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  Users(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _usernameMeta =
      const VerificationMeta('username');
  late final GeneratedColumn<String> username = GeneratedColumn<String>(
      'username', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _roleMeta = const VerificationMeta('role');
  late final GeneratedColumn<String> role = GeneratedColumn<String>(
      'role', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdByMeta =
      const VerificationMeta('createdBy');
  late final GeneratedColumn<int> createdBy = GeneratedColumn<int>(
      'created_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedByMeta =
      const VerificationMeta('updatedBy');
  late final GeneratedColumn<int> updatedBy = GeneratedColumn<int>(
      'updated_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _deletedAtMeta =
      const VerificationMeta('deletedAt');
  late final GeneratedColumn<DateTime> deletedAt = GeneratedColumn<DateTime>(
      'deleted_at', aliasedName, true,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _deletedByMeta =
      const VerificationMeta('deletedBy');
  late final GeneratedColumn<int> deletedBy = GeneratedColumn<int>(
      'deleted_by', aliasedName, true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      $customConstraints: '');
  @override
  List<GeneratedColumn> get $columns => [
        id,
        username,
        role,
        createdAt,
        createdBy,
        updatedAt,
        updatedBy,
        deletedAt,
        deletedBy
      ];
  @override
  String get aliasedName => _alias ?? 'users';
  @override
  String get actualTableName => 'users';
  @override
  VerificationContext validateIntegrity(Insertable<User> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('username')) {
      context.handle(_usernameMeta,
          username.isAcceptableOrUnknown(data['username']!, _usernameMeta));
    } else if (isInserting) {
      context.missing(_usernameMeta);
    }
    if (data.containsKey('role')) {
      context.handle(
          _roleMeta, role.isAcceptableOrUnknown(data['role']!, _roleMeta));
    } else if (isInserting) {
      context.missing(_roleMeta);
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('created_by')) {
      context.handle(_createdByMeta,
          createdBy.isAcceptableOrUnknown(data['created_by']!, _createdByMeta));
    } else if (isInserting) {
      context.missing(_createdByMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('updated_by')) {
      context.handle(_updatedByMeta,
          updatedBy.isAcceptableOrUnknown(data['updated_by']!, _updatedByMeta));
    } else if (isInserting) {
      context.missing(_updatedByMeta);
    }
    if (data.containsKey('deleted_at')) {
      context.handle(_deletedAtMeta,
          deletedAt.isAcceptableOrUnknown(data['deleted_at']!, _deletedAtMeta));
    }
    if (data.containsKey('deleted_by')) {
      context.handle(_deletedByMeta,
          deletedBy.isAcceptableOrUnknown(data['deleted_by']!, _deletedByMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  User map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return User(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      username: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}username'])!,
      role: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}role'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      createdBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}created_by'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}updated_at'])!,
      updatedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}updated_by'])!,
      deletedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}deleted_at']),
      deletedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}deleted_by']),
    );
  }

  @override
  Users createAlias(String alias) {
    return Users(attachedDatabase, alias);
  }

  @override
  List<String> get customConstraints =>
      const ['CONSTRAINT user_pkey PRIMARY KEY(id)'];
  @override
  bool get dontWriteConstraints => true;
}

class User extends DataClass implements Insertable<User> {
  final int id;
  final String username;
  final String role;
  final DateTime createdAt;
  final int createdBy;
  final DateTime updatedAt;
  final int updatedBy;
  final DateTime? deletedAt;
  final int? deletedBy;
  const User(
      {required this.id,
      required this.username,
      required this.role,
      required this.createdAt,
      required this.createdBy,
      required this.updatedAt,
      required this.updatedBy,
      this.deletedAt,
      this.deletedBy});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['username'] = Variable<String>(username);
    map['role'] = Variable<String>(role);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['created_by'] = Variable<int>(createdBy);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    map['updated_by'] = Variable<int>(updatedBy);
    if (!nullToAbsent || deletedAt != null) {
      map['deleted_at'] = Variable<DateTime>(deletedAt);
    }
    if (!nullToAbsent || deletedBy != null) {
      map['deleted_by'] = Variable<int>(deletedBy);
    }
    return map;
  }

  UsersCompanion toCompanion(bool nullToAbsent) {
    return UsersCompanion(
      id: Value(id),
      username: Value(username),
      role: Value(role),
      createdAt: Value(createdAt),
      createdBy: Value(createdBy),
      updatedAt: Value(updatedAt),
      updatedBy: Value(updatedBy),
      deletedAt: deletedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedAt),
      deletedBy: deletedBy == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedBy),
    );
  }

  factory User.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return User(
      id: serializer.fromJson<int>(json['id']),
      username: serializer.fromJson<String>(json['username']),
      role: serializer.fromJson<String>(json['role']),
      createdAt: serializer.fromJson<DateTime>(json['created_at']),
      createdBy: serializer.fromJson<int>(json['created_by']),
      updatedAt: serializer.fromJson<DateTime>(json['updated_at']),
      updatedBy: serializer.fromJson<int>(json['updated_by']),
      deletedAt: serializer.fromJson<DateTime?>(json['deleted_at']),
      deletedBy: serializer.fromJson<int?>(json['deleted_by']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'username': serializer.toJson<String>(username),
      'role': serializer.toJson<String>(role),
      'created_at': serializer.toJson<DateTime>(createdAt),
      'created_by': serializer.toJson<int>(createdBy),
      'updated_at': serializer.toJson<DateTime>(updatedAt),
      'updated_by': serializer.toJson<int>(updatedBy),
      'deleted_at': serializer.toJson<DateTime?>(deletedAt),
      'deleted_by': serializer.toJson<int?>(deletedBy),
    };
  }

  User copyWith(
          {int? id,
          String? username,
          String? role,
          DateTime? createdAt,
          int? createdBy,
          DateTime? updatedAt,
          int? updatedBy,
          Value<DateTime?> deletedAt = const Value.absent(),
          Value<int?> deletedBy = const Value.absent()}) =>
      User(
        id: id ?? this.id,
        username: username ?? this.username,
        role: role ?? this.role,
        createdAt: createdAt ?? this.createdAt,
        createdBy: createdBy ?? this.createdBy,
        updatedAt: updatedAt ?? this.updatedAt,
        updatedBy: updatedBy ?? this.updatedBy,
        deletedAt: deletedAt.present ? deletedAt.value : this.deletedAt,
        deletedBy: deletedBy.present ? deletedBy.value : this.deletedBy,
      );
  @override
  String toString() {
    return (StringBuffer('User(')
          ..write('id: $id, ')
          ..write('username: $username, ')
          ..write('role: $role, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, username, role, createdAt, createdBy,
      updatedAt, updatedBy, deletedAt, deletedBy);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is User &&
          other.id == this.id &&
          other.username == this.username &&
          other.role == this.role &&
          other.createdAt == this.createdAt &&
          other.createdBy == this.createdBy &&
          other.updatedAt == this.updatedAt &&
          other.updatedBy == this.updatedBy &&
          other.deletedAt == this.deletedAt &&
          other.deletedBy == this.deletedBy);
}

class UsersCompanion extends UpdateCompanion<User> {
  final Value<int> id;
  final Value<String> username;
  final Value<String> role;
  final Value<DateTime> createdAt;
  final Value<int> createdBy;
  final Value<DateTime> updatedAt;
  final Value<int> updatedBy;
  final Value<DateTime?> deletedAt;
  final Value<int?> deletedBy;
  const UsersCompanion({
    this.id = const Value.absent(),
    this.username = const Value.absent(),
    this.role = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.createdBy = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.updatedBy = const Value.absent(),
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
  });
  UsersCompanion.insert({
    this.id = const Value.absent(),
    required String username,
    required String role,
    required DateTime createdAt,
    required int createdBy,
    required DateTime updatedAt,
    required int updatedBy,
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
  })  : username = Value(username),
        role = Value(role),
        createdAt = Value(createdAt),
        createdBy = Value(createdBy),
        updatedAt = Value(updatedAt),
        updatedBy = Value(updatedBy);
  static Insertable<User> custom({
    Expression<int>? id,
    Expression<String>? username,
    Expression<String>? role,
    Expression<DateTime>? createdAt,
    Expression<int>? createdBy,
    Expression<DateTime>? updatedAt,
    Expression<int>? updatedBy,
    Expression<DateTime>? deletedAt,
    Expression<int>? deletedBy,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (username != null) 'username': username,
      if (role != null) 'role': role,
      if (createdAt != null) 'created_at': createdAt,
      if (createdBy != null) 'created_by': createdBy,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (updatedBy != null) 'updated_by': updatedBy,
      if (deletedAt != null) 'deleted_at': deletedAt,
      if (deletedBy != null) 'deleted_by': deletedBy,
    });
  }

  UsersCompanion copyWith(
      {Value<int>? id,
      Value<String>? username,
      Value<String>? role,
      Value<DateTime>? createdAt,
      Value<int>? createdBy,
      Value<DateTime>? updatedAt,
      Value<int>? updatedBy,
      Value<DateTime?>? deletedAt,
      Value<int?>? deletedBy}) {
    return UsersCompanion(
      id: id ?? this.id,
      username: username ?? this.username,
      role: role ?? this.role,
      createdAt: createdAt ?? this.createdAt,
      createdBy: createdBy ?? this.createdBy,
      updatedAt: updatedAt ?? this.updatedAt,
      updatedBy: updatedBy ?? this.updatedBy,
      deletedAt: deletedAt ?? this.deletedAt,
      deletedBy: deletedBy ?? this.deletedBy,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (username.present) {
      map['username'] = Variable<String>(username.value);
    }
    if (role.present) {
      map['role'] = Variable<String>(role.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (createdBy.present) {
      map['created_by'] = Variable<int>(createdBy.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (updatedBy.present) {
      map['updated_by'] = Variable<int>(updatedBy.value);
    }
    if (deletedAt.present) {
      map['deleted_at'] = Variable<DateTime>(deletedAt.value);
    }
    if (deletedBy.present) {
      map['deleted_by'] = Variable<int>(deletedBy.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('UsersCompanion(')
          ..write('id: $id, ')
          ..write('username: $username, ')
          ..write('role: $role, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy')
          ..write(')'))
        .toString();
  }
}

class FeedbackTable extends Table with TableInfo<FeedbackTable, Feedback> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  FeedbackTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _instructionIdMeta =
      const VerificationMeta('instructionId');
  late final GeneratedColumn<int> instructionId = GeneratedColumn<int>(
      'instruction_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _userIdMeta = const VerificationMeta('userId');
  late final GeneratedColumn<int> userId = GeneratedColumn<int>(
      'user_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _messageMeta =
      const VerificationMeta('message');
  late final GeneratedColumn<String> message = GeneratedColumn<String>(
      'message', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _imageMeta = const VerificationMeta('image');
  late final GeneratedColumn<String> image = GeneratedColumn<String>(
      'image', aliasedName, true,
      type: DriftSqlType.string,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdByMeta =
      const VerificationMeta('createdBy');
  late final GeneratedColumn<int> createdBy = GeneratedColumn<int>(
      'created_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedByMeta =
      const VerificationMeta('updatedBy');
  late final GeneratedColumn<int> updatedBy = GeneratedColumn<int>(
      'updated_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _deletedAtMeta =
      const VerificationMeta('deletedAt');
  late final GeneratedColumn<DateTime> deletedAt = GeneratedColumn<DateTime>(
      'deleted_at', aliasedName, true,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _deletedByMeta =
      const VerificationMeta('deletedBy');
  late final GeneratedColumn<int> deletedBy = GeneratedColumn<int>(
      'deleted_by', aliasedName, true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _likedMeta = const VerificationMeta('liked');
  late final GeneratedColumn<bool> liked = GeneratedColumn<bool>(
      'liked', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      $customConstraints: 'NOT NULL DEFAULT FALSE',
      defaultValue: const CustomExpression('FALSE'));
  @override
  List<GeneratedColumn> get $columns => [
        id,
        instructionId,
        userId,
        message,
        image,
        createdAt,
        createdBy,
        updatedAt,
        updatedBy,
        deletedAt,
        deletedBy,
        liked
      ];
  @override
  String get aliasedName => _alias ?? 'feedback';
  @override
  String get actualTableName => 'feedback';
  @override
  VerificationContext validateIntegrity(Insertable<Feedback> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('instruction_id')) {
      context.handle(
          _instructionIdMeta,
          instructionId.isAcceptableOrUnknown(
              data['instruction_id']!, _instructionIdMeta));
    } else if (isInserting) {
      context.missing(_instructionIdMeta);
    }
    if (data.containsKey('user_id')) {
      context.handle(_userIdMeta,
          userId.isAcceptableOrUnknown(data['user_id']!, _userIdMeta));
    } else if (isInserting) {
      context.missing(_userIdMeta);
    }
    if (data.containsKey('message')) {
      context.handle(_messageMeta,
          message.isAcceptableOrUnknown(data['message']!, _messageMeta));
    } else if (isInserting) {
      context.missing(_messageMeta);
    }
    if (data.containsKey('image')) {
      context.handle(
          _imageMeta, image.isAcceptableOrUnknown(data['image']!, _imageMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('created_by')) {
      context.handle(_createdByMeta,
          createdBy.isAcceptableOrUnknown(data['created_by']!, _createdByMeta));
    } else if (isInserting) {
      context.missing(_createdByMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('updated_by')) {
      context.handle(_updatedByMeta,
          updatedBy.isAcceptableOrUnknown(data['updated_by']!, _updatedByMeta));
    } else if (isInserting) {
      context.missing(_updatedByMeta);
    }
    if (data.containsKey('deleted_at')) {
      context.handle(_deletedAtMeta,
          deletedAt.isAcceptableOrUnknown(data['deleted_at']!, _deletedAtMeta));
    }
    if (data.containsKey('deleted_by')) {
      context.handle(_deletedByMeta,
          deletedBy.isAcceptableOrUnknown(data['deleted_by']!, _deletedByMeta));
    }
    if (data.containsKey('liked')) {
      context.handle(
          _likedMeta, liked.isAcceptableOrUnknown(data['liked']!, _likedMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Feedback map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Feedback(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      instructionId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}instruction_id'])!,
      userId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}user_id'])!,
      message: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}message'])!,
      image: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}image']),
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      createdBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}created_by'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}updated_at'])!,
      updatedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}updated_by'])!,
      deletedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}deleted_at']),
      deletedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}deleted_by']),
      liked: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}liked'])!,
    );
  }

  @override
  FeedbackTable createAlias(String alias) {
    return FeedbackTable(attachedDatabase, alias);
  }

  @override
  List<String> get customConstraints => const [
        'CONSTRAINT feedback_pkey PRIMARY KEY(id)',
        'CONSTRAINT feedback_instruction_id_fkey FOREIGN KEY(instruction_id)REFERENCES instructions(id)',
        'CONSTRAINT feedback_user_id_fkey FOREIGN KEY(user_id)REFERENCES users(id)'
      ];
  @override
  bool get dontWriteConstraints => true;
}

class Feedback extends DataClass implements Insertable<Feedback> {
  final String id;
  final int instructionId;
  final int userId;
  final String message;
  final String? image;
  final DateTime createdAt;
  final int createdBy;
  final DateTime updatedAt;
  final int updatedBy;
  final DateTime? deletedAt;
  final int? deletedBy;
  final bool liked;
  const Feedback(
      {required this.id,
      required this.instructionId,
      required this.userId,
      required this.message,
      this.image,
      required this.createdAt,
      required this.createdBy,
      required this.updatedAt,
      required this.updatedBy,
      this.deletedAt,
      this.deletedBy,
      required this.liked});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['instruction_id'] = Variable<int>(instructionId);
    map['user_id'] = Variable<int>(userId);
    map['message'] = Variable<String>(message);
    if (!nullToAbsent || image != null) {
      map['image'] = Variable<String>(image);
    }
    map['created_at'] = Variable<DateTime>(createdAt);
    map['created_by'] = Variable<int>(createdBy);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    map['updated_by'] = Variable<int>(updatedBy);
    if (!nullToAbsent || deletedAt != null) {
      map['deleted_at'] = Variable<DateTime>(deletedAt);
    }
    if (!nullToAbsent || deletedBy != null) {
      map['deleted_by'] = Variable<int>(deletedBy);
    }
    map['liked'] = Variable<bool>(liked);
    return map;
  }

  FeedbackCompanion toCompanion(bool nullToAbsent) {
    return FeedbackCompanion(
      id: Value(id),
      instructionId: Value(instructionId),
      userId: Value(userId),
      message: Value(message),
      image:
          image == null && nullToAbsent ? const Value.absent() : Value(image),
      createdAt: Value(createdAt),
      createdBy: Value(createdBy),
      updatedAt: Value(updatedAt),
      updatedBy: Value(updatedBy),
      deletedAt: deletedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedAt),
      deletedBy: deletedBy == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedBy),
      liked: Value(liked),
    );
  }

  factory Feedback.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Feedback(
      id: serializer.fromJson<String>(json['id']),
      instructionId: serializer.fromJson<int>(json['instruction_id']),
      userId: serializer.fromJson<int>(json['user_id']),
      message: serializer.fromJson<String>(json['message']),
      image: serializer.fromJson<String?>(json['image']),
      createdAt: serializer.fromJson<DateTime>(json['created_at']),
      createdBy: serializer.fromJson<int>(json['created_by']),
      updatedAt: serializer.fromJson<DateTime>(json['updated_at']),
      updatedBy: serializer.fromJson<int>(json['updated_by']),
      deletedAt: serializer.fromJson<DateTime?>(json['deleted_at']),
      deletedBy: serializer.fromJson<int?>(json['deleted_by']),
      liked: serializer.fromJson<bool>(json['liked']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'instruction_id': serializer.toJson<int>(instructionId),
      'user_id': serializer.toJson<int>(userId),
      'message': serializer.toJson<String>(message),
      'image': serializer.toJson<String?>(image),
      'created_at': serializer.toJson<DateTime>(createdAt),
      'created_by': serializer.toJson<int>(createdBy),
      'updated_at': serializer.toJson<DateTime>(updatedAt),
      'updated_by': serializer.toJson<int>(updatedBy),
      'deleted_at': serializer.toJson<DateTime?>(deletedAt),
      'deleted_by': serializer.toJson<int?>(deletedBy),
      'liked': serializer.toJson<bool>(liked),
    };
  }

  Feedback copyWith(
          {String? id,
          int? instructionId,
          int? userId,
          String? message,
          Value<String?> image = const Value.absent(),
          DateTime? createdAt,
          int? createdBy,
          DateTime? updatedAt,
          int? updatedBy,
          Value<DateTime?> deletedAt = const Value.absent(),
          Value<int?> deletedBy = const Value.absent(),
          bool? liked}) =>
      Feedback(
        id: id ?? this.id,
        instructionId: instructionId ?? this.instructionId,
        userId: userId ?? this.userId,
        message: message ?? this.message,
        image: image.present ? image.value : this.image,
        createdAt: createdAt ?? this.createdAt,
        createdBy: createdBy ?? this.createdBy,
        updatedAt: updatedAt ?? this.updatedAt,
        updatedBy: updatedBy ?? this.updatedBy,
        deletedAt: deletedAt.present ? deletedAt.value : this.deletedAt,
        deletedBy: deletedBy.present ? deletedBy.value : this.deletedBy,
        liked: liked ?? this.liked,
      );
  @override
  String toString() {
    return (StringBuffer('Feedback(')
          ..write('id: $id, ')
          ..write('instructionId: $instructionId, ')
          ..write('userId: $userId, ')
          ..write('message: $message, ')
          ..write('image: $image, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy, ')
          ..write('liked: $liked')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, instructionId, userId, message, image,
      createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy, liked);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Feedback &&
          other.id == this.id &&
          other.instructionId == this.instructionId &&
          other.userId == this.userId &&
          other.message == this.message &&
          other.image == this.image &&
          other.createdAt == this.createdAt &&
          other.createdBy == this.createdBy &&
          other.updatedAt == this.updatedAt &&
          other.updatedBy == this.updatedBy &&
          other.deletedAt == this.deletedAt &&
          other.deletedBy == this.deletedBy &&
          other.liked == this.liked);
}

class FeedbackCompanion extends UpdateCompanion<Feedback> {
  final Value<String> id;
  final Value<int> instructionId;
  final Value<int> userId;
  final Value<String> message;
  final Value<String?> image;
  final Value<DateTime> createdAt;
  final Value<int> createdBy;
  final Value<DateTime> updatedAt;
  final Value<int> updatedBy;
  final Value<DateTime?> deletedAt;
  final Value<int?> deletedBy;
  final Value<bool> liked;
  final Value<int> rowid;
  const FeedbackCompanion({
    this.id = const Value.absent(),
    this.instructionId = const Value.absent(),
    this.userId = const Value.absent(),
    this.message = const Value.absent(),
    this.image = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.createdBy = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.updatedBy = const Value.absent(),
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
    this.liked = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  FeedbackCompanion.insert({
    required String id,
    required int instructionId,
    required int userId,
    required String message,
    this.image = const Value.absent(),
    required DateTime createdAt,
    required int createdBy,
    required DateTime updatedAt,
    required int updatedBy,
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
    this.liked = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        instructionId = Value(instructionId),
        userId = Value(userId),
        message = Value(message),
        createdAt = Value(createdAt),
        createdBy = Value(createdBy),
        updatedAt = Value(updatedAt),
        updatedBy = Value(updatedBy);
  static Insertable<Feedback> custom({
    Expression<String>? id,
    Expression<int>? instructionId,
    Expression<int>? userId,
    Expression<String>? message,
    Expression<String>? image,
    Expression<DateTime>? createdAt,
    Expression<int>? createdBy,
    Expression<DateTime>? updatedAt,
    Expression<int>? updatedBy,
    Expression<DateTime>? deletedAt,
    Expression<int>? deletedBy,
    Expression<bool>? liked,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (instructionId != null) 'instruction_id': instructionId,
      if (userId != null) 'user_id': userId,
      if (message != null) 'message': message,
      if (image != null) 'image': image,
      if (createdAt != null) 'created_at': createdAt,
      if (createdBy != null) 'created_by': createdBy,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (updatedBy != null) 'updated_by': updatedBy,
      if (deletedAt != null) 'deleted_at': deletedAt,
      if (deletedBy != null) 'deleted_by': deletedBy,
      if (liked != null) 'liked': liked,
      if (rowid != null) 'rowid': rowid,
    });
  }

  FeedbackCompanion copyWith(
      {Value<String>? id,
      Value<int>? instructionId,
      Value<int>? userId,
      Value<String>? message,
      Value<String?>? image,
      Value<DateTime>? createdAt,
      Value<int>? createdBy,
      Value<DateTime>? updatedAt,
      Value<int>? updatedBy,
      Value<DateTime?>? deletedAt,
      Value<int?>? deletedBy,
      Value<bool>? liked,
      Value<int>? rowid}) {
    return FeedbackCompanion(
      id: id ?? this.id,
      instructionId: instructionId ?? this.instructionId,
      userId: userId ?? this.userId,
      message: message ?? this.message,
      image: image ?? this.image,
      createdAt: createdAt ?? this.createdAt,
      createdBy: createdBy ?? this.createdBy,
      updatedAt: updatedAt ?? this.updatedAt,
      updatedBy: updatedBy ?? this.updatedBy,
      deletedAt: deletedAt ?? this.deletedAt,
      deletedBy: deletedBy ?? this.deletedBy,
      liked: liked ?? this.liked,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (instructionId.present) {
      map['instruction_id'] = Variable<int>(instructionId.value);
    }
    if (userId.present) {
      map['user_id'] = Variable<int>(userId.value);
    }
    if (message.present) {
      map['message'] = Variable<String>(message.value);
    }
    if (image.present) {
      map['image'] = Variable<String>(image.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (createdBy.present) {
      map['created_by'] = Variable<int>(createdBy.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (updatedBy.present) {
      map['updated_by'] = Variable<int>(updatedBy.value);
    }
    if (deletedAt.present) {
      map['deleted_at'] = Variable<DateTime>(deletedAt.value);
    }
    if (deletedBy.present) {
      map['deleted_by'] = Variable<int>(deletedBy.value);
    }
    if (liked.present) {
      map['liked'] = Variable<bool>(liked.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('FeedbackCompanion(')
          ..write('id: $id, ')
          ..write('instructionId: $instructionId, ')
          ..write('userId: $userId, ')
          ..write('message: $message, ')
          ..write('image: $image, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy, ')
          ..write('liked: $liked, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class InstructionSteps extends Table
    with TableInfo<InstructionSteps, InstructionStep> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  InstructionSteps(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _instructionIdMeta =
      const VerificationMeta('instructionId');
  late final GeneratedColumn<int> instructionId = GeneratedColumn<int>(
      'instruction_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _stepNrMeta = const VerificationMeta('stepNr');
  late final GeneratedColumn<int> stepNr = GeneratedColumn<int>(
      'step_nr', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _descriptionMeta =
      const VerificationMeta('description');
  late final GeneratedColumn<String> description = GeneratedColumn<String>(
      'description', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _imageMeta = const VerificationMeta('image');
  late final GeneratedColumn<String> image = GeneratedColumn<String>(
      'image', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdByMeta =
      const VerificationMeta('createdBy');
  late final GeneratedColumn<int> createdBy = GeneratedColumn<int>(
      'created_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedByMeta =
      const VerificationMeta('updatedBy');
  late final GeneratedColumn<int> updatedBy = GeneratedColumn<int>(
      'updated_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _deletedAtMeta =
      const VerificationMeta('deletedAt');
  late final GeneratedColumn<DateTime> deletedAt = GeneratedColumn<DateTime>(
      'deleted_at', aliasedName, true,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _deletedByMeta =
      const VerificationMeta('deletedBy');
  late final GeneratedColumn<int> deletedBy = GeneratedColumn<int>(
      'deleted_by', aliasedName, true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      $customConstraints: '');
  @override
  List<GeneratedColumn> get $columns => [
        id,
        instructionId,
        stepNr,
        description,
        image,
        createdAt,
        createdBy,
        updatedAt,
        updatedBy,
        deletedAt,
        deletedBy
      ];
  @override
  String get aliasedName => _alias ?? 'instruction_steps';
  @override
  String get actualTableName => 'instruction_steps';
  @override
  VerificationContext validateIntegrity(Insertable<InstructionStep> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('instruction_id')) {
      context.handle(
          _instructionIdMeta,
          instructionId.isAcceptableOrUnknown(
              data['instruction_id']!, _instructionIdMeta));
    } else if (isInserting) {
      context.missing(_instructionIdMeta);
    }
    if (data.containsKey('step_nr')) {
      context.handle(_stepNrMeta,
          stepNr.isAcceptableOrUnknown(data['step_nr']!, _stepNrMeta));
    } else if (isInserting) {
      context.missing(_stepNrMeta);
    }
    if (data.containsKey('description')) {
      context.handle(
          _descriptionMeta,
          description.isAcceptableOrUnknown(
              data['description']!, _descriptionMeta));
    } else if (isInserting) {
      context.missing(_descriptionMeta);
    }
    if (data.containsKey('image')) {
      context.handle(
          _imageMeta, image.isAcceptableOrUnknown(data['image']!, _imageMeta));
    } else if (isInserting) {
      context.missing(_imageMeta);
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('created_by')) {
      context.handle(_createdByMeta,
          createdBy.isAcceptableOrUnknown(data['created_by']!, _createdByMeta));
    } else if (isInserting) {
      context.missing(_createdByMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('updated_by')) {
      context.handle(_updatedByMeta,
          updatedBy.isAcceptableOrUnknown(data['updated_by']!, _updatedByMeta));
    } else if (isInserting) {
      context.missing(_updatedByMeta);
    }
    if (data.containsKey('deleted_at')) {
      context.handle(_deletedAtMeta,
          deletedAt.isAcceptableOrUnknown(data['deleted_at']!, _deletedAtMeta));
    }
    if (data.containsKey('deleted_by')) {
      context.handle(_deletedByMeta,
          deletedBy.isAcceptableOrUnknown(data['deleted_by']!, _deletedByMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  InstructionStep map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return InstructionStep(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      instructionId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}instruction_id'])!,
      stepNr: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}step_nr'])!,
      description: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}description'])!,
      image: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}image'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      createdBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}created_by'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}updated_at'])!,
      updatedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}updated_by'])!,
      deletedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}deleted_at']),
      deletedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}deleted_by']),
    );
  }

  @override
  InstructionSteps createAlias(String alias) {
    return InstructionSteps(attachedDatabase, alias);
  }

  @override
  List<String> get customConstraints => const [
        'CONSTRAINT instruction_steps_pkey PRIMARY KEY(id)',
        'CONSTRAINT instruction_step_instruction_id_fkey FOREIGN KEY(instruction_id)REFERENCES instructions(id)ON DELETE CASCADE'
      ];
  @override
  bool get dontWriteConstraints => true;
}

class InstructionStep extends DataClass implements Insertable<InstructionStep> {
  final int id;
  final int instructionId;
  final int stepNr;
  final String description;
  final String image;
  final DateTime createdAt;
  final int createdBy;
  final DateTime updatedAt;
  final int updatedBy;
  final DateTime? deletedAt;
  final int? deletedBy;
  const InstructionStep(
      {required this.id,
      required this.instructionId,
      required this.stepNr,
      required this.description,
      required this.image,
      required this.createdAt,
      required this.createdBy,
      required this.updatedAt,
      required this.updatedBy,
      this.deletedAt,
      this.deletedBy});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['instruction_id'] = Variable<int>(instructionId);
    map['step_nr'] = Variable<int>(stepNr);
    map['description'] = Variable<String>(description);
    map['image'] = Variable<String>(image);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['created_by'] = Variable<int>(createdBy);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    map['updated_by'] = Variable<int>(updatedBy);
    if (!nullToAbsent || deletedAt != null) {
      map['deleted_at'] = Variable<DateTime>(deletedAt);
    }
    if (!nullToAbsent || deletedBy != null) {
      map['deleted_by'] = Variable<int>(deletedBy);
    }
    return map;
  }

  InstructionStepsCompanion toCompanion(bool nullToAbsent) {
    return InstructionStepsCompanion(
      id: Value(id),
      instructionId: Value(instructionId),
      stepNr: Value(stepNr),
      description: Value(description),
      image: Value(image),
      createdAt: Value(createdAt),
      createdBy: Value(createdBy),
      updatedAt: Value(updatedAt),
      updatedBy: Value(updatedBy),
      deletedAt: deletedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedAt),
      deletedBy: deletedBy == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedBy),
    );
  }

  factory InstructionStep.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return InstructionStep(
      id: serializer.fromJson<int>(json['id']),
      instructionId: serializer.fromJson<int>(json['instruction_id']),
      stepNr: serializer.fromJson<int>(json['step_nr']),
      description: serializer.fromJson<String>(json['description']),
      image: serializer.fromJson<String>(json['image']),
      createdAt: serializer.fromJson<DateTime>(json['created_at']),
      createdBy: serializer.fromJson<int>(json['created_by']),
      updatedAt: serializer.fromJson<DateTime>(json['updated_at']),
      updatedBy: serializer.fromJson<int>(json['updated_by']),
      deletedAt: serializer.fromJson<DateTime?>(json['deleted_at']),
      deletedBy: serializer.fromJson<int?>(json['deleted_by']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'instruction_id': serializer.toJson<int>(instructionId),
      'step_nr': serializer.toJson<int>(stepNr),
      'description': serializer.toJson<String>(description),
      'image': serializer.toJson<String>(image),
      'created_at': serializer.toJson<DateTime>(createdAt),
      'created_by': serializer.toJson<int>(createdBy),
      'updated_at': serializer.toJson<DateTime>(updatedAt),
      'updated_by': serializer.toJson<int>(updatedBy),
      'deleted_at': serializer.toJson<DateTime?>(deletedAt),
      'deleted_by': serializer.toJson<int?>(deletedBy),
    };
  }

  InstructionStep copyWith(
          {int? id,
          int? instructionId,
          int? stepNr,
          String? description,
          String? image,
          DateTime? createdAt,
          int? createdBy,
          DateTime? updatedAt,
          int? updatedBy,
          Value<DateTime?> deletedAt = const Value.absent(),
          Value<int?> deletedBy = const Value.absent()}) =>
      InstructionStep(
        id: id ?? this.id,
        instructionId: instructionId ?? this.instructionId,
        stepNr: stepNr ?? this.stepNr,
        description: description ?? this.description,
        image: image ?? this.image,
        createdAt: createdAt ?? this.createdAt,
        createdBy: createdBy ?? this.createdBy,
        updatedAt: updatedAt ?? this.updatedAt,
        updatedBy: updatedBy ?? this.updatedBy,
        deletedAt: deletedAt.present ? deletedAt.value : this.deletedAt,
        deletedBy: deletedBy.present ? deletedBy.value : this.deletedBy,
      );
  @override
  String toString() {
    return (StringBuffer('InstructionStep(')
          ..write('id: $id, ')
          ..write('instructionId: $instructionId, ')
          ..write('stepNr: $stepNr, ')
          ..write('description: $description, ')
          ..write('image: $image, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, instructionId, stepNr, description, image,
      createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is InstructionStep &&
          other.id == this.id &&
          other.instructionId == this.instructionId &&
          other.stepNr == this.stepNr &&
          other.description == this.description &&
          other.image == this.image &&
          other.createdAt == this.createdAt &&
          other.createdBy == this.createdBy &&
          other.updatedAt == this.updatedAt &&
          other.updatedBy == this.updatedBy &&
          other.deletedAt == this.deletedAt &&
          other.deletedBy == this.deletedBy);
}

class InstructionStepsCompanion extends UpdateCompanion<InstructionStep> {
  final Value<int> id;
  final Value<int> instructionId;
  final Value<int> stepNr;
  final Value<String> description;
  final Value<String> image;
  final Value<DateTime> createdAt;
  final Value<int> createdBy;
  final Value<DateTime> updatedAt;
  final Value<int> updatedBy;
  final Value<DateTime?> deletedAt;
  final Value<int?> deletedBy;
  const InstructionStepsCompanion({
    this.id = const Value.absent(),
    this.instructionId = const Value.absent(),
    this.stepNr = const Value.absent(),
    this.description = const Value.absent(),
    this.image = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.createdBy = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.updatedBy = const Value.absent(),
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
  });
  InstructionStepsCompanion.insert({
    this.id = const Value.absent(),
    required int instructionId,
    required int stepNr,
    required String description,
    required String image,
    required DateTime createdAt,
    required int createdBy,
    required DateTime updatedAt,
    required int updatedBy,
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
  })  : instructionId = Value(instructionId),
        stepNr = Value(stepNr),
        description = Value(description),
        image = Value(image),
        createdAt = Value(createdAt),
        createdBy = Value(createdBy),
        updatedAt = Value(updatedAt),
        updatedBy = Value(updatedBy);
  static Insertable<InstructionStep> custom({
    Expression<int>? id,
    Expression<int>? instructionId,
    Expression<int>? stepNr,
    Expression<String>? description,
    Expression<String>? image,
    Expression<DateTime>? createdAt,
    Expression<int>? createdBy,
    Expression<DateTime>? updatedAt,
    Expression<int>? updatedBy,
    Expression<DateTime>? deletedAt,
    Expression<int>? deletedBy,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (instructionId != null) 'instruction_id': instructionId,
      if (stepNr != null) 'step_nr': stepNr,
      if (description != null) 'description': description,
      if (image != null) 'image': image,
      if (createdAt != null) 'created_at': createdAt,
      if (createdBy != null) 'created_by': createdBy,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (updatedBy != null) 'updated_by': updatedBy,
      if (deletedAt != null) 'deleted_at': deletedAt,
      if (deletedBy != null) 'deleted_by': deletedBy,
    });
  }

  InstructionStepsCompanion copyWith(
      {Value<int>? id,
      Value<int>? instructionId,
      Value<int>? stepNr,
      Value<String>? description,
      Value<String>? image,
      Value<DateTime>? createdAt,
      Value<int>? createdBy,
      Value<DateTime>? updatedAt,
      Value<int>? updatedBy,
      Value<DateTime?>? deletedAt,
      Value<int?>? deletedBy}) {
    return InstructionStepsCompanion(
      id: id ?? this.id,
      instructionId: instructionId ?? this.instructionId,
      stepNr: stepNr ?? this.stepNr,
      description: description ?? this.description,
      image: image ?? this.image,
      createdAt: createdAt ?? this.createdAt,
      createdBy: createdBy ?? this.createdBy,
      updatedAt: updatedAt ?? this.updatedAt,
      updatedBy: updatedBy ?? this.updatedBy,
      deletedAt: deletedAt ?? this.deletedAt,
      deletedBy: deletedBy ?? this.deletedBy,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (instructionId.present) {
      map['instruction_id'] = Variable<int>(instructionId.value);
    }
    if (stepNr.present) {
      map['step_nr'] = Variable<int>(stepNr.value);
    }
    if (description.present) {
      map['description'] = Variable<String>(description.value);
    }
    if (image.present) {
      map['image'] = Variable<String>(image.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (createdBy.present) {
      map['created_by'] = Variable<int>(createdBy.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (updatedBy.present) {
      map['updated_by'] = Variable<int>(updatedBy.value);
    }
    if (deletedAt.present) {
      map['deleted_at'] = Variable<DateTime>(deletedAt.value);
    }
    if (deletedBy.present) {
      map['deleted_by'] = Variable<int>(deletedBy.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('InstructionStepsCompanion(')
          ..write('id: $id, ')
          ..write('instructionId: $instructionId, ')
          ..write('stepNr: $stepNr, ')
          ..write('description: $description, ')
          ..write('image: $image, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy')
          ..write(')'))
        .toString();
  }
}

class Histories extends Table with TableInfo<Histories, History> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  Histories(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _userIdMeta = const VerificationMeta('userId');
  late final GeneratedColumn<int> userId = GeneratedColumn<int>(
      'user_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _instructionIdMeta =
      const VerificationMeta('instructionId');
  late final GeneratedColumn<int> instructionId = GeneratedColumn<int>(
      'instruction_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdByMeta =
      const VerificationMeta('createdBy');
  late final GeneratedColumn<int> createdBy = GeneratedColumn<int>(
      'created_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedByMeta =
      const VerificationMeta('updatedBy');
  late final GeneratedColumn<int> updatedBy = GeneratedColumn<int>(
      'updated_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _deletedAtMeta =
      const VerificationMeta('deletedAt');
  late final GeneratedColumn<DateTime> deletedAt = GeneratedColumn<DateTime>(
      'deleted_at', aliasedName, true,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _deletedByMeta =
      const VerificationMeta('deletedBy');
  late final GeneratedColumn<int> deletedBy = GeneratedColumn<int>(
      'deleted_by', aliasedName, true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _instructionStepIdMeta =
      const VerificationMeta('instructionStepId');
  late final GeneratedColumn<int> instructionStepId = GeneratedColumn<int>(
      'instruction_step_id', aliasedName, true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _openMeta = const VerificationMeta('open');
  late final GeneratedColumn<bool> open = GeneratedColumn<bool>(
      'open', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _additionalDataMeta =
      const VerificationMeta('additionalData');
  late final GeneratedColumn<String> additionalData = GeneratedColumn<String>(
      'additional_data', aliasedName, true,
      type: DriftSqlType.string,
      requiredDuringInsert: false,
      $customConstraints: '');
  @override
  List<GeneratedColumn> get $columns => [
        userId,
        instructionId,
        createdAt,
        createdBy,
        updatedAt,
        updatedBy,
        deletedAt,
        deletedBy,
        instructionStepId,
        open,
        additionalData
      ];
  @override
  String get aliasedName => _alias ?? 'histories';
  @override
  String get actualTableName => 'histories';
  @override
  VerificationContext validateIntegrity(Insertable<History> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('user_id')) {
      context.handle(_userIdMeta,
          userId.isAcceptableOrUnknown(data['user_id']!, _userIdMeta));
    } else if (isInserting) {
      context.missing(_userIdMeta);
    }
    if (data.containsKey('instruction_id')) {
      context.handle(
          _instructionIdMeta,
          instructionId.isAcceptableOrUnknown(
              data['instruction_id']!, _instructionIdMeta));
    } else if (isInserting) {
      context.missing(_instructionIdMeta);
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('created_by')) {
      context.handle(_createdByMeta,
          createdBy.isAcceptableOrUnknown(data['created_by']!, _createdByMeta));
    } else if (isInserting) {
      context.missing(_createdByMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('updated_by')) {
      context.handle(_updatedByMeta,
          updatedBy.isAcceptableOrUnknown(data['updated_by']!, _updatedByMeta));
    } else if (isInserting) {
      context.missing(_updatedByMeta);
    }
    if (data.containsKey('deleted_at')) {
      context.handle(_deletedAtMeta,
          deletedAt.isAcceptableOrUnknown(data['deleted_at']!, _deletedAtMeta));
    }
    if (data.containsKey('deleted_by')) {
      context.handle(_deletedByMeta,
          deletedBy.isAcceptableOrUnknown(data['deleted_by']!, _deletedByMeta));
    }
    if (data.containsKey('instruction_step_id')) {
      context.handle(
          _instructionStepIdMeta,
          instructionStepId.isAcceptableOrUnknown(
              data['instruction_step_id']!, _instructionStepIdMeta));
    }
    if (data.containsKey('open')) {
      context.handle(
          _openMeta, open.isAcceptableOrUnknown(data['open']!, _openMeta));
    } else if (isInserting) {
      context.missing(_openMeta);
    }
    if (data.containsKey('additional_data')) {
      context.handle(
          _additionalDataMeta,
          additionalData.isAcceptableOrUnknown(
              data['additional_data']!, _additionalDataMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {userId, instructionId};
  @override
  History map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return History(
      userId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}user_id'])!,
      instructionId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}instruction_id'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      createdBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}created_by'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}updated_at'])!,
      updatedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}updated_by'])!,
      deletedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}deleted_at']),
      deletedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}deleted_by']),
      instructionStepId: attachedDatabase.typeMapping.read(
          DriftSqlType.int, data['${effectivePrefix}instruction_step_id']),
      open: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}open'])!,
      additionalData: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}additional_data']),
    );
  }

  @override
  Histories createAlias(String alias) {
    return Histories(attachedDatabase, alias);
  }

  @override
  List<String> get customConstraints => const [
        'CONSTRAINT history_pkey PRIMARY KEY(user_id, instruction_id)',
        'CONSTRAINT history_instruction_id_fkey FOREIGN KEY(instruction_id)REFERENCES instructions(id)ON DELETE CASCADE',
        'CONSTRAINT history_instruction_step_id_fkey FOREIGN KEY(instruction_step_id)REFERENCES instruction_steps(id)ON DELETE CASCADE',
        'CONSTRAINT history_user_id_fkey FOREIGN KEY(user_id)REFERENCES users(id)ON DELETE CASCADE'
      ];
  @override
  bool get dontWriteConstraints => true;
}

class History extends DataClass implements Insertable<History> {
  final int userId;
  final int instructionId;
  final DateTime createdAt;
  final int createdBy;
  final DateTime updatedAt;
  final int updatedBy;
  final DateTime? deletedAt;
  final int? deletedBy;
  final int? instructionStepId;
  final bool open;
  final String? additionalData;
  const History(
      {required this.userId,
      required this.instructionId,
      required this.createdAt,
      required this.createdBy,
      required this.updatedAt,
      required this.updatedBy,
      this.deletedAt,
      this.deletedBy,
      this.instructionStepId,
      required this.open,
      this.additionalData});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['user_id'] = Variable<int>(userId);
    map['instruction_id'] = Variable<int>(instructionId);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['created_by'] = Variable<int>(createdBy);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    map['updated_by'] = Variable<int>(updatedBy);
    if (!nullToAbsent || deletedAt != null) {
      map['deleted_at'] = Variable<DateTime>(deletedAt);
    }
    if (!nullToAbsent || deletedBy != null) {
      map['deleted_by'] = Variable<int>(deletedBy);
    }
    if (!nullToAbsent || instructionStepId != null) {
      map['instruction_step_id'] = Variable<int>(instructionStepId);
    }
    map['open'] = Variable<bool>(open);
    if (!nullToAbsent || additionalData != null) {
      map['additional_data'] = Variable<String>(additionalData);
    }
    return map;
  }

  HistoriesCompanion toCompanion(bool nullToAbsent) {
    return HistoriesCompanion(
      userId: Value(userId),
      instructionId: Value(instructionId),
      createdAt: Value(createdAt),
      createdBy: Value(createdBy),
      updatedAt: Value(updatedAt),
      updatedBy: Value(updatedBy),
      deletedAt: deletedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedAt),
      deletedBy: deletedBy == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedBy),
      instructionStepId: instructionStepId == null && nullToAbsent
          ? const Value.absent()
          : Value(instructionStepId),
      open: Value(open),
      additionalData: additionalData == null && nullToAbsent
          ? const Value.absent()
          : Value(additionalData),
    );
  }

  factory History.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return History(
      userId: serializer.fromJson<int>(json['user_id']),
      instructionId: serializer.fromJson<int>(json['instruction_id']),
      createdAt: serializer.fromJson<DateTime>(json['created_at']),
      createdBy: serializer.fromJson<int>(json['created_by']),
      updatedAt: serializer.fromJson<DateTime>(json['updated_at']),
      updatedBy: serializer.fromJson<int>(json['updated_by']),
      deletedAt: serializer.fromJson<DateTime?>(json['deleted_at']),
      deletedBy: serializer.fromJson<int?>(json['deleted_by']),
      instructionStepId: serializer.fromJson<int?>(json['instruction_step_id']),
      open: serializer.fromJson<bool>(json['open']),
      additionalData: serializer.fromJson<String?>(json['additional_data']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'user_id': serializer.toJson<int>(userId),
      'instruction_id': serializer.toJson<int>(instructionId),
      'created_at': serializer.toJson<DateTime>(createdAt),
      'created_by': serializer.toJson<int>(createdBy),
      'updated_at': serializer.toJson<DateTime>(updatedAt),
      'updated_by': serializer.toJson<int>(updatedBy),
      'deleted_at': serializer.toJson<DateTime?>(deletedAt),
      'deleted_by': serializer.toJson<int?>(deletedBy),
      'instruction_step_id': serializer.toJson<int?>(instructionStepId),
      'open': serializer.toJson<bool>(open),
      'additional_data': serializer.toJson<String?>(additionalData),
    };
  }

  History copyWith(
          {int? userId,
          int? instructionId,
          DateTime? createdAt,
          int? createdBy,
          DateTime? updatedAt,
          int? updatedBy,
          Value<DateTime?> deletedAt = const Value.absent(),
          Value<int?> deletedBy = const Value.absent(),
          Value<int?> instructionStepId = const Value.absent(),
          bool? open,
          Value<String?> additionalData = const Value.absent()}) =>
      History(
        userId: userId ?? this.userId,
        instructionId: instructionId ?? this.instructionId,
        createdAt: createdAt ?? this.createdAt,
        createdBy: createdBy ?? this.createdBy,
        updatedAt: updatedAt ?? this.updatedAt,
        updatedBy: updatedBy ?? this.updatedBy,
        deletedAt: deletedAt.present ? deletedAt.value : this.deletedAt,
        deletedBy: deletedBy.present ? deletedBy.value : this.deletedBy,
        instructionStepId: instructionStepId.present
            ? instructionStepId.value
            : this.instructionStepId,
        open: open ?? this.open,
        additionalData:
            additionalData.present ? additionalData.value : this.additionalData,
      );
  @override
  String toString() {
    return (StringBuffer('History(')
          ..write('userId: $userId, ')
          ..write('instructionId: $instructionId, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy, ')
          ..write('instructionStepId: $instructionStepId, ')
          ..write('open: $open, ')
          ..write('additionalData: $additionalData')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      userId,
      instructionId,
      createdAt,
      createdBy,
      updatedAt,
      updatedBy,
      deletedAt,
      deletedBy,
      instructionStepId,
      open,
      additionalData);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is History &&
          other.userId == this.userId &&
          other.instructionId == this.instructionId &&
          other.createdAt == this.createdAt &&
          other.createdBy == this.createdBy &&
          other.updatedAt == this.updatedAt &&
          other.updatedBy == this.updatedBy &&
          other.deletedAt == this.deletedAt &&
          other.deletedBy == this.deletedBy &&
          other.instructionStepId == this.instructionStepId &&
          other.open == this.open &&
          other.additionalData == this.additionalData);
}

class HistoriesCompanion extends UpdateCompanion<History> {
  final Value<int> userId;
  final Value<int> instructionId;
  final Value<DateTime> createdAt;
  final Value<int> createdBy;
  final Value<DateTime> updatedAt;
  final Value<int> updatedBy;
  final Value<DateTime?> deletedAt;
  final Value<int?> deletedBy;
  final Value<int?> instructionStepId;
  final Value<bool> open;
  final Value<String?> additionalData;
  final Value<int> rowid;
  const HistoriesCompanion({
    this.userId = const Value.absent(),
    this.instructionId = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.createdBy = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.updatedBy = const Value.absent(),
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
    this.instructionStepId = const Value.absent(),
    this.open = const Value.absent(),
    this.additionalData = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  HistoriesCompanion.insert({
    required int userId,
    required int instructionId,
    required DateTime createdAt,
    required int createdBy,
    required DateTime updatedAt,
    required int updatedBy,
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
    this.instructionStepId = const Value.absent(),
    required bool open,
    this.additionalData = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : userId = Value(userId),
        instructionId = Value(instructionId),
        createdAt = Value(createdAt),
        createdBy = Value(createdBy),
        updatedAt = Value(updatedAt),
        updatedBy = Value(updatedBy),
        open = Value(open);
  static Insertable<History> custom({
    Expression<int>? userId,
    Expression<int>? instructionId,
    Expression<DateTime>? createdAt,
    Expression<int>? createdBy,
    Expression<DateTime>? updatedAt,
    Expression<int>? updatedBy,
    Expression<DateTime>? deletedAt,
    Expression<int>? deletedBy,
    Expression<int>? instructionStepId,
    Expression<bool>? open,
    Expression<String>? additionalData,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (userId != null) 'user_id': userId,
      if (instructionId != null) 'instruction_id': instructionId,
      if (createdAt != null) 'created_at': createdAt,
      if (createdBy != null) 'created_by': createdBy,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (updatedBy != null) 'updated_by': updatedBy,
      if (deletedAt != null) 'deleted_at': deletedAt,
      if (deletedBy != null) 'deleted_by': deletedBy,
      if (instructionStepId != null) 'instruction_step_id': instructionStepId,
      if (open != null) 'open': open,
      if (additionalData != null) 'additional_data': additionalData,
      if (rowid != null) 'rowid': rowid,
    });
  }

  HistoriesCompanion copyWith(
      {Value<int>? userId,
      Value<int>? instructionId,
      Value<DateTime>? createdAt,
      Value<int>? createdBy,
      Value<DateTime>? updatedAt,
      Value<int>? updatedBy,
      Value<DateTime?>? deletedAt,
      Value<int?>? deletedBy,
      Value<int?>? instructionStepId,
      Value<bool>? open,
      Value<String?>? additionalData,
      Value<int>? rowid}) {
    return HistoriesCompanion(
      userId: userId ?? this.userId,
      instructionId: instructionId ?? this.instructionId,
      createdAt: createdAt ?? this.createdAt,
      createdBy: createdBy ?? this.createdBy,
      updatedAt: updatedAt ?? this.updatedAt,
      updatedBy: updatedBy ?? this.updatedBy,
      deletedAt: deletedAt ?? this.deletedAt,
      deletedBy: deletedBy ?? this.deletedBy,
      instructionStepId: instructionStepId ?? this.instructionStepId,
      open: open ?? this.open,
      additionalData: additionalData ?? this.additionalData,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (userId.present) {
      map['user_id'] = Variable<int>(userId.value);
    }
    if (instructionId.present) {
      map['instruction_id'] = Variable<int>(instructionId.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (createdBy.present) {
      map['created_by'] = Variable<int>(createdBy.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (updatedBy.present) {
      map['updated_by'] = Variable<int>(updatedBy.value);
    }
    if (deletedAt.present) {
      map['deleted_at'] = Variable<DateTime>(deletedAt.value);
    }
    if (deletedBy.present) {
      map['deleted_by'] = Variable<int>(deletedBy.value);
    }
    if (instructionStepId.present) {
      map['instruction_step_id'] = Variable<int>(instructionStepId.value);
    }
    if (open.present) {
      map['open'] = Variable<bool>(open.value);
    }
    if (additionalData.present) {
      map['additional_data'] = Variable<String>(additionalData.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('HistoriesCompanion(')
          ..write('userId: $userId, ')
          ..write('instructionId: $instructionId, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy, ')
          ..write('instructionStepId: $instructionStepId, ')
          ..write('open: $open, ')
          ..write('additionalData: $additionalData, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class InstructionsCategories extends Table
    with TableInfo<InstructionsCategories, InstructionCategory> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  InstructionsCategories(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _categoryIdMeta =
      const VerificationMeta('categoryId');
  late final GeneratedColumn<int> categoryId = GeneratedColumn<int>(
      'category_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _instructionIdMeta =
      const VerificationMeta('instructionId');
  late final GeneratedColumn<int> instructionId = GeneratedColumn<int>(
      'instruction_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdByMeta =
      const VerificationMeta('createdBy');
  late final GeneratedColumn<int> createdBy = GeneratedColumn<int>(
      'created_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedByMeta =
      const VerificationMeta('updatedBy');
  late final GeneratedColumn<int> updatedBy = GeneratedColumn<int>(
      'updated_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _deletedAtMeta =
      const VerificationMeta('deletedAt');
  late final GeneratedColumn<DateTime> deletedAt = GeneratedColumn<DateTime>(
      'deleted_at', aliasedName, true,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _deletedByMeta =
      const VerificationMeta('deletedBy');
  late final GeneratedColumn<int> deletedBy = GeneratedColumn<int>(
      'deleted_by', aliasedName, true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      $customConstraints: '');
  @override
  List<GeneratedColumn> get $columns => [
        categoryId,
        instructionId,
        createdAt,
        createdBy,
        updatedAt,
        updatedBy,
        deletedAt,
        deletedBy
      ];
  @override
  String get aliasedName => _alias ?? 'InstructionsCategories';
  @override
  String get actualTableName => 'InstructionsCategories';
  @override
  VerificationContext validateIntegrity(
      Insertable<InstructionCategory> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('category_id')) {
      context.handle(
          _categoryIdMeta,
          categoryId.isAcceptableOrUnknown(
              data['category_id']!, _categoryIdMeta));
    } else if (isInserting) {
      context.missing(_categoryIdMeta);
    }
    if (data.containsKey('instruction_id')) {
      context.handle(
          _instructionIdMeta,
          instructionId.isAcceptableOrUnknown(
              data['instruction_id']!, _instructionIdMeta));
    } else if (isInserting) {
      context.missing(_instructionIdMeta);
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('created_by')) {
      context.handle(_createdByMeta,
          createdBy.isAcceptableOrUnknown(data['created_by']!, _createdByMeta));
    } else if (isInserting) {
      context.missing(_createdByMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('updated_by')) {
      context.handle(_updatedByMeta,
          updatedBy.isAcceptableOrUnknown(data['updated_by']!, _updatedByMeta));
    } else if (isInserting) {
      context.missing(_updatedByMeta);
    }
    if (data.containsKey('deleted_at')) {
      context.handle(_deletedAtMeta,
          deletedAt.isAcceptableOrUnknown(data['deleted_at']!, _deletedAtMeta));
    }
    if (data.containsKey('deleted_by')) {
      context.handle(_deletedByMeta,
          deletedBy.isAcceptableOrUnknown(data['deleted_by']!, _deletedByMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {categoryId, instructionId};
  @override
  InstructionCategory map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return InstructionCategory(
      categoryId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}category_id'])!,
      instructionId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}instruction_id'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      createdBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}created_by'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}updated_at'])!,
      updatedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}updated_by'])!,
      deletedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}deleted_at']),
      deletedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}deleted_by']),
    );
  }

  @override
  InstructionsCategories createAlias(String alias) {
    return InstructionsCategories(attachedDatabase, alias);
  }

  @override
  List<String> get customConstraints => const [
        'CONSTRAINT instruction_category_pkey PRIMARY KEY(category_id, instruction_id)',
        'CONSTRAINT instruction_category_category_id_fkey FOREIGN KEY(category_id)REFERENCES categories(id)ON DELETE CASCADE',
        'CONSTRAINT instruction_category_instruction_id_fkey FOREIGN KEY(instruction_id)REFERENCES instructions(id)ON DELETE CASCADE'
      ];
  @override
  bool get dontWriteConstraints => true;
}

class InstructionCategory extends DataClass
    implements Insertable<InstructionCategory> {
  final int categoryId;
  final int instructionId;
  final DateTime createdAt;
  final int createdBy;
  final DateTime updatedAt;
  final int updatedBy;
  final DateTime? deletedAt;
  final int? deletedBy;
  const InstructionCategory(
      {required this.categoryId,
      required this.instructionId,
      required this.createdAt,
      required this.createdBy,
      required this.updatedAt,
      required this.updatedBy,
      this.deletedAt,
      this.deletedBy});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['category_id'] = Variable<int>(categoryId);
    map['instruction_id'] = Variable<int>(instructionId);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['created_by'] = Variable<int>(createdBy);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    map['updated_by'] = Variable<int>(updatedBy);
    if (!nullToAbsent || deletedAt != null) {
      map['deleted_at'] = Variable<DateTime>(deletedAt);
    }
    if (!nullToAbsent || deletedBy != null) {
      map['deleted_by'] = Variable<int>(deletedBy);
    }
    return map;
  }

  InstructionsCategoriesCompanion toCompanion(bool nullToAbsent) {
    return InstructionsCategoriesCompanion(
      categoryId: Value(categoryId),
      instructionId: Value(instructionId),
      createdAt: Value(createdAt),
      createdBy: Value(createdBy),
      updatedAt: Value(updatedAt),
      updatedBy: Value(updatedBy),
      deletedAt: deletedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedAt),
      deletedBy: deletedBy == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedBy),
    );
  }

  factory InstructionCategory.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return InstructionCategory(
      categoryId: serializer.fromJson<int>(json['category_id']),
      instructionId: serializer.fromJson<int>(json['instruction_id']),
      createdAt: serializer.fromJson<DateTime>(json['created_at']),
      createdBy: serializer.fromJson<int>(json['created_by']),
      updatedAt: serializer.fromJson<DateTime>(json['updated_at']),
      updatedBy: serializer.fromJson<int>(json['updated_by']),
      deletedAt: serializer.fromJson<DateTime?>(json['deleted_at']),
      deletedBy: serializer.fromJson<int?>(json['deleted_by']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'category_id': serializer.toJson<int>(categoryId),
      'instruction_id': serializer.toJson<int>(instructionId),
      'created_at': serializer.toJson<DateTime>(createdAt),
      'created_by': serializer.toJson<int>(createdBy),
      'updated_at': serializer.toJson<DateTime>(updatedAt),
      'updated_by': serializer.toJson<int>(updatedBy),
      'deleted_at': serializer.toJson<DateTime?>(deletedAt),
      'deleted_by': serializer.toJson<int?>(deletedBy),
    };
  }

  InstructionCategory copyWith(
          {int? categoryId,
          int? instructionId,
          DateTime? createdAt,
          int? createdBy,
          DateTime? updatedAt,
          int? updatedBy,
          Value<DateTime?> deletedAt = const Value.absent(),
          Value<int?> deletedBy = const Value.absent()}) =>
      InstructionCategory(
        categoryId: categoryId ?? this.categoryId,
        instructionId: instructionId ?? this.instructionId,
        createdAt: createdAt ?? this.createdAt,
        createdBy: createdBy ?? this.createdBy,
        updatedAt: updatedAt ?? this.updatedAt,
        updatedBy: updatedBy ?? this.updatedBy,
        deletedAt: deletedAt.present ? deletedAt.value : this.deletedAt,
        deletedBy: deletedBy.present ? deletedBy.value : this.deletedBy,
      );
  @override
  String toString() {
    return (StringBuffer('InstructionCategory(')
          ..write('categoryId: $categoryId, ')
          ..write('instructionId: $instructionId, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(categoryId, instructionId, createdAt,
      createdBy, updatedAt, updatedBy, deletedAt, deletedBy);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is InstructionCategory &&
          other.categoryId == this.categoryId &&
          other.instructionId == this.instructionId &&
          other.createdAt == this.createdAt &&
          other.createdBy == this.createdBy &&
          other.updatedAt == this.updatedAt &&
          other.updatedBy == this.updatedBy &&
          other.deletedAt == this.deletedAt &&
          other.deletedBy == this.deletedBy);
}

class InstructionsCategoriesCompanion
    extends UpdateCompanion<InstructionCategory> {
  final Value<int> categoryId;
  final Value<int> instructionId;
  final Value<DateTime> createdAt;
  final Value<int> createdBy;
  final Value<DateTime> updatedAt;
  final Value<int> updatedBy;
  final Value<DateTime?> deletedAt;
  final Value<int?> deletedBy;
  final Value<int> rowid;
  const InstructionsCategoriesCompanion({
    this.categoryId = const Value.absent(),
    this.instructionId = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.createdBy = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.updatedBy = const Value.absent(),
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  InstructionsCategoriesCompanion.insert({
    required int categoryId,
    required int instructionId,
    required DateTime createdAt,
    required int createdBy,
    required DateTime updatedAt,
    required int updatedBy,
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : categoryId = Value(categoryId),
        instructionId = Value(instructionId),
        createdAt = Value(createdAt),
        createdBy = Value(createdBy),
        updatedAt = Value(updatedAt),
        updatedBy = Value(updatedBy);
  static Insertable<InstructionCategory> custom({
    Expression<int>? categoryId,
    Expression<int>? instructionId,
    Expression<DateTime>? createdAt,
    Expression<int>? createdBy,
    Expression<DateTime>? updatedAt,
    Expression<int>? updatedBy,
    Expression<DateTime>? deletedAt,
    Expression<int>? deletedBy,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (categoryId != null) 'category_id': categoryId,
      if (instructionId != null) 'instruction_id': instructionId,
      if (createdAt != null) 'created_at': createdAt,
      if (createdBy != null) 'created_by': createdBy,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (updatedBy != null) 'updated_by': updatedBy,
      if (deletedAt != null) 'deleted_at': deletedAt,
      if (deletedBy != null) 'deleted_by': deletedBy,
      if (rowid != null) 'rowid': rowid,
    });
  }

  InstructionsCategoriesCompanion copyWith(
      {Value<int>? categoryId,
      Value<int>? instructionId,
      Value<DateTime>? createdAt,
      Value<int>? createdBy,
      Value<DateTime>? updatedAt,
      Value<int>? updatedBy,
      Value<DateTime?>? deletedAt,
      Value<int?>? deletedBy,
      Value<int>? rowid}) {
    return InstructionsCategoriesCompanion(
      categoryId: categoryId ?? this.categoryId,
      instructionId: instructionId ?? this.instructionId,
      createdAt: createdAt ?? this.createdAt,
      createdBy: createdBy ?? this.createdBy,
      updatedAt: updatedAt ?? this.updatedAt,
      updatedBy: updatedBy ?? this.updatedBy,
      deletedAt: deletedAt ?? this.deletedAt,
      deletedBy: deletedBy ?? this.deletedBy,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (categoryId.present) {
      map['category_id'] = Variable<int>(categoryId.value);
    }
    if (instructionId.present) {
      map['instruction_id'] = Variable<int>(instructionId.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (createdBy.present) {
      map['created_by'] = Variable<int>(createdBy.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (updatedBy.present) {
      map['updated_by'] = Variable<int>(updatedBy.value);
    }
    if (deletedAt.present) {
      map['deleted_at'] = Variable<DateTime>(deletedAt.value);
    }
    if (deletedBy.present) {
      map['deleted_by'] = Variable<int>(deletedBy.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('InstructionsCategoriesCompanion(')
          ..write('categoryId: $categoryId, ')
          ..write('instructionId: $instructionId, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class Settings extends Table with TableInfo<Settings, Setting> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  Settings(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _userIdMeta = const VerificationMeta('userId');
  late final GeneratedColumn<int> userId = GeneratedColumn<int>(
      'user_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _languageMeta =
      const VerificationMeta('language');
  late final GeneratedColumn<String> language = GeneratedColumn<String>(
      'language', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdByMeta =
      const VerificationMeta('createdBy');
  late final GeneratedColumn<int> createdBy = GeneratedColumn<int>(
      'created_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedByMeta =
      const VerificationMeta('updatedBy');
  late final GeneratedColumn<int> updatedBy = GeneratedColumn<int>(
      'updated_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _deletedAtMeta =
      const VerificationMeta('deletedAt');
  late final GeneratedColumn<DateTime> deletedAt = GeneratedColumn<DateTime>(
      'deleted_at', aliasedName, true,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _deletedByMeta =
      const VerificationMeta('deletedBy');
  late final GeneratedColumn<int> deletedBy = GeneratedColumn<int>(
      'deleted_by', aliasedName, true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _realtimeMeta =
      const VerificationMeta('realtime');
  late final GeneratedColumn<bool> realtime = GeneratedColumn<bool>(
      'realtime', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _lightmodeMeta =
      const VerificationMeta('lightmode');
  late final GeneratedColumn<bool> lightmode = GeneratedColumn<bool>(
      'lightmode', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  @override
  List<GeneratedColumn> get $columns => [
        userId,
        language,
        createdAt,
        createdBy,
        updatedAt,
        updatedBy,
        deletedAt,
        deletedBy,
        realtime,
        lightmode
      ];
  @override
  String get aliasedName => _alias ?? 'settings';
  @override
  String get actualTableName => 'settings';
  @override
  VerificationContext validateIntegrity(Insertable<Setting> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('user_id')) {
      context.handle(_userIdMeta,
          userId.isAcceptableOrUnknown(data['user_id']!, _userIdMeta));
    }
    if (data.containsKey('language')) {
      context.handle(_languageMeta,
          language.isAcceptableOrUnknown(data['language']!, _languageMeta));
    } else if (isInserting) {
      context.missing(_languageMeta);
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('created_by')) {
      context.handle(_createdByMeta,
          createdBy.isAcceptableOrUnknown(data['created_by']!, _createdByMeta));
    } else if (isInserting) {
      context.missing(_createdByMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('updated_by')) {
      context.handle(_updatedByMeta,
          updatedBy.isAcceptableOrUnknown(data['updated_by']!, _updatedByMeta));
    } else if (isInserting) {
      context.missing(_updatedByMeta);
    }
    if (data.containsKey('deleted_at')) {
      context.handle(_deletedAtMeta,
          deletedAt.isAcceptableOrUnknown(data['deleted_at']!, _deletedAtMeta));
    }
    if (data.containsKey('deleted_by')) {
      context.handle(_deletedByMeta,
          deletedBy.isAcceptableOrUnknown(data['deleted_by']!, _deletedByMeta));
    }
    if (data.containsKey('realtime')) {
      context.handle(_realtimeMeta,
          realtime.isAcceptableOrUnknown(data['realtime']!, _realtimeMeta));
    } else if (isInserting) {
      context.missing(_realtimeMeta);
    }
    if (data.containsKey('lightmode')) {
      context.handle(_lightmodeMeta,
          lightmode.isAcceptableOrUnknown(data['lightmode']!, _lightmodeMeta));
    } else if (isInserting) {
      context.missing(_lightmodeMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {userId};
  @override
  Setting map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Setting(
      userId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}user_id'])!,
      language: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}language'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      createdBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}created_by'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}updated_at'])!,
      updatedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}updated_by'])!,
      deletedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}deleted_at']),
      deletedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}deleted_by']),
      realtime: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}realtime'])!,
      lightmode: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}lightmode'])!,
    );
  }

  @override
  Settings createAlias(String alias) {
    return Settings(attachedDatabase, alias);
  }

  @override
  List<String> get customConstraints => const [
        'CONSTRAINT setting_pkey PRIMARY KEY(user_id)',
        'CONSTRAINT setting_user_id_fkey FOREIGN KEY(user_id)REFERENCES users(id)ON DELETE CASCADE'
      ];
  @override
  bool get dontWriteConstraints => true;
}

class Setting extends DataClass implements Insertable<Setting> {
  final int userId;
  final String language;
  final DateTime createdAt;
  final int createdBy;
  final DateTime updatedAt;
  final int updatedBy;
  final DateTime? deletedAt;
  final int? deletedBy;
  final bool realtime;
  final bool lightmode;
  const Setting(
      {required this.userId,
      required this.language,
      required this.createdAt,
      required this.createdBy,
      required this.updatedAt,
      required this.updatedBy,
      this.deletedAt,
      this.deletedBy,
      required this.realtime,
      required this.lightmode});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['user_id'] = Variable<int>(userId);
    map['language'] = Variable<String>(language);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['created_by'] = Variable<int>(createdBy);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    map['updated_by'] = Variable<int>(updatedBy);
    if (!nullToAbsent || deletedAt != null) {
      map['deleted_at'] = Variable<DateTime>(deletedAt);
    }
    if (!nullToAbsent || deletedBy != null) {
      map['deleted_by'] = Variable<int>(deletedBy);
    }
    map['realtime'] = Variable<bool>(realtime);
    map['lightmode'] = Variable<bool>(lightmode);
    return map;
  }

  SettingsCompanion toCompanion(bool nullToAbsent) {
    return SettingsCompanion(
      userId: Value(userId),
      language: Value(language),
      createdAt: Value(createdAt),
      createdBy: Value(createdBy),
      updatedAt: Value(updatedAt),
      updatedBy: Value(updatedBy),
      deletedAt: deletedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedAt),
      deletedBy: deletedBy == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedBy),
      realtime: Value(realtime),
      lightmode: Value(lightmode),
    );
  }

  factory Setting.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Setting(
      userId: serializer.fromJson<int>(json['user_id']),
      language: serializer.fromJson<String>(json['language']),
      createdAt: serializer.fromJson<DateTime>(json['created_at']),
      createdBy: serializer.fromJson<int>(json['created_by']),
      updatedAt: serializer.fromJson<DateTime>(json['updated_at']),
      updatedBy: serializer.fromJson<int>(json['updated_by']),
      deletedAt: serializer.fromJson<DateTime?>(json['deleted_at']),
      deletedBy: serializer.fromJson<int?>(json['deleted_by']),
      realtime: serializer.fromJson<bool>(json['realtime']),
      lightmode: serializer.fromJson<bool>(json['lightmode']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'user_id': serializer.toJson<int>(userId),
      'language': serializer.toJson<String>(language),
      'created_at': serializer.toJson<DateTime>(createdAt),
      'created_by': serializer.toJson<int>(createdBy),
      'updated_at': serializer.toJson<DateTime>(updatedAt),
      'updated_by': serializer.toJson<int>(updatedBy),
      'deleted_at': serializer.toJson<DateTime?>(deletedAt),
      'deleted_by': serializer.toJson<int?>(deletedBy),
      'realtime': serializer.toJson<bool>(realtime),
      'lightmode': serializer.toJson<bool>(lightmode),
    };
  }

  Setting copyWith(
          {int? userId,
          String? language,
          DateTime? createdAt,
          int? createdBy,
          DateTime? updatedAt,
          int? updatedBy,
          Value<DateTime?> deletedAt = const Value.absent(),
          Value<int?> deletedBy = const Value.absent(),
          bool? realtime,
          bool? lightmode}) =>
      Setting(
        userId: userId ?? this.userId,
        language: language ?? this.language,
        createdAt: createdAt ?? this.createdAt,
        createdBy: createdBy ?? this.createdBy,
        updatedAt: updatedAt ?? this.updatedAt,
        updatedBy: updatedBy ?? this.updatedBy,
        deletedAt: deletedAt.present ? deletedAt.value : this.deletedAt,
        deletedBy: deletedBy.present ? deletedBy.value : this.deletedBy,
        realtime: realtime ?? this.realtime,
        lightmode: lightmode ?? this.lightmode,
      );
  @override
  String toString() {
    return (StringBuffer('Setting(')
          ..write('userId: $userId, ')
          ..write('language: $language, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy, ')
          ..write('realtime: $realtime, ')
          ..write('lightmode: $lightmode')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(userId, language, createdAt, createdBy,
      updatedAt, updatedBy, deletedAt, deletedBy, realtime, lightmode);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Setting &&
          other.userId == this.userId &&
          other.language == this.language &&
          other.createdAt == this.createdAt &&
          other.createdBy == this.createdBy &&
          other.updatedAt == this.updatedAt &&
          other.updatedBy == this.updatedBy &&
          other.deletedAt == this.deletedAt &&
          other.deletedBy == this.deletedBy &&
          other.realtime == this.realtime &&
          other.lightmode == this.lightmode);
}

class SettingsCompanion extends UpdateCompanion<Setting> {
  final Value<int> userId;
  final Value<String> language;
  final Value<DateTime> createdAt;
  final Value<int> createdBy;
  final Value<DateTime> updatedAt;
  final Value<int> updatedBy;
  final Value<DateTime?> deletedAt;
  final Value<int?> deletedBy;
  final Value<bool> realtime;
  final Value<bool> lightmode;
  const SettingsCompanion({
    this.userId = const Value.absent(),
    this.language = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.createdBy = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.updatedBy = const Value.absent(),
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
    this.realtime = const Value.absent(),
    this.lightmode = const Value.absent(),
  });
  SettingsCompanion.insert({
    this.userId = const Value.absent(),
    required String language,
    required DateTime createdAt,
    required int createdBy,
    required DateTime updatedAt,
    required int updatedBy,
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
    required bool realtime,
    required bool lightmode,
  })  : language = Value(language),
        createdAt = Value(createdAt),
        createdBy = Value(createdBy),
        updatedAt = Value(updatedAt),
        updatedBy = Value(updatedBy),
        realtime = Value(realtime),
        lightmode = Value(lightmode);
  static Insertable<Setting> custom({
    Expression<int>? userId,
    Expression<String>? language,
    Expression<DateTime>? createdAt,
    Expression<int>? createdBy,
    Expression<DateTime>? updatedAt,
    Expression<int>? updatedBy,
    Expression<DateTime>? deletedAt,
    Expression<int>? deletedBy,
    Expression<bool>? realtime,
    Expression<bool>? lightmode,
  }) {
    return RawValuesInsertable({
      if (userId != null) 'user_id': userId,
      if (language != null) 'language': language,
      if (createdAt != null) 'created_at': createdAt,
      if (createdBy != null) 'created_by': createdBy,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (updatedBy != null) 'updated_by': updatedBy,
      if (deletedAt != null) 'deleted_at': deletedAt,
      if (deletedBy != null) 'deleted_by': deletedBy,
      if (realtime != null) 'realtime': realtime,
      if (lightmode != null) 'lightmode': lightmode,
    });
  }

  SettingsCompanion copyWith(
      {Value<int>? userId,
      Value<String>? language,
      Value<DateTime>? createdAt,
      Value<int>? createdBy,
      Value<DateTime>? updatedAt,
      Value<int>? updatedBy,
      Value<DateTime?>? deletedAt,
      Value<int?>? deletedBy,
      Value<bool>? realtime,
      Value<bool>? lightmode}) {
    return SettingsCompanion(
      userId: userId ?? this.userId,
      language: language ?? this.language,
      createdAt: createdAt ?? this.createdAt,
      createdBy: createdBy ?? this.createdBy,
      updatedAt: updatedAt ?? this.updatedAt,
      updatedBy: updatedBy ?? this.updatedBy,
      deletedAt: deletedAt ?? this.deletedAt,
      deletedBy: deletedBy ?? this.deletedBy,
      realtime: realtime ?? this.realtime,
      lightmode: lightmode ?? this.lightmode,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (userId.present) {
      map['user_id'] = Variable<int>(userId.value);
    }
    if (language.present) {
      map['language'] = Variable<String>(language.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (createdBy.present) {
      map['created_by'] = Variable<int>(createdBy.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (updatedBy.present) {
      map['updated_by'] = Variable<int>(updatedBy.value);
    }
    if (deletedAt.present) {
      map['deleted_at'] = Variable<DateTime>(deletedAt.value);
    }
    if (deletedBy.present) {
      map['deleted_by'] = Variable<int>(deletedBy.value);
    }
    if (realtime.present) {
      map['realtime'] = Variable<bool>(realtime.value);
    }
    if (lightmode.present) {
      map['lightmode'] = Variable<bool>(lightmode.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('SettingsCompanion(')
          ..write('userId: $userId, ')
          ..write('language: $language, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy, ')
          ..write('realtime: $realtime, ')
          ..write('lightmode: $lightmode')
          ..write(')'))
        .toString();
  }
}

class Bytes extends Table with TableInfo<Bytes, Byte> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  Bytes(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _feedbackIdMeta =
      const VerificationMeta('feedbackId');
  late final GeneratedColumn<String> feedbackId = GeneratedColumn<String>(
      'feedback_id', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _imageMeta = const VerificationMeta('image');
  late final GeneratedColumn<String> image = GeneratedColumn<String>(
      'image', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _imageXidMeta =
      const VerificationMeta('imageXid');
  late final GeneratedColumn<String> imageXid = GeneratedColumn<String>(
      'imageXid', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  @override
  List<GeneratedColumn> get $columns => [feedbackId, image, imageXid];
  @override
  String get aliasedName => _alias ?? 'bytes';
  @override
  String get actualTableName => 'bytes';
  @override
  VerificationContext validateIntegrity(Insertable<Byte> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('feedback_id')) {
      context.handle(
          _feedbackIdMeta,
          feedbackId.isAcceptableOrUnknown(
              data['feedback_id']!, _feedbackIdMeta));
    } else if (isInserting) {
      context.missing(_feedbackIdMeta);
    }
    if (data.containsKey('image')) {
      context.handle(
          _imageMeta, image.isAcceptableOrUnknown(data['image']!, _imageMeta));
    } else if (isInserting) {
      context.missing(_imageMeta);
    }
    if (data.containsKey('imageXid')) {
      context.handle(_imageXidMeta,
          imageXid.isAcceptableOrUnknown(data['imageXid']!, _imageXidMeta));
    } else if (isInserting) {
      context.missing(_imageXidMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {feedbackId};
  @override
  Byte map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Byte(
      feedbackId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}feedback_id'])!,
      image: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}image'])!,
      imageXid: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}imageXid'])!,
    );
  }

  @override
  Bytes createAlias(String alias) {
    return Bytes(attachedDatabase, alias);
  }

  @override
  List<String> get customConstraints => const [
        'CONSTRAINT bytes_pkey PRIMARY KEY(feedback_id)',
        'CONSTRAINT bytes_feedback_id_fkey FOREIGN KEY(feedback_id)REFERENCES feedback(id)ON DELETE CASCADE'
      ];
  @override
  bool get dontWriteConstraints => true;
}

class Byte extends DataClass implements Insertable<Byte> {
  final String feedbackId;
  final String image;
  final String imageXid;
  const Byte(
      {required this.feedbackId, required this.image, required this.imageXid});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['feedback_id'] = Variable<String>(feedbackId);
    map['image'] = Variable<String>(image);
    map['imageXid'] = Variable<String>(imageXid);
    return map;
  }

  BytesCompanion toCompanion(bool nullToAbsent) {
    return BytesCompanion(
      feedbackId: Value(feedbackId),
      image: Value(image),
      imageXid: Value(imageXid),
    );
  }

  factory Byte.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Byte(
      feedbackId: serializer.fromJson<String>(json['feedback_id']),
      image: serializer.fromJson<String>(json['image']),
      imageXid: serializer.fromJson<String>(json['imageXid']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'feedback_id': serializer.toJson<String>(feedbackId),
      'image': serializer.toJson<String>(image),
      'imageXid': serializer.toJson<String>(imageXid),
    };
  }

  Byte copyWith({String? feedbackId, String? image, String? imageXid}) => Byte(
        feedbackId: feedbackId ?? this.feedbackId,
        image: image ?? this.image,
        imageXid: imageXid ?? this.imageXid,
      );
  @override
  String toString() {
    return (StringBuffer('Byte(')
          ..write('feedbackId: $feedbackId, ')
          ..write('image: $image, ')
          ..write('imageXid: $imageXid')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(feedbackId, image, imageXid);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Byte &&
          other.feedbackId == this.feedbackId &&
          other.image == this.image &&
          other.imageXid == this.imageXid);
}

class BytesCompanion extends UpdateCompanion<Byte> {
  final Value<String> feedbackId;
  final Value<String> image;
  final Value<String> imageXid;
  final Value<int> rowid;
  const BytesCompanion({
    this.feedbackId = const Value.absent(),
    this.image = const Value.absent(),
    this.imageXid = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  BytesCompanion.insert({
    required String feedbackId,
    required String image,
    required String imageXid,
    this.rowid = const Value.absent(),
  })  : feedbackId = Value(feedbackId),
        image = Value(image),
        imageXid = Value(imageXid);
  static Insertable<Byte> custom({
    Expression<String>? feedbackId,
    Expression<String>? image,
    Expression<String>? imageXid,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (feedbackId != null) 'feedback_id': feedbackId,
      if (image != null) 'image': image,
      if (imageXid != null) 'imageXid': imageXid,
      if (rowid != null) 'rowid': rowid,
    });
  }

  BytesCompanion copyWith(
      {Value<String>? feedbackId,
      Value<String>? image,
      Value<String>? imageXid,
      Value<int>? rowid}) {
    return BytesCompanion(
      feedbackId: feedbackId ?? this.feedbackId,
      image: image ?? this.image,
      imageXid: imageXid ?? this.imageXid,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (feedbackId.present) {
      map['feedback_id'] = Variable<String>(feedbackId.value);
    }
    if (image.present) {
      map['image'] = Variable<String>(image.value);
    }
    if (imageXid.present) {
      map['imageXid'] = Variable<String>(imageXid.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('BytesCompanion(')
          ..write('feedbackId: $feedbackId, ')
          ..write('image: $image, ')
          ..write('imageXid: $imageXid, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class Assets extends Table with TableInfo<Assets, Asset> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  Assets(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
      'name', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _typeMeta = const VerificationMeta('type');
  late final GeneratedColumnWithTypeConverter<ContentType, String> type =
      GeneratedColumn<String>('type', aliasedName, false,
              type: DriftSqlType.string,
              requiredDuringInsert: true,
              $customConstraints: 'NOT NULL')
          .withConverter<ContentType>(Assets.$convertertype);
  static const VerificationMeta _fileMeta = const VerificationMeta('file');
  late final GeneratedColumn<String> file = GeneratedColumn<String>(
      'file', aliasedName, true,
      type: DriftSqlType.string,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _textfieldMeta =
      const VerificationMeta('textfield');
  late final GeneratedColumn<String> textfield = GeneratedColumn<String>(
      'textfield', aliasedName, true,
      type: DriftSqlType.string,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdByMeta =
      const VerificationMeta('createdBy');
  late final GeneratedColumn<int> createdBy = GeneratedColumn<int>(
      'created_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedByMeta =
      const VerificationMeta('updatedBy');
  late final GeneratedColumn<int> updatedBy = GeneratedColumn<int>(
      'updated_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _deletedAtMeta =
      const VerificationMeta('deletedAt');
  late final GeneratedColumn<DateTime> deletedAt = GeneratedColumn<DateTime>(
      'deleted_at', aliasedName, true,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _deletedByMeta =
      const VerificationMeta('deletedBy');
  late final GeneratedColumn<int> deletedBy = GeneratedColumn<int>(
      'deleted_by', aliasedName, true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      $customConstraints: '');
  @override
  List<GeneratedColumn> get $columns => [
        id,
        name,
        type,
        file,
        textfield,
        createdAt,
        createdBy,
        updatedAt,
        updatedBy,
        deletedAt,
        deletedBy
      ];
  @override
  String get aliasedName => _alias ?? 'assets';
  @override
  String get actualTableName => 'assets';
  @override
  VerificationContext validateIntegrity(Insertable<Asset> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('name')) {
      context.handle(
          _nameMeta, name.isAcceptableOrUnknown(data['name']!, _nameMeta));
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    context.handle(_typeMeta, const VerificationResult.success());
    if (data.containsKey('file')) {
      context.handle(
          _fileMeta, file.isAcceptableOrUnknown(data['file']!, _fileMeta));
    }
    if (data.containsKey('textfield')) {
      context.handle(_textfieldMeta,
          textfield.isAcceptableOrUnknown(data['textfield']!, _textfieldMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('created_by')) {
      context.handle(_createdByMeta,
          createdBy.isAcceptableOrUnknown(data['created_by']!, _createdByMeta));
    } else if (isInserting) {
      context.missing(_createdByMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('updated_by')) {
      context.handle(_updatedByMeta,
          updatedBy.isAcceptableOrUnknown(data['updated_by']!, _updatedByMeta));
    } else if (isInserting) {
      context.missing(_updatedByMeta);
    }
    if (data.containsKey('deleted_at')) {
      context.handle(_deletedAtMeta,
          deletedAt.isAcceptableOrUnknown(data['deleted_at']!, _deletedAtMeta));
    }
    if (data.containsKey('deleted_by')) {
      context.handle(_deletedByMeta,
          deletedBy.isAcceptableOrUnknown(data['deleted_by']!, _deletedByMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Asset map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Asset(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      name: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}name'])!,
      type: Assets.$convertertype.fromSql(attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}type'])!),
      file: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}file']),
      textfield: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}textfield']),
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      createdBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}created_by'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}updated_at'])!,
      updatedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}updated_by'])!,
      deletedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}deleted_at']),
      deletedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}deleted_by']),
    );
  }

  @override
  Assets createAlias(String alias) {
    return Assets(attachedDatabase, alias);
  }

  static JsonTypeConverter2<ContentType, String, String> $convertertype =
      const EnumNameConverter<ContentType>(ContentType.values);
  @override
  List<String> get customConstraints =>
      const ['CONSTRAINT asset_pkey PRIMARY KEY(id)'];
  @override
  bool get dontWriteConstraints => true;
}

class Asset extends DataClass implements Insertable<Asset> {
  final int id;
  final String name;
  final ContentType type;
  final String? file;
  final String? textfield;
  final DateTime createdAt;
  final int createdBy;
  final DateTime updatedAt;
  final int updatedBy;
  final DateTime? deletedAt;
  final int? deletedBy;
  const Asset(
      {required this.id,
      required this.name,
      required this.type,
      this.file,
      this.textfield,
      required this.createdAt,
      required this.createdBy,
      required this.updatedAt,
      required this.updatedBy,
      this.deletedAt,
      this.deletedBy});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['name'] = Variable<String>(name);
    {
      final converter = Assets.$convertertype;
      map['type'] = Variable<String>(converter.toSql(type));
    }
    if (!nullToAbsent || file != null) {
      map['file'] = Variable<String>(file);
    }
    if (!nullToAbsent || textfield != null) {
      map['textfield'] = Variable<String>(textfield);
    }
    map['created_at'] = Variable<DateTime>(createdAt);
    map['created_by'] = Variable<int>(createdBy);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    map['updated_by'] = Variable<int>(updatedBy);
    if (!nullToAbsent || deletedAt != null) {
      map['deleted_at'] = Variable<DateTime>(deletedAt);
    }
    if (!nullToAbsent || deletedBy != null) {
      map['deleted_by'] = Variable<int>(deletedBy);
    }
    return map;
  }

  AssetsCompanion toCompanion(bool nullToAbsent) {
    return AssetsCompanion(
      id: Value(id),
      name: Value(name),
      type: Value(type),
      file: file == null && nullToAbsent ? const Value.absent() : Value(file),
      textfield: textfield == null && nullToAbsent
          ? const Value.absent()
          : Value(textfield),
      createdAt: Value(createdAt),
      createdBy: Value(createdBy),
      updatedAt: Value(updatedAt),
      updatedBy: Value(updatedBy),
      deletedAt: deletedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedAt),
      deletedBy: deletedBy == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedBy),
    );
  }

  factory Asset.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Asset(
      id: serializer.fromJson<int>(json['id']),
      name: serializer.fromJson<String>(json['name']),
      type: Assets.$convertertype
          .fromJson(serializer.fromJson<String>(json['type'])),
      file: serializer.fromJson<String?>(json['file']),
      textfield: serializer.fromJson<String?>(json['textfield']),
      createdAt: serializer.fromJson<DateTime>(json['created_at']),
      createdBy: serializer.fromJson<int>(json['created_by']),
      updatedAt: serializer.fromJson<DateTime>(json['updated_at']),
      updatedBy: serializer.fromJson<int>(json['updated_by']),
      deletedAt: serializer.fromJson<DateTime?>(json['deleted_at']),
      deletedBy: serializer.fromJson<int?>(json['deleted_by']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'name': serializer.toJson<String>(name),
      'type': serializer.toJson<String>(Assets.$convertertype.toJson(type)),
      'file': serializer.toJson<String?>(file),
      'textfield': serializer.toJson<String?>(textfield),
      'created_at': serializer.toJson<DateTime>(createdAt),
      'created_by': serializer.toJson<int>(createdBy),
      'updated_at': serializer.toJson<DateTime>(updatedAt),
      'updated_by': serializer.toJson<int>(updatedBy),
      'deleted_at': serializer.toJson<DateTime?>(deletedAt),
      'deleted_by': serializer.toJson<int?>(deletedBy),
    };
  }

  Asset copyWith(
          {int? id,
          String? name,
          ContentType? type,
          Value<String?> file = const Value.absent(),
          Value<String?> textfield = const Value.absent(),
          DateTime? createdAt,
          int? createdBy,
          DateTime? updatedAt,
          int? updatedBy,
          Value<DateTime?> deletedAt = const Value.absent(),
          Value<int?> deletedBy = const Value.absent()}) =>
      Asset(
        id: id ?? this.id,
        name: name ?? this.name,
        type: type ?? this.type,
        file: file.present ? file.value : this.file,
        textfield: textfield.present ? textfield.value : this.textfield,
        createdAt: createdAt ?? this.createdAt,
        createdBy: createdBy ?? this.createdBy,
        updatedAt: updatedAt ?? this.updatedAt,
        updatedBy: updatedBy ?? this.updatedBy,
        deletedAt: deletedAt.present ? deletedAt.value : this.deletedAt,
        deletedBy: deletedBy.present ? deletedBy.value : this.deletedBy,
      );
  @override
  String toString() {
    return (StringBuffer('Asset(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('type: $type, ')
          ..write('file: $file, ')
          ..write('textfield: $textfield, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, name, type, file, textfield, createdAt,
      createdBy, updatedAt, updatedBy, deletedAt, deletedBy);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Asset &&
          other.id == this.id &&
          other.name == this.name &&
          other.type == this.type &&
          other.file == this.file &&
          other.textfield == this.textfield &&
          other.createdAt == this.createdAt &&
          other.createdBy == this.createdBy &&
          other.updatedAt == this.updatedAt &&
          other.updatedBy == this.updatedBy &&
          other.deletedAt == this.deletedAt &&
          other.deletedBy == this.deletedBy);
}

class AssetsCompanion extends UpdateCompanion<Asset> {
  final Value<int> id;
  final Value<String> name;
  final Value<ContentType> type;
  final Value<String?> file;
  final Value<String?> textfield;
  final Value<DateTime> createdAt;
  final Value<int> createdBy;
  final Value<DateTime> updatedAt;
  final Value<int> updatedBy;
  final Value<DateTime?> deletedAt;
  final Value<int?> deletedBy;
  const AssetsCompanion({
    this.id = const Value.absent(),
    this.name = const Value.absent(),
    this.type = const Value.absent(),
    this.file = const Value.absent(),
    this.textfield = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.createdBy = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.updatedBy = const Value.absent(),
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
  });
  AssetsCompanion.insert({
    this.id = const Value.absent(),
    required String name,
    required ContentType type,
    this.file = const Value.absent(),
    this.textfield = const Value.absent(),
    required DateTime createdAt,
    required int createdBy,
    required DateTime updatedAt,
    required int updatedBy,
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
  })  : name = Value(name),
        type = Value(type),
        createdAt = Value(createdAt),
        createdBy = Value(createdBy),
        updatedAt = Value(updatedAt),
        updatedBy = Value(updatedBy);
  static Insertable<Asset> custom({
    Expression<int>? id,
    Expression<String>? name,
    Expression<String>? type,
    Expression<String>? file,
    Expression<String>? textfield,
    Expression<DateTime>? createdAt,
    Expression<int>? createdBy,
    Expression<DateTime>? updatedAt,
    Expression<int>? updatedBy,
    Expression<DateTime>? deletedAt,
    Expression<int>? deletedBy,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (type != null) 'type': type,
      if (file != null) 'file': file,
      if (textfield != null) 'textfield': textfield,
      if (createdAt != null) 'created_at': createdAt,
      if (createdBy != null) 'created_by': createdBy,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (updatedBy != null) 'updated_by': updatedBy,
      if (deletedAt != null) 'deleted_at': deletedAt,
      if (deletedBy != null) 'deleted_by': deletedBy,
    });
  }

  AssetsCompanion copyWith(
      {Value<int>? id,
      Value<String>? name,
      Value<ContentType>? type,
      Value<String?>? file,
      Value<String?>? textfield,
      Value<DateTime>? createdAt,
      Value<int>? createdBy,
      Value<DateTime>? updatedAt,
      Value<int>? updatedBy,
      Value<DateTime?>? deletedAt,
      Value<int?>? deletedBy}) {
    return AssetsCompanion(
      id: id ?? this.id,
      name: name ?? this.name,
      type: type ?? this.type,
      file: file ?? this.file,
      textfield: textfield ?? this.textfield,
      createdAt: createdAt ?? this.createdAt,
      createdBy: createdBy ?? this.createdBy,
      updatedAt: updatedAt ?? this.updatedAt,
      updatedBy: updatedBy ?? this.updatedBy,
      deletedAt: deletedAt ?? this.deletedAt,
      deletedBy: deletedBy ?? this.deletedBy,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (type.present) {
      final converter = Assets.$convertertype;
      map['type'] = Variable<String>(converter.toSql(type.value));
    }
    if (file.present) {
      map['file'] = Variable<String>(file.value);
    }
    if (textfield.present) {
      map['textfield'] = Variable<String>(textfield.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (createdBy.present) {
      map['created_by'] = Variable<int>(createdBy.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (updatedBy.present) {
      map['updated_by'] = Variable<int>(updatedBy.value);
    }
    if (deletedAt.present) {
      map['deleted_at'] = Variable<DateTime>(deletedAt.value);
    }
    if (deletedBy.present) {
      map['deleted_by'] = Variable<int>(deletedBy.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('AssetsCompanion(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('type: $type, ')
          ..write('file: $file, ')
          ..write('textfield: $textfield, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy')
          ..write(')'))
        .toString();
  }
}

class InstructionsAssets extends Table
    with TableInfo<InstructionsAssets, InstructionAsset> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  InstructionsAssets(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _instructionIdMeta =
      const VerificationMeta('instructionId');
  late final GeneratedColumn<int> instructionId = GeneratedColumn<int>(
      'instruction_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _assetIdMeta =
      const VerificationMeta('assetId');
  late final GeneratedColumn<int> assetId = GeneratedColumn<int>(
      'asset_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _createdByMeta =
      const VerificationMeta('createdBy');
  late final GeneratedColumn<int> createdBy = GeneratedColumn<int>(
      'created_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _updatedByMeta =
      const VerificationMeta('updatedBy');
  late final GeneratedColumn<int> updatedBy = GeneratedColumn<int>(
      'updated_by', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _deletedAtMeta =
      const VerificationMeta('deletedAt');
  late final GeneratedColumn<DateTime> deletedAt = GeneratedColumn<DateTime>(
      'deleted_at', aliasedName, true,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      $customConstraints: '');
  static const VerificationMeta _deletedByMeta =
      const VerificationMeta('deletedBy');
  late final GeneratedColumn<int> deletedBy = GeneratedColumn<int>(
      'deleted_by', aliasedName, true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      $customConstraints: '');
  @override
  List<GeneratedColumn> get $columns => [
        instructionId,
        assetId,
        createdAt,
        createdBy,
        updatedAt,
        updatedBy,
        deletedAt,
        deletedBy
      ];
  @override
  String get aliasedName => _alias ?? 'InstructionsAssets';
  @override
  String get actualTableName => 'InstructionsAssets';
  @override
  VerificationContext validateIntegrity(Insertable<InstructionAsset> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('instruction_id')) {
      context.handle(
          _instructionIdMeta,
          instructionId.isAcceptableOrUnknown(
              data['instruction_id']!, _instructionIdMeta));
    } else if (isInserting) {
      context.missing(_instructionIdMeta);
    }
    if (data.containsKey('asset_id')) {
      context.handle(_assetIdMeta,
          assetId.isAcceptableOrUnknown(data['asset_id']!, _assetIdMeta));
    } else if (isInserting) {
      context.missing(_assetIdMeta);
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('created_by')) {
      context.handle(_createdByMeta,
          createdBy.isAcceptableOrUnknown(data['created_by']!, _createdByMeta));
    } else if (isInserting) {
      context.missing(_createdByMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    if (data.containsKey('updated_by')) {
      context.handle(_updatedByMeta,
          updatedBy.isAcceptableOrUnknown(data['updated_by']!, _updatedByMeta));
    } else if (isInserting) {
      context.missing(_updatedByMeta);
    }
    if (data.containsKey('deleted_at')) {
      context.handle(_deletedAtMeta,
          deletedAt.isAcceptableOrUnknown(data['deleted_at']!, _deletedAtMeta));
    }
    if (data.containsKey('deleted_by')) {
      context.handle(_deletedByMeta,
          deletedBy.isAcceptableOrUnknown(data['deleted_by']!, _deletedByMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {instructionId, assetId};
  @override
  InstructionAsset map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return InstructionAsset(
      instructionId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}instruction_id'])!,
      assetId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}asset_id'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      createdBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}created_by'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}updated_at'])!,
      updatedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}updated_by'])!,
      deletedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}deleted_at']),
      deletedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}deleted_by']),
    );
  }

  @override
  InstructionsAssets createAlias(String alias) {
    return InstructionsAssets(attachedDatabase, alias);
  }

  @override
  List<String> get customConstraints => const [
        'CONSTRAINT instruction_asset_pkey PRIMARY KEY(instruction_id, asset_id)',
        'CONSTRAINT instruction_asset_asset_id_fkey FOREIGN KEY(asset_id)REFERENCES assets(id)ON UPDATE CASCADE ON DELETE CASCADE',
        'CONSTRAINT instruction_asset_instruction_id_fkey FOREIGN KEY(instruction_id)REFERENCES instructions(id)ON UPDATE CASCADE ON DELETE CASCADE'
      ];
  @override
  bool get dontWriteConstraints => true;
}

class InstructionAsset extends DataClass
    implements Insertable<InstructionAsset> {
  final int instructionId;
  final int assetId;
  final DateTime createdAt;
  final int createdBy;
  final DateTime updatedAt;
  final int updatedBy;
  final DateTime? deletedAt;
  final int? deletedBy;
  const InstructionAsset(
      {required this.instructionId,
      required this.assetId,
      required this.createdAt,
      required this.createdBy,
      required this.updatedAt,
      required this.updatedBy,
      this.deletedAt,
      this.deletedBy});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['instruction_id'] = Variable<int>(instructionId);
    map['asset_id'] = Variable<int>(assetId);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['created_by'] = Variable<int>(createdBy);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    map['updated_by'] = Variable<int>(updatedBy);
    if (!nullToAbsent || deletedAt != null) {
      map['deleted_at'] = Variable<DateTime>(deletedAt);
    }
    if (!nullToAbsent || deletedBy != null) {
      map['deleted_by'] = Variable<int>(deletedBy);
    }
    return map;
  }

  InstructionsAssetsCompanion toCompanion(bool nullToAbsent) {
    return InstructionsAssetsCompanion(
      instructionId: Value(instructionId),
      assetId: Value(assetId),
      createdAt: Value(createdAt),
      createdBy: Value(createdBy),
      updatedAt: Value(updatedAt),
      updatedBy: Value(updatedBy),
      deletedAt: deletedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedAt),
      deletedBy: deletedBy == null && nullToAbsent
          ? const Value.absent()
          : Value(deletedBy),
    );
  }

  factory InstructionAsset.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return InstructionAsset(
      instructionId: serializer.fromJson<int>(json['instruction_id']),
      assetId: serializer.fromJson<int>(json['asset_id']),
      createdAt: serializer.fromJson<DateTime>(json['created_at']),
      createdBy: serializer.fromJson<int>(json['created_by']),
      updatedAt: serializer.fromJson<DateTime>(json['updated_at']),
      updatedBy: serializer.fromJson<int>(json['updated_by']),
      deletedAt: serializer.fromJson<DateTime?>(json['deleted_at']),
      deletedBy: serializer.fromJson<int?>(json['deleted_by']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'instruction_id': serializer.toJson<int>(instructionId),
      'asset_id': serializer.toJson<int>(assetId),
      'created_at': serializer.toJson<DateTime>(createdAt),
      'created_by': serializer.toJson<int>(createdBy),
      'updated_at': serializer.toJson<DateTime>(updatedAt),
      'updated_by': serializer.toJson<int>(updatedBy),
      'deleted_at': serializer.toJson<DateTime?>(deletedAt),
      'deleted_by': serializer.toJson<int?>(deletedBy),
    };
  }

  InstructionAsset copyWith(
          {int? instructionId,
          int? assetId,
          DateTime? createdAt,
          int? createdBy,
          DateTime? updatedAt,
          int? updatedBy,
          Value<DateTime?> deletedAt = const Value.absent(),
          Value<int?> deletedBy = const Value.absent()}) =>
      InstructionAsset(
        instructionId: instructionId ?? this.instructionId,
        assetId: assetId ?? this.assetId,
        createdAt: createdAt ?? this.createdAt,
        createdBy: createdBy ?? this.createdBy,
        updatedAt: updatedAt ?? this.updatedAt,
        updatedBy: updatedBy ?? this.updatedBy,
        deletedAt: deletedAt.present ? deletedAt.value : this.deletedAt,
        deletedBy: deletedBy.present ? deletedBy.value : this.deletedBy,
      );
  @override
  String toString() {
    return (StringBuffer('InstructionAsset(')
          ..write('instructionId: $instructionId, ')
          ..write('assetId: $assetId, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(instructionId, assetId, createdAt, createdBy,
      updatedAt, updatedBy, deletedAt, deletedBy);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is InstructionAsset &&
          other.instructionId == this.instructionId &&
          other.assetId == this.assetId &&
          other.createdAt == this.createdAt &&
          other.createdBy == this.createdBy &&
          other.updatedAt == this.updatedAt &&
          other.updatedBy == this.updatedBy &&
          other.deletedAt == this.deletedAt &&
          other.deletedBy == this.deletedBy);
}

class InstructionsAssetsCompanion extends UpdateCompanion<InstructionAsset> {
  final Value<int> instructionId;
  final Value<int> assetId;
  final Value<DateTime> createdAt;
  final Value<int> createdBy;
  final Value<DateTime> updatedAt;
  final Value<int> updatedBy;
  final Value<DateTime?> deletedAt;
  final Value<int?> deletedBy;
  final Value<int> rowid;
  const InstructionsAssetsCompanion({
    this.instructionId = const Value.absent(),
    this.assetId = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.createdBy = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.updatedBy = const Value.absent(),
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  InstructionsAssetsCompanion.insert({
    required int instructionId,
    required int assetId,
    required DateTime createdAt,
    required int createdBy,
    required DateTime updatedAt,
    required int updatedBy,
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : instructionId = Value(instructionId),
        assetId = Value(assetId),
        createdAt = Value(createdAt),
        createdBy = Value(createdBy),
        updatedAt = Value(updatedAt),
        updatedBy = Value(updatedBy);
  static Insertable<InstructionAsset> custom({
    Expression<int>? instructionId,
    Expression<int>? assetId,
    Expression<DateTime>? createdAt,
    Expression<int>? createdBy,
    Expression<DateTime>? updatedAt,
    Expression<int>? updatedBy,
    Expression<DateTime>? deletedAt,
    Expression<int>? deletedBy,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (instructionId != null) 'instruction_id': instructionId,
      if (assetId != null) 'asset_id': assetId,
      if (createdAt != null) 'created_at': createdAt,
      if (createdBy != null) 'created_by': createdBy,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (updatedBy != null) 'updated_by': updatedBy,
      if (deletedAt != null) 'deleted_at': deletedAt,
      if (deletedBy != null) 'deleted_by': deletedBy,
      if (rowid != null) 'rowid': rowid,
    });
  }

  InstructionsAssetsCompanion copyWith(
      {Value<int>? instructionId,
      Value<int>? assetId,
      Value<DateTime>? createdAt,
      Value<int>? createdBy,
      Value<DateTime>? updatedAt,
      Value<int>? updatedBy,
      Value<DateTime?>? deletedAt,
      Value<int?>? deletedBy,
      Value<int>? rowid}) {
    return InstructionsAssetsCompanion(
      instructionId: instructionId ?? this.instructionId,
      assetId: assetId ?? this.assetId,
      createdAt: createdAt ?? this.createdAt,
      createdBy: createdBy ?? this.createdBy,
      updatedAt: updatedAt ?? this.updatedAt,
      updatedBy: updatedBy ?? this.updatedBy,
      deletedAt: deletedAt ?? this.deletedAt,
      deletedBy: deletedBy ?? this.deletedBy,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (instructionId.present) {
      map['instruction_id'] = Variable<int>(instructionId.value);
    }
    if (assetId.present) {
      map['asset_id'] = Variable<int>(assetId.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (createdBy.present) {
      map['created_by'] = Variable<int>(createdBy.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (updatedBy.present) {
      map['updated_by'] = Variable<int>(updatedBy.value);
    }
    if (deletedAt.present) {
      map['deleted_at'] = Variable<DateTime>(deletedAt.value);
    }
    if (deletedBy.present) {
      map['deleted_by'] = Variable<int>(deletedBy.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('InstructionsAssetsCompanion(')
          ..write('instructionId: $instructionId, ')
          ..write('assetId: $assetId, ')
          ..write('createdAt: $createdAt, ')
          ..write('createdBy: $createdBy, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('updatedBy: $updatedBy, ')
          ..write('deletedAt: $deletedAt, ')
          ..write('deletedBy: $deletedBy, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  late final Categories categories = Categories(this);
  late final Instructions instructions = Instructions(this);
  late final Users users = Users(this);
  late final FeedbackTable feedback = FeedbackTable(this);
  late final InstructionSteps instructionSteps = InstructionSteps(this);
  late final Histories histories = Histories(this);
  late final InstructionsCategories instructionsCategories =
      InstructionsCategories(this);
  late final Settings settings = Settings(this);
  late final Bytes bytes = Bytes(this);
  late final Assets assets = Assets(this);
  late final InstructionsAssets instructionsAssets = InstructionsAssets(this);
  Future<int> updateHistoryEntry(int instructionId, DateTime updatedAt,
      int userId, int createdBy, DateTime createdAt, int updatedBy) {
    return customInsert(
      'WITH new_id AS (SELECT ?1 AS instruction_id, ?2 AS updated_at) INSERT INTO histories (user_id, instruction_id, created_by, created_at, updated_at, updated_by, instruction_step_id, open) VALUES (?3, (SELECT instruction_id FROM new_id), ?4, ?5, ?2, ?6, (SELECT i.id FROM instruction_steps AS i WHERE i.step_nr = (SELECT MIN(j.step_nr) FROM instruction_steps AS j WHERE j.instruction_id = (SELECT instruction_id FROM new_id)) AND i.instruction_id = (SELECT instruction_id FROM new_id)), FALSE) ON CONFLICT (user_id, instruction_id) DO UPDATE SET updated_at = (SELECT updated_at FROM new_id), open = FALSE',
      variables: [
        Variable<int>(instructionId),
        Variable<DateTime>(updatedAt),
        Variable<int>(userId),
        Variable<int>(createdBy),
        Variable<DateTime>(createdAt),
        Variable<int>(updatedBy)
      ],
      updates: {histories},
    );
  }

  Selectable<OpenInstructionResult> openInstruction(int userId) {
    return customSelect(
        'SELECT * FROM instructions INNER JOIN histories ON instructions.id = histories.instruction_id WHERE histories.user_id = ?1 AND histories.updated_at = (SELECT MAX(updated_at) FROM histories WHERE user_id = ?1) AND instructions.deleted_at IS NULL AND histories.open = TRUE',
        variables: [
          Variable<int>(userId)
        ],
        readsFrom: {
          instructions,
          histories,
        }).map((QueryRow row) {
      return OpenInstructionResult(
        id: row.read<int>('id'),
        title: row.read<String>('title'),
        shortTitle: row.read<String>('short_title'),
        image: row.read<String>('image'),
        description: row.read<String>('description'),
        createdAt: row.read<DateTime>('created_at'),
        createdBy: row.read<int>('created_by'),
        updatedAt: row.read<DateTime>('updated_at'),
        updatedBy: row.read<int>('updated_by'),
        deletedAt: row.readNullable<DateTime>('deleted_at'),
        deletedBy: row.readNullable<int>('deleted_by'),
        userId: row.read<int>('user_id'),
        instructionId: row.read<int>('instruction_id'),
        createdAt1: row.read<DateTime>('created_at'),
        createdBy1: row.read<int>('created_by'),
        updatedAt1: row.read<DateTime>('updated_at'),
        updatedBy1: row.read<int>('updated_by'),
        deletedAt1: row.readNullable<DateTime>('deleted_at'),
        deletedBy1: row.readNullable<int>('deleted_by'),
        instructionStepId: row.readNullable<int>('instruction_step_id'),
        open: row.read<bool>('open'),
        additionalData: row.readNullable<String>('additional_data'),
      );
    });
  }

  Selectable<bool> isSynced(DateTime timestampSettings,
      DateTime timestampFeedback, DateTime timestampHistory) {
    return customSelect(
        'SELECT NOT(EXISTS (SELECT 1 AS _c1 FROM settings WHERE updated_at > ?1) OR EXISTS (SELECT 1 AS _c2 FROM feedback WHERE updated_at > ?2) OR EXISTS (SELECT 1 AS _c3 FROM histories WHERE updated_at > ?3))AS _c0',
        variables: [
          Variable<DateTime>(timestampSettings),
          Variable<DateTime>(timestampFeedback),
          Variable<DateTime>(timestampHistory)
        ],
        readsFrom: {
          settings,
          feedback,
          histories,
        }).map((QueryRow row) => row.read<bool>('_c0'));
  }

  Selectable<Feedback> getFeedbackLiked(int userId) {
    return customSelect(
        'SELECT * FROM feedback WHERE user_id = ?1 AND deleted_at IS NULL ORDER BY liked DESC, created_at DESC',
        variables: [
          Variable<int>(userId)
        ],
        readsFrom: {
          feedback,
        }).asyncMap(feedback.mapFromRow);
  }

  Selectable<HistoryEntriesOfUserAsInstructionsResult>
      historyEntriesOfUserAsInstructions(int userId) {
    return customSelect(
        'SELECT instructions.*, coalesce(q.number_of_steps, 0) AS number_of_steps FROM instructions LEFT JOIN (SELECT instruction_id, COUNT(*) AS number_of_steps FROM instruction_steps WHERE deleted_at IS NULL GROUP BY instruction_id) AS q ON q.instruction_id = instructions.id INNER JOIN (SELECT * FROM histories WHERE user_id = ?1 AND deleted_at IS NULL) AS r ON r.instruction_id = instructions.id WHERE instructions.deleted_at IS NULL ORDER BY r.updated_at DESC',
        variables: [
          Variable<int>(userId)
        ],
        readsFrom: {
          instructions,
          instructionSteps,
          histories,
        }).map((QueryRow row) {
      return HistoryEntriesOfUserAsInstructionsResult(
        id: row.read<int>('id'),
        title: row.read<String>('title'),
        shortTitle: row.read<String>('short_title'),
        image: row.read<String>('image'),
        description: row.read<String>('description'),
        createdAt: row.read<DateTime>('created_at'),
        createdBy: row.read<int>('created_by'),
        updatedAt: row.read<DateTime>('updated_at'),
        updatedBy: row.read<int>('updated_by'),
        deletedAt: row.readNullable<DateTime>('deleted_at'),
        deletedBy: row.readNullable<int>('deleted_by'),
        numberOfSteps: row.read<int>('number_of_steps'),
      );
    });
  }

  Selectable<AllInstructionsResult> allInstructions() {
    return customSelect(
        'SELECT instructions.*, coalesce(q.number_of_steps, 0) AS number_of_steps FROM instructions LEFT JOIN (SELECT instruction_id, COUNT(*) AS number_of_steps FROM instruction_steps WHERE deleted_at IS NULL GROUP BY instruction_id) AS q ON q.instruction_id = instructions.id WHERE instructions.deleted_at IS NULL ORDER BY id',
        variables: [],
        readsFrom: {
          instructions,
          instructionSteps,
        }).map((QueryRow row) {
      return AllInstructionsResult(
        id: row.read<int>('id'),
        title: row.read<String>('title'),
        shortTitle: row.read<String>('short_title'),
        image: row.read<String>('image'),
        description: row.read<String>('description'),
        createdAt: row.read<DateTime>('created_at'),
        createdBy: row.read<int>('created_by'),
        updatedAt: row.read<DateTime>('updated_at'),
        updatedBy: row.read<int>('updated_by'),
        deletedAt: row.readNullable<DateTime>('deleted_at'),
        deletedBy: row.readNullable<int>('deleted_by'),
        numberOfSteps: row.read<int>('number_of_steps'),
      );
    });
  }

  Selectable<AllInstructionsBySearchResult> allInstructionsBySearch(
      String word) {
    return customSelect(
        'SELECT instructions.*, coalesce(q.number_of_steps, 0) AS number_of_steps FROM instructions LEFT JOIN (SELECT instruction_id, COUNT(*) AS number_of_steps FROM instruction_steps WHERE deleted_at IS NULL GROUP BY instruction_id) AS q ON q.instruction_id = instructions.id WHERE instructions.deleted_at IS NULL AND(title LIKE \'%\' || ?1 || \'%\' OR short_title LIKE \'%\' || ?1 || \'%\')ORDER BY id',
        variables: [
          Variable<String>(word)
        ],
        readsFrom: {
          instructions,
          instructionSteps,
        }).map((QueryRow row) {
      return AllInstructionsBySearchResult(
        id: row.read<int>('id'),
        title: row.read<String>('title'),
        shortTitle: row.read<String>('short_title'),
        image: row.read<String>('image'),
        description: row.read<String>('description'),
        createdAt: row.read<DateTime>('created_at'),
        createdBy: row.read<int>('created_by'),
        updatedAt: row.read<DateTime>('updated_at'),
        updatedBy: row.read<int>('updated_by'),
        deletedAt: row.readNullable<DateTime>('deleted_at'),
        deletedBy: row.readNullable<int>('deleted_by'),
        numberOfSteps: row.read<int>('number_of_steps'),
      );
    });
  }

  Selectable<AllInstructionsByCategoryAndSearchResult>
      allInstructionsByCategoryAndSearch(int categoryId, String word) {
    return customSelect(
        'SELECT instructions.*, coalesce(q.number_of_steps, 0) AS number_of_steps FROM instructions LEFT JOIN (SELECT instruction_id, COUNT(*) AS number_of_steps FROM instruction_steps WHERE deleted_at IS NULL GROUP BY instruction_id) AS q ON q.instruction_id = instructions.id INNER JOIN (SELECT * FROM InstructionsCategories WHERE category_id = ?1 AND deleted_at IS NULL) AS r ON r.instruction_id = instructions.id WHERE instructions.deleted_at IS NULL AND(title LIKE \'%\' || ?2 || \'%\' OR short_title LIKE \'%\' || ?2 || \'%\')ORDER BY id',
        variables: [
          Variable<int>(categoryId),
          Variable<String>(word)
        ],
        readsFrom: {
          instructions,
          instructionSteps,
          instructionsCategories,
        }).map((QueryRow row) {
      return AllInstructionsByCategoryAndSearchResult(
        id: row.read<int>('id'),
        title: row.read<String>('title'),
        shortTitle: row.read<String>('short_title'),
        image: row.read<String>('image'),
        description: row.read<String>('description'),
        createdAt: row.read<DateTime>('created_at'),
        createdBy: row.read<int>('created_by'),
        updatedAt: row.read<DateTime>('updated_at'),
        updatedBy: row.read<int>('updated_by'),
        deletedAt: row.readNullable<DateTime>('deleted_at'),
        deletedBy: row.readNullable<int>('deleted_by'),
        numberOfSteps: row.read<int>('number_of_steps'),
      );
    });
  }

  Selectable<AllInstructionsByCategoryResult> allInstructionsByCategory(
      int categoryId) {
    return customSelect(
        'SELECT instructions.*, coalesce(q.number_of_steps, 0) AS number_of_steps FROM instructions LEFT JOIN (SELECT instruction_id, COUNT(*) AS number_of_steps FROM instruction_steps WHERE deleted_at IS NULL GROUP BY instruction_id) AS q ON q.instruction_id = instructions.id INNER JOIN (SELECT * FROM InstructionsCategories WHERE category_id = ?1 AND deleted_at IS NULL) AS r ON r.instruction_id = instructions.id WHERE instructions.deleted_at IS NULL ORDER BY id',
        variables: [
          Variable<int>(categoryId)
        ],
        readsFrom: {
          instructions,
          instructionSteps,
          instructionsCategories,
        }).map((QueryRow row) {
      return AllInstructionsByCategoryResult(
        id: row.read<int>('id'),
        title: row.read<String>('title'),
        shortTitle: row.read<String>('short_title'),
        image: row.read<String>('image'),
        description: row.read<String>('description'),
        createdAt: row.read<DateTime>('created_at'),
        createdBy: row.read<int>('created_by'),
        updatedAt: row.read<DateTime>('updated_at'),
        updatedBy: row.read<int>('updated_by'),
        deletedAt: row.readNullable<DateTime>('deleted_at'),
        deletedBy: row.readNullable<int>('deleted_by'),
        numberOfSteps: row.read<int>('number_of_steps'),
      );
    });
  }

  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [
        categories,
        instructions,
        users,
        feedback,
        instructionSteps,
        histories,
        instructionsCategories,
        settings,
        bytes,
        assets,
        instructionsAssets
      ];
  @override
  StreamQueryUpdateRules get streamUpdateRules => const StreamQueryUpdateRules(
        [
          WritePropagation(
            on: TableUpdateQuery.onTableName('instructions',
                limitUpdateKind: UpdateKind.delete),
            result: [
              TableUpdate('instruction_steps', kind: UpdateKind.delete),
            ],
          ),
          WritePropagation(
            on: TableUpdateQuery.onTableName('instructions',
                limitUpdateKind: UpdateKind.delete),
            result: [
              TableUpdate('histories', kind: UpdateKind.delete),
            ],
          ),
          WritePropagation(
            on: TableUpdateQuery.onTableName('instruction_steps',
                limitUpdateKind: UpdateKind.delete),
            result: [
              TableUpdate('histories', kind: UpdateKind.delete),
            ],
          ),
          WritePropagation(
            on: TableUpdateQuery.onTableName('users',
                limitUpdateKind: UpdateKind.delete),
            result: [
              TableUpdate('histories', kind: UpdateKind.delete),
            ],
          ),
          WritePropagation(
            on: TableUpdateQuery.onTableName('categories',
                limitUpdateKind: UpdateKind.delete),
            result: [
              TableUpdate('InstructionsCategories', kind: UpdateKind.delete),
            ],
          ),
          WritePropagation(
            on: TableUpdateQuery.onTableName('instructions',
                limitUpdateKind: UpdateKind.delete),
            result: [
              TableUpdate('InstructionsCategories', kind: UpdateKind.delete),
            ],
          ),
          WritePropagation(
            on: TableUpdateQuery.onTableName('users',
                limitUpdateKind: UpdateKind.delete),
            result: [
              TableUpdate('settings', kind: UpdateKind.delete),
            ],
          ),
          WritePropagation(
            on: TableUpdateQuery.onTableName('feedback',
                limitUpdateKind: UpdateKind.delete),
            result: [
              TableUpdate('bytes', kind: UpdateKind.delete),
            ],
          ),
          WritePropagation(
            on: TableUpdateQuery.onTableName('assets',
                limitUpdateKind: UpdateKind.delete),
            result: [
              TableUpdate('InstructionsAssets', kind: UpdateKind.delete),
            ],
          ),
          WritePropagation(
            on: TableUpdateQuery.onTableName('assets',
                limitUpdateKind: UpdateKind.update),
            result: [
              TableUpdate('InstructionsAssets', kind: UpdateKind.update),
            ],
          ),
          WritePropagation(
            on: TableUpdateQuery.onTableName('instructions',
                limitUpdateKind: UpdateKind.delete),
            result: [
              TableUpdate('InstructionsAssets', kind: UpdateKind.delete),
            ],
          ),
          WritePropagation(
            on: TableUpdateQuery.onTableName('instructions',
                limitUpdateKind: UpdateKind.update),
            result: [
              TableUpdate('InstructionsAssets', kind: UpdateKind.update),
            ],
          ),
        ],
      );
}

class OpenInstructionResult {
  final int id;
  final String title;
  final String shortTitle;
  final String image;
  final String description;
  final DateTime createdAt;
  final int createdBy;
  final DateTime updatedAt;
  final int updatedBy;
  final DateTime? deletedAt;
  final int? deletedBy;
  final int userId;
  final int instructionId;
  final DateTime createdAt1;
  final int createdBy1;
  final DateTime updatedAt1;
  final int updatedBy1;
  final DateTime? deletedAt1;
  final int? deletedBy1;
  final int? instructionStepId;
  final bool open;
  final String? additionalData;
  OpenInstructionResult({
    required this.id,
    required this.title,
    required this.shortTitle,
    required this.image,
    required this.description,
    required this.createdAt,
    required this.createdBy,
    required this.updatedAt,
    required this.updatedBy,
    this.deletedAt,
    this.deletedBy,
    required this.userId,
    required this.instructionId,
    required this.createdAt1,
    required this.createdBy1,
    required this.updatedAt1,
    required this.updatedBy1,
    this.deletedAt1,
    this.deletedBy1,
    this.instructionStepId,
    required this.open,
    this.additionalData,
  });
}

class HistoryEntriesOfUserAsInstructionsResult {
  final int id;
  final String title;
  final String shortTitle;
  final String image;
  final String description;
  final DateTime createdAt;
  final int createdBy;
  final DateTime updatedAt;
  final int updatedBy;
  final DateTime? deletedAt;
  final int? deletedBy;
  final int numberOfSteps;
  HistoryEntriesOfUserAsInstructionsResult({
    required this.id,
    required this.title,
    required this.shortTitle,
    required this.image,
    required this.description,
    required this.createdAt,
    required this.createdBy,
    required this.updatedAt,
    required this.updatedBy,
    this.deletedAt,
    this.deletedBy,
    required this.numberOfSteps,
  });
}

class AllInstructionsResult {
  final int id;
  final String title;
  final String shortTitle;
  final String image;
  final String description;
  final DateTime createdAt;
  final int createdBy;
  final DateTime updatedAt;
  final int updatedBy;
  final DateTime? deletedAt;
  final int? deletedBy;
  final int numberOfSteps;
  AllInstructionsResult({
    required this.id,
    required this.title,
    required this.shortTitle,
    required this.image,
    required this.description,
    required this.createdAt,
    required this.createdBy,
    required this.updatedAt,
    required this.updatedBy,
    this.deletedAt,
    this.deletedBy,
    required this.numberOfSteps,
  });
}

class AllInstructionsBySearchResult {
  final int id;
  final String title;
  final String shortTitle;
  final String image;
  final String description;
  final DateTime createdAt;
  final int createdBy;
  final DateTime updatedAt;
  final int updatedBy;
  final DateTime? deletedAt;
  final int? deletedBy;
  final int numberOfSteps;
  AllInstructionsBySearchResult({
    required this.id,
    required this.title,
    required this.shortTitle,
    required this.image,
    required this.description,
    required this.createdAt,
    required this.createdBy,
    required this.updatedAt,
    required this.updatedBy,
    this.deletedAt,
    this.deletedBy,
    required this.numberOfSteps,
  });
}

class AllInstructionsByCategoryAndSearchResult {
  final int id;
  final String title;
  final String shortTitle;
  final String image;
  final String description;
  final DateTime createdAt;
  final int createdBy;
  final DateTime updatedAt;
  final int updatedBy;
  final DateTime? deletedAt;
  final int? deletedBy;
  final int numberOfSteps;
  AllInstructionsByCategoryAndSearchResult({
    required this.id,
    required this.title,
    required this.shortTitle,
    required this.image,
    required this.description,
    required this.createdAt,
    required this.createdBy,
    required this.updatedAt,
    required this.updatedBy,
    this.deletedAt,
    this.deletedBy,
    required this.numberOfSteps,
  });
}

class AllInstructionsByCategoryResult {
  final int id;
  final String title;
  final String shortTitle;
  final String image;
  final String description;
  final DateTime createdAt;
  final int createdBy;
  final DateTime updatedAt;
  final int updatedBy;
  final DateTime? deletedAt;
  final int? deletedBy;
  final int numberOfSteps;
  AllInstructionsByCategoryResult({
    required this.id,
    required this.title,
    required this.shortTitle,
    required this.image,
    required this.description,
    required this.createdAt,
    required this.createdBy,
    required this.updatedAt,
    required this.updatedBy,
    this.deletedAt,
    this.deletedBy,
    required this.numberOfSteps,
  });
}
