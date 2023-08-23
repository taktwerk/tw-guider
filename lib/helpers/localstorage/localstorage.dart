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

// TABLE: Instruction
  Stream<List<Instruction>> get allInstructionEntries => (select(instructions)
        ..orderBy([(t) => OrderingTerm(expression: t.id)])
        ..where((t) => t.deletedAt.isNull()))
      .watch();

  Future<void> insertMultipleInstructions(
      List<Insertable<Instruction>> list) async {
    await batch((batch) {
      batch.insertAllOnConflictUpdate(instructions, list);
    });
  }

  Stream<List<Instruction>> getInstructionBySearch(String substring) =>
      (select(instructions)
            ..where((t) =>
                ((t.title.lower()).contains(substring.toLowerCase()) |
                    (t.shortTitle.lower()).contains(substring.toLowerCase())))
            ..where((t) => t.deletedAt.isNull()))
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
    final query = (select(instructions)
          ..where((t) => instructions.deletedAt.isNull()))
        .join([
      innerJoin(instructionsCategories,
          instructions.id.equalsExp(instructionsCategories.instructionId),
          useColumns: false)
    ])
      ..where((instructionsCategories.categoryId).equals(searchByCategoryId))
      ..where(((instructions.title).contains(substring.toLowerCase()) |
          (instructions.shortTitle.lower()).contains(substring.toLowerCase())))
      ..where(instructionsCategories.deletedAt.isNull());
    return query.map((row) => row.readTable(instructions)).watch();
  }

  Stream<List<Instruction>> getInstructionByCategory(int searchByCategoryId) {
    final query = (select(instructions)..where((t) => t.deletedAt.isNull()))
        .join([
      innerJoin(instructionsCategories,
          instructions.id.equalsExp(instructionsCategories.instructionId),
          useColumns: false)
    ])
      ..where((instructionsCategories.categoryId).equals(searchByCategoryId))
      ..where(instructionsCategories.deletedAt.isNull());
    return query.map((row) => row.readTable(instructions)).watch();
  }

  Stream<Instruction> getInstructionById(int id) =>
      (select(instructions)..where((t) => t.id.equals(id))).watchSingle();

  // TABLE: InstructionStep
  Future<void> insertMultipleInstructionSteps(
      List<Insertable<InstructionStep>> list) async {
    await batch((batch) {
      batch.insertAllOnConflictUpdate(instructionSteps, list);
    });
  }

  Stream<List<InstructionStep>> getInstructionStepsByInstructionId(
          int instructionId) =>
      (select(instructionSteps)
            ..where((step) => ((step.instructionId).equals(instructionId)))
            ..orderBy([(t) => OrderingTerm(expression: t.stepNr)])
            ..where((t) => t.deletedAt.isNull()))
          .watch();

  Stream<InstructionStep> getLastVisitedStep(
      {required int instructionId, required int userId}) {
    final query = select(instructionSteps).join([
      innerJoin(
          histories, instructionSteps.id.equalsExp(histories.instructionStepId),
          useColumns: false)
    ])
      ..where((histories.userId).equals(userId))
      ..where((histories.instructionId).equals(instructionId));
    return query.map((t) => t.readTable(instructionSteps)).watchSingle();
  }

  // TABLE: Category
  Stream<List<Category>> get allCategoryEntries =>
      (select(categories)..where((t) => t.deletedAt.isNull())).watch();

  Future<void> insertMultipleCategories(List<Insertable<Category>> list) async {
    await batch((batch) {
      batch.insertAllOnConflictUpdate(categories, list);
    });
  }

  Future<List<Category>> getCategoriesOfInstruction(int givenInstructionId) {
    final query = (select(categories)..where((t) => t.deletedAt.isNull()))
        .join([
      innerJoin(instructionsCategories,
          categories.id.equalsExp(instructionsCategories.categoryId),
          useColumns: false)
    ])
      ..where((instructionsCategories.instructionId).equals(givenInstructionId))
      ..where(instructionsCategories.deletedAt.isNull());
    return query.map((row) => row.readTable(categories)).get();
  }

  // TABLE: History
  // NOTE: change to batch once I figure out how to to insertAll with the custom onConflict
  Future<int> createOrUpdateHistory(HistoriesCompanion entry) =>
      into(histories).insert(entry,
          onConflict: DoUpdate.withExcluded((old, excluded) => entry,
              where: (old, excluded) =>
                  old.updatedAt.isSmallerThan(excluded.updatedAt)));

  Stream<List<Instruction>> getUserHistoryAsInstructions(int givenUserId) {
    final query =
        (select(instructions)..where((t) => t.deletedAt.isNull())).join([
      innerJoin(histories, instructions.id.equalsExp(histories.instructionId),
          useColumns: false)
    ])
          ..orderBy([OrderingTerm.desc(histories.updatedAt)])
          ..where((histories.userId).equals(givenUserId));
    return query.map((row) => row.readTable(instructions)).watch();
  }

  Future<int> setNewStep(
          {required int userId,
          required int instructionId,
          required int instructionStepId}) =>
      (update(histories)
            ..where((t) => t.instructionId.equals(instructionId))
            ..where((t) => t.userId.equals(userId)))
          .write(HistoriesCompanion(
              instructionStepId: Value(instructionStepId),
              updatedAt: Value(DateTime.now().toUtc())));

  Future<List<History>> notSyncedHistoryEntries(DateTime timestamp) {
    return (select(histories)
          ..where((t) => t.updatedAt.isBiggerThanValue(timestamp)))
        .get();
  }

  // TABLE: Instruction_Category
  Future<void> insertMultipleInstructionCategories(
      List<Insertable<InstructionCategory>> list) async {
    await batch((batch) {
      batch.insertAllOnConflictUpdate(instructionsCategories, list);
    });
  }

  // TABLE: Feedback
  Future<List<Feedback>> get notSyncedFeedbackEntries =>
      (select(feedback)..where((t) => t.isSynced.equals(false))).get();

  // NOTE: change to batch once I figure out how to to insertAll with the custom onConflict
  Future<int> createOrUpdateFeedback(FeedbackCompanion entry) =>
      into(feedback).insert(entry,
          onConflict: DoUpdate.withExcluded((old, excluded) => entry,
              where: (old, excluded) =>
                  old.updatedAt.isSmallerThan(excluded.updatedAt)));

  Future<int> insertFeedback(FeedbackCompanion entry) =>
      into(feedback).insert(entry);

  Future<int> updateFeedbackAfterSync(Feedback entry) =>
      (update(feedback)..where((t) => t.id.equals(entry.id))).write(
          FeedbackCompanion(
              isSynced: const Value(true),
              updatedAt: Value(DateTime.now().toUtc()),
              updatedBy: Value(currentUser!)));

  Future<int> updateFeedbackWithImageURL(
          {required String url, required String id}) =>
      (update(feedback)..where((t) => t.id.equals(id)))
          .write(FeedbackCompanion(image: Value(url)));

  // TABLE: Bytes
  Future<List<Byte>> get allBytesEntries => select(bytes).get();

  Future<int> insertFeedbackImageBytes(BytesCompanion entry) =>
      into(bytes).insert(entry);

  Future deleteBytesEntry(String id) =>
      (delete(bytes)..where((t) => t.feedbackId.equals(id))).go();

  // TABLE: Users
  Future<List<User>> get allUserEntries =>
      (select(users)..where((t) => t.deletedAt.isNull())).get();

  Future<void> insertMultipleUsers(List<Insertable<User>> list) async {
    await batch((batch) {
      batch.insertAllOnConflictUpdate(users, list);
    });
  }

  Future<List<User>> getUserSortedById() => (select(users)
        ..where((t) => t.deletedAt.isNull())
        ..orderBy([(t) => OrderingTerm(expression: t.id)]))
      .get();

  // TABLE: Settings
  // NOTE: change to batch once I figure out how to to insertAll with the custom onConflict
  Future<int> createOrUpdateSetting(SettingsCompanion entry) =>
      into(settings).insert(entry,
          onConflict: DoUpdate.withExcluded((old, excluded) => entry,
              where: (old, excluded) =>
                  old.updatedAt.isSmallerThan(excluded.updatedAt)));

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
