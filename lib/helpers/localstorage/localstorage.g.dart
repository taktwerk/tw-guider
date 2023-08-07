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

class FeedbackTable extends Table with TableInfo<FeedbackTable, Feedback> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  FeedbackTable(this.attachedDatabase, [this._alias]);
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
  static const VerificationMeta _userIdMeta = const VerificationMeta('userId');
  late final GeneratedColumn<int> userId = GeneratedColumn<int>(
      'user_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _feedbackTextMeta =
      const VerificationMeta('feedbackText');
  late final GeneratedColumn<String> feedbackText = GeneratedColumn<String>(
      'feedback_text', aliasedName, false,
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
  @override
  List<GeneratedColumn> get $columns =>
      [id, instructionId, userId, feedbackText, image, createdAt];
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
    if (data.containsKey('feedback_text')) {
      context.handle(
          _feedbackTextMeta,
          feedbackText.isAcceptableOrUnknown(
              data['feedback_text']!, _feedbackTextMeta));
    } else if (isInserting) {
      context.missing(_feedbackTextMeta);
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
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Feedback map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Feedback(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      instructionId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}instruction_id'])!,
      userId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}user_id'])!,
      feedbackText: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}feedback_text'])!,
      image: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}image']),
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
    );
  }

  @override
  FeedbackTable createAlias(String alias) {
    return FeedbackTable(attachedDatabase, alias);
  }

  @override
  List<String> get customConstraints =>
      const ['CONSTRAINT feedback_pkey PRIMARY KEY(id)'];
  @override
  bool get dontWriteConstraints => true;
}

