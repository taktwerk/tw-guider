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
  Stream<List<Instruction>> get allInstructionEntries =>
      (select(instructions)..orderBy([(t) => OrderingTerm(expression: t.id)]))
          .watch();

  Future<int> updateInstruction(String title, int id) =>
      (update(instructions)..where((t) => t.id.equals(id)))
          .write(InstructionsCompanion(title: Value(title)));

  Future<int> createOrUpdateInstruction(InstructionsCompanion entry) =>
      into(instructions).insertOnConflictUpdate(entry);

  Future<int> addInstruction(InstructionsCompanion entry) =>
      into(instructions).insert(entry);

  Stream<List<Instruction>> getInstructionBySearch(String substring) =>
      (select(instructions)
            ..where((t) =>
                ((t.title.lower()).contains(substring.toLowerCase()) |
                    (t.shortTitle.lower()).contains(substring.toLowerCase()))))
          .watch();

  Stream<List<Instruction>> combineCategoryAndSearch(
      int searchByCategoryId, String substring) {
    if (searchByCategoryId == -1 && substring.isEmpty) {
      return allInstructionEntries;
    } else if (searchByCategoryId == -1 && substring.isNotEmpty) {
      return getInstructionBySearch(substring);
    } else if (searchByCategoryId != -1 && substring.isEmpty) {
      return getInstructionByCategory(searchByCategoryId);
    } else {
      return getInstructionByCategoryAndSearch(searchByCategoryId, substring);
    }
  }

  Stream<List<Instruction>> getInstructionByCategoryAndSearch(
      int searchByCategoryId, String substring) {
    final query = select(instructions).join([
      innerJoin(instructionsCategories,
          instructions.id.equalsExp(instructionsCategories.instructionId),
          useColumns: false)
    ])
      ..where((instructionsCategories.categoryId).equals(searchByCategoryId))
      ..where(((instructions.title).contains(substring.toLowerCase()) |
          (instructions.shortTitle.lower()).contains(substring.toLowerCase())));
    return query.map((row) => row.readTable(instructions)).watch();
  }

  Stream<List<Instruction>> getInstructionByCategory(int searchByCategoryId) {
    final query = select(instructions).join([
      innerJoin(instructionsCategories,
          instructions.id.equalsExp(instructionsCategories.instructionId),
          useColumns: false)
    ])
      ..where((instructionsCategories.categoryId).equals(searchByCategoryId));
    return query.map((row) => row.readTable(instructions)).watch();
  }

  Future<Instruction> getInstructionById(int id) =>
      (select(instructions)..where((t) => t.id.equals(id))).getSingle();

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

  Future<InstructionStep> getLastVisitedStep(
      {required int instructionId, required int userId}) {
    final query = select(instructionSteps).join([
      innerJoin(
          histories, instructionSteps.id.equalsExp(histories.instructionStepId),
          useColumns: false)
    ])
      ..where((histories.userId).equals(userId))
      ..where((histories.instructionId).equals(instructionId));
    return query.map((t) => t.readTable(instructionSteps)).getSingle();
  }

  // Category
  Stream<List<Category>> get allCategoryEntries => select(categories).watch();

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

  Stream<List<Instruction>> getUserHistoryAsInstructions(int givenUserId) {
    final query = select(instructions).join([
      innerJoin(histories, instructions.id.equalsExp(histories.instructionId),
          useColumns: false)
    ])
      ..orderBy([OrderingTerm.desc(histories.updatedAt)])
      ..where((histories.userId).equals(givenUserId));
    return query.map((row) => row.readTable(instructions)).watch();
  }

  Future<List<History>> getUserHistory(int givenUserId) =>
      (select(histories)..where((t) => t.userId.equals(givenUserId))).get();

  Future<int> setNewStep(
          {required int userId,
          required int instructionId,
          required int instructionStepId}) =>
      (update(histories)
            ..where((t) => t.instructionId.equals(instructionId))
            ..where((t) => t.userId.equals(userId)))
          .write(
              HistoriesCompanion(instructionStepId: Value(instructionStepId)));

  Future<List<History>> notSyncedHistoryEntries(DateTime timestamp) {
    return (select(histories)
          ..where((t) => t.updatedAt.isBiggerThanValue(timestamp)))
        .get();
  }

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
              updatedAt: Value(DateTime.now().toUtc()),
              updatedBy: Value(currentUser!)));

  // Users
  Future<List<User>> get allUserEntries => select(users).get();

  Future<int> createOrUpdateUser(UsersCompanion entry) =>
      into(users).insertOnConflictUpdate(entry);

  Future<List<User>> getUserSortedById() =>
      (select(users)..orderBy([(t) => OrderingTerm(expression: t.id)])).get();

  // Settings
  Future<int> createOrUpdateSetting(SettingsCompanion entry) =>
      into(settings).insertOnConflictUpdate(entry);

  Future<List<Setting>> get allSettings => select(settings).get();

  Future<int> updateUserSettings(int userId, String language) =>
      (update(settings)..where((t) => t.userId.equals(userId))).write(
          SettingsCompanion(
              language: Value(language),
              updatedAt: Value(DateTime.now().toUtc()),
              updatedBy: Value(currentUser!)));

  Stream<List<Setting>> getSettings(int userId) =>
      (select(settings)..where((t) => t.userId.equals(userId))).watch();

  Future<List<Setting>> notSyncedSettingsEntries(DateTime timestamp) {
    return (select(settings)
          ..where((t) => t.updatedAt.isBiggerThanValue(timestamp)))
        .get();
  }

  @override
  int get schemaVersion => 1;
}
