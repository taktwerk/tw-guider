import 'package:drift/drift.dart';
import 'package:guider/main.dart';
import 'connection/connection.dart' as impl;

part 'localstorage.g.dart';

@DriftDatabase(tables: [], include: {'sql.drift'})
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(impl.connect());

  // MigrationStrategy get migration {
  //   return MigrationStrategy(
  //     onCreate: (Migrator m) async {
  //       await m.createAll();
  //     },
  //     onUpgrade: (Migrator m, int from, int to) async {
  //       if (from < 2) {
  //         // we added the dueDate property in the change from version 1 to
  //         // version 2
  //         await m.addColumn(instruction, todos.dueDate);
  //       }
  //       if (from < 3) {
  //         // we added the priority property in the change from version 1 or 2
  //         // to version 3
  //         await m.addColumn(todos, todos.priority);
  //       }
  //     },
  //   );
  // }

// Instruction
  Future<List<Instruction>> get allInstructionEntries =>
      select(instructions).get();

  Future<int> createOrUpdateInstruction(InstructionsCompanion entry) =>
      into(instructions).insertOnConflictUpdate(entry);

  Future<int> addInstruction(InstructionsCompanion entry) =>
      into(instructions).insert(entry);

  Future<List<Instruction>> getInstructionBySearch(String substring) =>
      (select(instructions)
            ..where((t) =>
                ((t.title.lower()).contains(substring.toLowerCase()) |
                    (t.shortTitle.lower()).contains(substring.toLowerCase()))))
          .get();

  Future<List<Instruction>> getInstructionByCategory(int searchByCategoryId) {
    final query = select(instructions).join([
      innerJoin(instructionsCategories,
          instructions.id.equalsExp(instructionsCategories.instructionId),
          useColumns: false)
    ])
      ..where((instructionsCategories.categoryId).equals(searchByCategoryId));
    return query.map((row) => row.readTable(instructions)).get();
  }

// InstructionStep
  Future<List<InstructionStep>> get allInstructionStepEntries =>
      select(instructionSteps).get();

  Future<int> createOrUpdateInstructionStep(InstructionStepsCompanion entry) =>
      into(instructionSteps).insertOnConflictUpdate(entry);

  Future<List<InstructionStep>> getInstructionStepsByInstructionId(
          int instructionId) =>
      (select(instructionSteps)
            ..where((step) => ((step.instructionId).equals(instructionId)))
            ..orderBy([(t) => OrderingTerm(expression: t.stepNr)]))
          .get();

  // Category
  Future<List<Category>> get allCategoryEntries => select(categories).get();

  Future<int> createOrUpdateCategory(CategoriesCompanion entry) =>
      into(categories).insertOnConflictUpdate(entry);

  Future<List<Category>> getCategoriesOfInstruction(int givenInstructionId) {
    final query = select(categories).join([
      innerJoin(instructionsCategories,
          categories.id.equalsExp(instructionsCategories.categoryId),
          useColumns: false)
    ])
      ..where(
          (instructionsCategories.instructionId).equals(givenInstructionId));
    return query.map((row) => row.readTable(categories)).get();
  }

  // History
  Future<List<History>> get allHistoryEntries => select(histories).get();

  Future<int> createOrUpdateHistory(HistoriesCompanion entry) =>
      into(histories).insertOnConflictUpdate(entry);

  Future<List<Instruction>> getUserHistoryAsInstructions(int givenUserId) {
    final query = select(instructions).join([
      innerJoin(histories, instructions.id.equalsExp(histories.instructionId),
          useColumns: false)
    ])
      ..orderBy([OrderingTerm.desc(histories.updatedAt)])
      ..where((histories.userId).equals(givenUserId));
    return query.map((row) => row.readTable(instructions)).get();
  }

  Future<List<History>> getUserHistory(int givenUserId) =>
      (select(histories)..where((t) => t.userId.equals(givenUserId))).get();

  // Instruction-Category
  Future<List<InstructionCategory>> get allInstructionCategoryEntries =>
      select(instructionsCategories).get();

  Future<int> createOrUpdateInstructionCategory(
          InstructionsCategoriesCompanion entry) =>
      into(instructionsCategories).insertOnConflictUpdate(entry);

  // Feedback
  Future<List<Feedback>> get allFeedbackEntries => select(feedback).get();

  Future<List<Feedback>> get notSyncedFeedbackEntries =>
      (select(feedback)..where((t) => t.isSynced.equals(false))).get();

  Future<int> createOrUpdateFeedback(FeedbackCompanion entry) =>
      into(feedback).insertOnConflictUpdate(entry);

  Future<int> insertFeedback(FeedbackCompanion entry) =>
      into(feedback).insert(entry);

  Future<int> updateFeedback(Feedback entry) =>
      (update(feedback)..where((t) => t.id.equals(entry.id))).write(
          FeedbackCompanion(
              isSynced: const Value(true),
              updatedAt: Value(DateTime.now()),
              updatedBy: Value(currentUser)));

  // Users
  Future<int> createOrUpdateUser(UsersCompanion entry) =>
      into(users).insertOnConflictUpdate(entry);

  // Settings
  Future<int> createOrUpdateSetting(SettingsCompanion entry) =>
      into(settings).insertOnConflictUpdate(entry);

  @override
  int get schemaVersion => 1;
}