class Feedback extends DataClass implements Insertable<Feedback> {
  final int id;
  final int instructionId;
  final int userId;
  final String feedbackText;
  final String? image;
  final DateTime createdAt;
  const Feedback(
      {required this.id,
      required this.instructionId,
      required this.userId,
      required this.feedbackText,
      this.image,
      required this.createdAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['instruction_id'] = Variable<int>(instructionId);
    map['user_id'] = Variable<int>(userId);
    map['feedback_text'] = Variable<String>(feedbackText);
    if (!nullToAbsent || image != null) {
      map['image'] = Variable<String>(image);
    }
    map['created_at'] = Variable<DateTime>(createdAt);
    return map;
  }

  FeedbackCompanion toCompanion(bool nullToAbsent) {
    return FeedbackCompanion(
      id: Value(id),
      instructionId: Value(instructionId),
      userId: Value(userId),
      feedbackText: Value(feedbackText),
      image:
          image == null && nullToAbsent ? const Value.absent() : Value(image),
      createdAt: Value(createdAt),
    );
  }

  factory Feedback.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Feedback(
      id: serializer.fromJson<int>(json['id']),
      instructionId: serializer.fromJson<int>(json['instruction_id']),
      userId: serializer.fromJson<int>(json['user_id']),
      feedbackText: serializer.fromJson<String>(json['feedback_text']),
      image: serializer.fromJson<String?>(json['image']),
      createdAt: serializer.fromJson<DateTime>(json['created_at']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'instruction_id': serializer.toJson<int>(instructionId),
      'user_id': serializer.toJson<int>(userId),
      'feedback_text': serializer.toJson<String>(feedbackText),
      'image': serializer.toJson<String?>(image),
      'created_at': serializer.toJson<DateTime>(createdAt),
    };
  }

  Feedback copyWith(
          {int? id,
          int? instructionId,
          int? userId,
          String? feedbackText,
          Value<String?> image = const Value.absent(),
          DateTime? createdAt}) =>
      Feedback(
        id: id ?? this.id,
        instructionId: instructionId ?? this.instructionId,
        userId: userId ?? this.userId,
        feedbackText: feedbackText ?? this.feedbackText,
        image: image.present ? image.value : this.image,
        createdAt: createdAt ?? this.createdAt,
      );
  @override
  String toString() {
    return (StringBuffer('Feedback(')
          ..write('id: $id, ')
          ..write('instructionId: $instructionId, ')
          ..write('userId: $userId, ')
          ..write('feedbackText: $feedbackText, ')
          ..write('image: $image, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, instructionId, userId, feedbackText, image, createdAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Feedback &&
          other.id == this.id &&
          other.instructionId == this.instructionId &&
          other.userId == this.userId &&
          other.feedbackText == this.feedbackText &&
          other.image == this.image &&
          other.createdAt == this.createdAt);
}

class FeedbackCompanion extends UpdateCompanion<Feedback> {
  final Value<int> id;
  final Value<int> instructionId;
  final Value<int> userId;
  final Value<String> feedbackText;
  final Value<String?> image;
  final Value<DateTime> createdAt;
  const FeedbackCompanion({
    this.id = const Value.absent(),
    this.instructionId = const Value.absent(),
    this.userId = const Value.absent(),
    this.feedbackText = const Value.absent(),
    this.image = const Value.absent(),
    this.createdAt = const Value.absent(),
  });
  FeedbackCompanion.insert({
    this.id = const Value.absent(),
    required int instructionId,
    required int userId,
    required String feedbackText,
    this.image = const Value.absent(),
    required DateTime createdAt,
  })  : instructionId = Value(instructionId),
        userId = Value(userId),
        feedbackText = Value(feedbackText),
        createdAt = Value(createdAt);
  static Insertable<Feedback> custom({
    Expression<int>? id,
    Expression<int>? instructionId,
    Expression<int>? userId,
    Expression<String>? feedbackText,
    Expression<String>? image,
    Expression<DateTime>? createdAt,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (instructionId != null) 'instruction_id': instructionId,
      if (userId != null) 'user_id': userId,
      if (feedbackText != null) 'feedback_text': feedbackText,
      if (image != null) 'image': image,
      if (createdAt != null) 'created_at': createdAt,
    });
  }

  FeedbackCompanion copyWith(
      {Value<int>? id,
      Value<int>? instructionId,
      Value<int>? userId,
      Value<String>? feedbackText,
      Value<String?>? image,
      Value<DateTime>? createdAt}) {
    return FeedbackCompanion(
      id: id ?? this.id,
      instructionId: instructionId ?? this.instructionId,
      userId: userId ?? this.userId,
      feedbackText: feedbackText ?? this.feedbackText,
      image: image ?? this.image,
      createdAt: createdAt ?? this.createdAt,
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
    if (userId.present) {
      map['user_id'] = Variable<int>(userId.value);
    }
    if (feedbackText.present) {
      map['feedback_text'] = Variable<String>(feedbackText.value);
    }
    if (image.present) {
      map['image'] = Variable<String>(image.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('FeedbackCompanion(')
          ..write('id: $id, ')
          ..write('instructionId: $instructionId, ')
          ..write('userId: $userId, ')
          ..write('feedbackText: $feedbackText, ')
          ..write('image: $image, ')
          ..write('createdAt: $createdAt')
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
  late final GeneratedColumn<Uint8List> username = GeneratedColumn<Uint8List>(
      'username', aliasedName, false,
      type: DriftSqlType.blob,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _roleMeta = const VerificationMeta('role');
  late final GeneratedColumn<Uint8List> role = GeneratedColumn<Uint8List>(
      'role', aliasedName, false,
      type: DriftSqlType.blob,
      requiredDuringInsert: true,
      $customConstraints: 'NOT NULL');
  static const VerificationMeta _lastOnlineMeta =
      const VerificationMeta('lastOnline');
  late final GeneratedColumn<DateTime> lastOnline = GeneratedColumn<DateTime>(
      'last_online', aliasedName, false,
      type: DriftSqlType.dateTime,
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
        lastOnline,
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
    if (data.containsKey('last_online')) {
      context.handle(
          _lastOnlineMeta,
          lastOnline.isAcceptableOrUnknown(
              data['last_online']!, _lastOnlineMeta));
    } else if (isInserting) {
      context.missing(_lastOnlineMeta);
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
          .read(DriftSqlType.blob, data['${effectivePrefix}username'])!,
      role: attachedDatabase.typeMapping
          .read(DriftSqlType.blob, data['${effectivePrefix}role'])!,
      lastOnline: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}last_online'])!,
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
  final Uint8List username;
  final Uint8List role;
  final DateTime lastOnline;
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
      required this.lastOnline,
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
    map['username'] = Variable<Uint8List>(username);
    map['role'] = Variable<Uint8List>(role);
    map['last_online'] = Variable<DateTime>(lastOnline);
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
      lastOnline: Value(lastOnline),
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
      username: serializer.fromJson<Uint8List>(json['username']),
      role: serializer.fromJson<Uint8List>(json['role']),
      lastOnline: serializer.fromJson<DateTime>(json['last_online']),
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
      'username': serializer.toJson<Uint8List>(username),
      'role': serializer.toJson<Uint8List>(role),
      'last_online': serializer.toJson<DateTime>(lastOnline),
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
          Uint8List? username,
          Uint8List? role,
          DateTime? lastOnline,
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
        lastOnline: lastOnline ?? this.lastOnline,
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
          ..write('lastOnline: $lastOnline, ')
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
  int get hashCode => Object.hash(
      id,
      $driftBlobEquality.hash(username),
      $driftBlobEquality.hash(role),
      lastOnline,
      createdAt,
      createdBy,
      updatedAt,
      updatedBy,
      deletedAt,
      deletedBy);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is User &&
          other.id == this.id &&
          $driftBlobEquality.equals(other.username, this.username) &&
          $driftBlobEquality.equals(other.role, this.role) &&
          other.lastOnline == this.lastOnline &&
          other.createdAt == this.createdAt &&
          other.createdBy == this.createdBy &&
          other.updatedAt == this.updatedAt &&
          other.updatedBy == this.updatedBy &&
          other.deletedAt == this.deletedAt &&
          other.deletedBy == this.deletedBy);
}

class UsersCompanion extends UpdateCompanion<User> {
  final Value<int> id;
  final Value<Uint8List> username;
  final Value<Uint8List> role;
  final Value<DateTime> lastOnline;
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
    this.lastOnline = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.createdBy = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.updatedBy = const Value.absent(),
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
  });
  UsersCompanion.insert({
    this.id = const Value.absent(),
    required Uint8List username,
    required Uint8List role,
    required DateTime lastOnline,
    required DateTime createdAt,
    required int createdBy,
    required DateTime updatedAt,
    required int updatedBy,
    this.deletedAt = const Value.absent(),
    this.deletedBy = const Value.absent(),
  })  : username = Value(username),
        role = Value(role),
        lastOnline = Value(lastOnline),
        createdAt = Value(createdAt),
        createdBy = Value(createdBy),
        updatedAt = Value(updatedAt),
        updatedBy = Value(updatedBy);
  static Insertable<User> custom({
    Expression<int>? id,
    Expression<Uint8List>? username,
    Expression<Uint8List>? role,
    Expression<DateTime>? lastOnline,
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
      if (lastOnline != null) 'last_online': lastOnline,
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
      Value<Uint8List>? username,
      Value<Uint8List>? role,
      Value<DateTime>? lastOnline,
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
      lastOnline: lastOnline ?? this.lastOnline,
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
      map['username'] = Variable<Uint8List>(username.value);
    }
    if (role.present) {
      map['role'] = Variable<Uint8List>(role.value);
    }
    if (lastOnline.present) {
      map['last_online'] = Variable<DateTime>(lastOnline.value);
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
          ..write('lastOnline: $lastOnline, ')
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
        instructionStepId
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
  const History(
      {required this.userId,
      required this.instructionId,
      required this.createdAt,
      required this.createdBy,
      required this.updatedAt,
      required this.updatedBy,
      this.deletedAt,
      this.deletedBy,
      this.instructionStepId});
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
          Value<int?> instructionStepId = const Value.absent()}) =>
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
          ..write('instructionStepId: $instructionStepId')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(userId, instructionId, createdAt, createdBy,
      updatedAt, updatedBy, deletedAt, deletedBy, instructionStepId);
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
          other.instructionStepId == this.instructionStepId);
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
    this.rowid = const Value.absent(),
  })  : userId = Value(userId),
        instructionId = Value(instructionId),
        createdAt = Value(createdAt),
        createdBy = Value(createdBy),
        updatedAt = Value(updatedAt),
        updatedBy = Value(updatedBy);
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

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  late final Categories categories = Categories(this);
  late final Instructions instructions = Instructions(this);
  late final FeedbackTable feedback = FeedbackTable(this);
  late final InstructionSteps instructionSteps = InstructionSteps(this);
  late final Users users = Users(this);
  late final Histories histories = Histories(this);
  late final InstructionsCategories instructionsCategories =
      InstructionsCategories(this);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [
        categories,
        instructions,
        feedback,
        instructionSteps,
        users,
        histories,
        instructionsCategories
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
        ],
      );
}
