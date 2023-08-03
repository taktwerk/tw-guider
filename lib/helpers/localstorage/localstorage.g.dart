// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'localstorage.dart';

// ignore_for_file: type=lint
class $InstructionsTable extends Instructions
    with TableInfo<$InstructionsTable, Instruction> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $InstructionsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _titleMeta = const VerificationMeta('title');
  @override
  late final GeneratedColumn<String> title = GeneratedColumn<String>(
      'title', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _shortTitleMeta =
      const VerificationMeta('shortTitle');
  @override
  late final GeneratedColumn<String> shortTitle = GeneratedColumn<String>(
      'short_title', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _imageMeta = const VerificationMeta('image');
  @override
  late final GeneratedColumn<String> image = GeneratedColumn<String>(
      'image', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _descriptionMeta =
      const VerificationMeta('description');
  @override
  late final GeneratedColumn<String> description = GeneratedColumn<String>(
      'description', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  @override
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: Constant(DateTime.now()));
  @override
  List<GeneratedColumn> get $columns =>
      [id, title, shortTitle, image, description, updatedAt];
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
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
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
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}updated_at'])!,
    );
  }

  @override
  $InstructionsTable createAlias(String alias) {
    return $InstructionsTable(attachedDatabase, alias);
  }
}

class Instruction extends DataClass implements Insertable<Instruction> {
  final int id;
  final String title;
  final String shortTitle;
  final String image;
  final String description;
  final DateTime updatedAt;
  const Instruction(
      {required this.id,
      required this.title,
      required this.shortTitle,
      required this.image,
      required this.description,
      required this.updatedAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['title'] = Variable<String>(title);
    map['short_title'] = Variable<String>(shortTitle);
    map['image'] = Variable<String>(image);
    map['description'] = Variable<String>(description);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    return map;
  }

  InstructionsCompanion toCompanion(bool nullToAbsent) {
    return InstructionsCompanion(
      id: Value(id),
      title: Value(title),
      shortTitle: Value(shortTitle),
      image: Value(image),
      description: Value(description),
      updatedAt: Value(updatedAt),
    );
  }

  factory Instruction.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Instruction(
      id: serializer.fromJson<int>(json['id']),
      title: serializer.fromJson<String>(json['title']),
      shortTitle: serializer.fromJson<String>(json['shortTitle']),
      image: serializer.fromJson<String>(json['image']),
      description: serializer.fromJson<String>(json['description']),
      updatedAt: serializer.fromJson<DateTime>(json['updatedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'title': serializer.toJson<String>(title),
      'shortTitle': serializer.toJson<String>(shortTitle),
      'image': serializer.toJson<String>(image),
      'description': serializer.toJson<String>(description),
      'updatedAt': serializer.toJson<DateTime>(updatedAt),
    };
  }

  Instruction copyWith(
          {int? id,
          String? title,
          String? shortTitle,
          String? image,
          String? description,
          DateTime? updatedAt}) =>
      Instruction(
        id: id ?? this.id,
        title: title ?? this.title,
        shortTitle: shortTitle ?? this.shortTitle,
        image: image ?? this.image,
        description: description ?? this.description,
        updatedAt: updatedAt ?? this.updatedAt,
      );
  @override
  String toString() {
    return (StringBuffer('Instruction(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('shortTitle: $shortTitle, ')
          ..write('image: $image, ')
          ..write('description: $description, ')
          ..write('updatedAt: $updatedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, title, shortTitle, image, description, updatedAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Instruction &&
          other.id == this.id &&
          other.title == this.title &&
          other.shortTitle == this.shortTitle &&
          other.image == this.image &&
          other.description == this.description &&
          other.updatedAt == this.updatedAt);
}

class InstructionsCompanion extends UpdateCompanion<Instruction> {
  final Value<int> id;
  final Value<String> title;
  final Value<String> shortTitle;
  final Value<String> image;
  final Value<String> description;
  final Value<DateTime> updatedAt;
  const InstructionsCompanion({
    this.id = const Value.absent(),
    this.title = const Value.absent(),
    this.shortTitle = const Value.absent(),
    this.image = const Value.absent(),
    this.description = const Value.absent(),
    this.updatedAt = const Value.absent(),
  });
  InstructionsCompanion.insert({
    this.id = const Value.absent(),
    required String title,
    required String shortTitle,
    required String image,
    required String description,
    this.updatedAt = const Value.absent(),
  })  : title = Value(title),
        shortTitle = Value(shortTitle),
        image = Value(image),
        description = Value(description);
  static Insertable<Instruction> custom({
    Expression<int>? id,
    Expression<String>? title,
    Expression<String>? shortTitle,
    Expression<String>? image,
    Expression<String>? description,
    Expression<DateTime>? updatedAt,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (title != null) 'title': title,
      if (shortTitle != null) 'short_title': shortTitle,
      if (image != null) 'image': image,
      if (description != null) 'description': description,
      if (updatedAt != null) 'updated_at': updatedAt,
    });
  }

  InstructionsCompanion copyWith(
      {Value<int>? id,
      Value<String>? title,
      Value<String>? shortTitle,
      Value<String>? image,
      Value<String>? description,
      Value<DateTime>? updatedAt}) {
    return InstructionsCompanion(
      id: id ?? this.id,
      title: title ?? this.title,
      shortTitle: shortTitle ?? this.shortTitle,
      image: image ?? this.image,
      description: description ?? this.description,
      updatedAt: updatedAt ?? this.updatedAt,
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
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
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
          ..write('updatedAt: $updatedAt')
          ..write(')'))
        .toString();
  }
}

class $InstructionStepsTable extends InstructionSteps
    with TableInfo<$InstructionStepsTable, InstructionStep> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $InstructionStepsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _instructionIdMeta =
      const VerificationMeta('instructionId');
  @override
  late final GeneratedColumn<int> instructionId = GeneratedColumn<int>(
      'instruction_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      defaultConstraints: GeneratedColumn.constraintIsAlways(
          'REFERENCES instructions (id) ON UPDATE CASCADE ON DELETE CASCADE'));
  static const VerificationMeta _titleMeta = const VerificationMeta('title');
  @override
  late final GeneratedColumn<String> title = GeneratedColumn<String>(
      'title', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  @override
  List<GeneratedColumn> get $columns => [id, instructionId, title];
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
    if (data.containsKey('title')) {
      context.handle(
          _titleMeta, title.isAcceptableOrUnknown(data['title']!, _titleMeta));
    } else if (isInserting) {
      context.missing(_titleMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => const {};
  @override
  InstructionStep map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return InstructionStep(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      instructionId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}instruction_id'])!,
      title: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}title'])!,
    );
  }

  @override
  $InstructionStepsTable createAlias(String alias) {
    return $InstructionStepsTable(attachedDatabase, alias);
  }
}

class InstructionStep extends DataClass implements Insertable<InstructionStep> {
  final int id;
  final int instructionId;
  final String title;
  const InstructionStep(
      {required this.id, required this.instructionId, required this.title});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['instruction_id'] = Variable<int>(instructionId);
    map['title'] = Variable<String>(title);
    return map;
  }

  InstructionStepsCompanion toCompanion(bool nullToAbsent) {
    return InstructionStepsCompanion(
      id: Value(id),
      instructionId: Value(instructionId),
      title: Value(title),
    );
  }

  factory InstructionStep.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return InstructionStep(
      id: serializer.fromJson<int>(json['id']),
      instructionId: serializer.fromJson<int>(json['instructionId']),
      title: serializer.fromJson<String>(json['title']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'instructionId': serializer.toJson<int>(instructionId),
      'title': serializer.toJson<String>(title),
    };
  }

  InstructionStep copyWith({int? id, int? instructionId, String? title}) =>
      InstructionStep(
        id: id ?? this.id,
        instructionId: instructionId ?? this.instructionId,
        title: title ?? this.title,
      );
  @override
  String toString() {
    return (StringBuffer('InstructionStep(')
          ..write('id: $id, ')
          ..write('instructionId: $instructionId, ')
          ..write('title: $title')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, instructionId, title);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is InstructionStep &&
          other.id == this.id &&
          other.instructionId == this.instructionId &&
          other.title == this.title);
}

class InstructionStepsCompanion extends UpdateCompanion<InstructionStep> {
  final Value<int> id;
  final Value<int> instructionId;
  final Value<String> title;
  final Value<int> rowid;
  const InstructionStepsCompanion({
    this.id = const Value.absent(),
    this.instructionId = const Value.absent(),
    this.title = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  InstructionStepsCompanion.insert({
    required int id,
    required int instructionId,
    required String title,
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        instructionId = Value(instructionId),
        title = Value(title);
  static Insertable<InstructionStep> custom({
    Expression<int>? id,
    Expression<int>? instructionId,
    Expression<String>? title,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (instructionId != null) 'instruction_id': instructionId,
      if (title != null) 'title': title,
      if (rowid != null) 'rowid': rowid,
    });
  }

  InstructionStepsCompanion copyWith(
      {Value<int>? id,
      Value<int>? instructionId,
      Value<String>? title,
      Value<int>? rowid}) {
    return InstructionStepsCompanion(
      id: id ?? this.id,
      instructionId: instructionId ?? this.instructionId,
      title: title ?? this.title,
      rowid: rowid ?? this.rowid,
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
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('InstructionStepsCompanion(')
          ..write('id: $id, ')
          ..write('instructionId: $instructionId, ')
          ..write('title: $title, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  late final $InstructionsTable instructions = $InstructionsTable(this);
  late final $InstructionStepsTable instructionSteps =
      $InstructionStepsTable(this);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities =>
      [instructions, instructionSteps];
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
                limitUpdateKind: UpdateKind.update),
            result: [
              TableUpdate('instruction_steps', kind: UpdateKind.update),
            ],
          ),
        ],
      );
}
