import 'package:drift/drift.dart';
import 'connection/connection.dart' as impl;

part 'localstorage.g.dart';

class Instructions extends Table {
  IntColumn get id => integer().autoIncrement()();

  TextColumn get title => text()();

  TextColumn get shortTitle => text()();

  TextColumn get image => text()();

  TextColumn get description => text()();

  DateTimeColumn get updatedAt =>
      dateTime().withDefault(Constant(DateTime.now()))();
}

class InstructionSteps extends Table {
  IntColumn get id => integer()();

  IntColumn get instructionId => integer().references(Instructions, #id,
      onDelete: KeyAction.cascade, onUpdate: KeyAction.cascade)();

  TextColumn get title => text()();

  DateTimeColumn get createdAt => dateTime()();
}

@DriftDatabase(tables: [Instructions, InstructionSteps])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(impl.connect());

  Future<List<Instruction>> get allInstructionEntries =>
      select(instructions).get();

  Future<int> addInstruction(InstructionsCompanion entry) =>
      into(instructions).insert(entry);

  @override
  int get schemaVersion => 1;
}
