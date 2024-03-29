import 'package:drift/drift.dart';
import 'package:guider/helpers/content_type_enum.dart';
import 'package:guider/main.dart';
import 'connection/connection.dart' as impl;

part 'localstorage.g.dart';

class InstructionWithCount {
  InstructionWithCount(this.instruction, this.count);

  final Instruction instruction;
  final int count;
}

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
  int getNumberOfTables() {
    return allTables.length;
  }

  Future<void> deleteEverything() async {
    await customStatement('PRAGMA foreign_keys = OFF');
    try {
      transaction(() async {
        for (final table in allTables) {
          await delete(table).go();
        }
      });
    } finally {
      await customStatement('PRAGMA foreign_keys = OFF');
    }
  }

// TABLE: Instruction
  Stream<List<InstructionWithCount>> getAllInstructions() {
    return allInstructions()
        .map((p) => InstructionWithCount(
            Instruction(
                id: p.id,
                title: p.title,
                shortTitle: p.shortTitle,
                image: p.image,
                description: p.description,
                createdAt: p.createdAt,
                createdBy: p.createdBy,
                updatedAt: p.updatedAt,
                updatedBy: p.updatedBy),
            p.numberOfSteps))
        .watch();
  }

  Future<void> insertMultipleInstructions(
      List<Insertable<Instruction>> list) async {
    await batch((batch) {
      batch.insertAllOnConflictUpdate(instructions, list);
    });
  }

  Stream<List<InstructionWithCount>> getInstructionBySearch(String searchWord) {
    return allInstructionsBySearch(searchWord)
        .map((p) => InstructionWithCount(
            Instruction(
                id: p.id,
                title: p.title,
                shortTitle: p.shortTitle,
                image: p.image,
                description: p.description,
                createdAt: p.createdAt,
                createdBy: p.createdBy,
                updatedAt: p.updatedAt,
                updatedBy: p.updatedBy),
            p.numberOfSteps))
        .watch();
  }

  Stream<List<InstructionWithCount>> combineCategoryAndSearch(
      int searchByCategoryId, String substring) {
    if (searchByCategoryId == -1 && substring.isEmpty) {
      return getAllInstructions();
    } else if (searchByCategoryId == -1 && substring.isNotEmpty) {
      return getInstructionBySearch(substring);
    } else if (searchByCategoryId != -1 && substring.isEmpty) {
      return getInstructionByCategory(searchByCategoryId);
    } else {
      return getInstructionByCategoryAndSearch(searchByCategoryId, substring);
    }
  }

  Stream<List<InstructionWithCount>> getInstructionByCategoryAndSearch(
      int categoryId, String searchWord) {
    return allInstructionsByCategoryAndSearch(categoryId, searchWord)
        .map((p) => InstructionWithCount(
            Instruction(
                id: p.id,
                title: p.title,
                shortTitle: p.shortTitle,
                image: p.image,
                description: p.description,
                createdAt: p.createdAt,
                createdBy: p.createdBy,
                updatedAt: p.updatedAt,
                updatedBy: p.updatedBy),
            p.numberOfSteps))
        .watch();
  }

  Stream<List<InstructionWithCount>> getInstructionByCategory(int categoryId) {
    return allInstructionsByCategory(categoryId)
        .map((p) => InstructionWithCount(
            Instruction(
                id: p.id,
                title: p.title,
                shortTitle: p.shortTitle,
                image: p.image,
                description: p.description,
                createdAt: p.createdAt,
                createdBy: p.createdBy,
                updatedAt: p.updatedAt,
                updatedBy: p.updatedBy),
            p.numberOfSteps))
        .watch();
  }

  Stream<List<Instruction>> getInstructionById(int id) =>
      (select(instructions)..where((t) => t.id.equals(id))).watch();

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

  Stream<List<InstructionStep>> getLastVisitedStep(
      {required int instructionId, required int userId}) {
    final query = select(instructionSteps).join([
      innerJoin(
          histories, instructionSteps.id.equalsExp(histories.instructionStepId),
          useColumns: false)
    ])
      ..where((histories.userId).equals(userId))
      ..where((histories.instructionId).equals(instructionId));
    return query.map((t) => t.readTable(instructionSteps)).watch();
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
  Future<int> createOrUpdateHistory(HistoriesCompanion entry) =>
      into(histories).insert(entry,
          onConflict: DoUpdate.withExcluded((old, excluded) => entry,
              where: (old, excluded) =>
                  old.updatedAt.isSmallerThan(excluded.updatedAt)));

  Stream<List<InstructionWithCount>> getUserHistoryAsInstructions(
      int givenUserId) {
    return historyEntriesOfUserAsInstructions(givenUserId)
        .map((p) => InstructionWithCount(
            Instruction(
                id: p.id,
                title: p.title,
                shortTitle: p.shortTitle,
                image: p.image,
                description: p.description,
                createdAt: p.createdAt,
                createdBy: p.createdBy,
                updatedAt: p.updatedAt,
                updatedBy: p.updatedBy),
            p.numberOfSteps))
        .watch();
  }

  Future<List<History>> getUserHistory(int givenUserId, int instructionId) =>
      (select(histories)
            ..where((t) => t.userId.equals(givenUserId))
            ..where((t) => t.instructionId.equals(instructionId)))
          .get();

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

  Future<List<Instruction>> getInstructionToOpen(int userId) {
    return openInstruction(userId)
        .map((p) => Instruction(
            id: p.id,
            title: p.title,
            shortTitle: p.shortTitle,
            image: p.image,
            description: p.description,
            createdAt: p.createdAt,
            createdBy: p.createdBy,
            updatedAt: p.updatedAt,
            updatedBy: p.updatedBy))
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
  Future<List<Feedback>> notSyncedFeedbackEntries(DateTime timestamp) =>
      (select(feedback)..where((t) => t.updatedAt.isBiggerThanValue(timestamp)))
          .get();

  Future<int> createOrUpdateFeedback(FeedbackCompanion entry) =>
      into(feedback).insert(entry,
          onConflict: DoUpdate.withExcluded((old, excluded) => entry,
              where: (old, excluded) =>
                  old.updatedAt.isSmallerThan(excluded.updatedAt)));

  Future<int> updateFeedback(FeedbackCompanion entry) =>
      (update(feedback)..where((t) => t.id.equals(entry.id.value)))
          .write(entry);

  Future<int> insertFeedback(FeedbackCompanion entry) =>
      into(feedback).insert(entry);

  Future<int> updateFeedbackWithImageURL(
          {required String url, required String id}) =>
      (update(feedback)..where((t) => t.id.equals(id)))
          .write(FeedbackCompanion(image: Value(url)));

  Stream<List<Feedback>> getUserFeedback(int givenUserId) =>
      getFeedbackLiked(givenUserId).watch();

  // TABLE: Bytes
  Future<List<Byte>> get allBytesEntries => select(bytes).get();

  Future<int> insertFeedbackImageBytes(BytesCompanion entry) =>
      into(bytes).insert(entry);

  Future deleteBytesEntry(String id) =>
      (delete(bytes)..where((t) => t.feedbackId.equals(id))).go();

  // TABLE: Users
  Future<List<User>> get allUserEntries =>
      (select(users)..where((t) => t.deletedAt.isNull())).get();

  Future<List<User>> userEntriesByClient(String client) =>
      (select(users)..where((t) => t.client.equals(client))).get();

  Stream<List<User>> get allUserEntriesAsStream =>
      (select(users)..where((t) => t.deletedAt.isNull())).watch();

  Future<void> insertMultipleUsers(List<Insertable<User>> list) async {
    await batch((batch) {
      batch.insertAllOnConflictUpdate(users, list);
    });
  }

  Future<List<User>> getUserSortedById() => (select(users)
        ..where((t) => t.deletedAt.isNull())
        ..orderBy([(t) => OrderingTerm(expression: t.id)]))
      .get();

  Future<List<User>> getUserById(int id) =>
      (select(users)..where((t) => t.id.equals(id))).get();

  // TABLE: Settings
  Future<int> createOrUpdateSetting(SettingsCompanion entry) =>
      into(settings).insert(entry,
          onConflict: DoUpdate.withExcluded((old, excluded) => entry,
              where: (old, excluded) =>
                  old.updatedAt.isSmallerThan(excluded.updatedAt)));

  Future<int> updateUserLanguage(int userId, String language) =>
      (update(settings)..where((t) => t.userId.equals(userId))).write(
          SettingsCompanion(
              language: Value(language),
              updatedAt: Value(DateTime.now().toUtc()),
              updatedBy: Value(currentUser!)));

  Future<int> updateUserRealtime(int userId, bool realtime) =>
      (update(settings)..where((t) => t.userId.equals(userId))).write(
          SettingsCompanion(
              realtime: Value(realtime),
              updatedAt: Value(DateTime.now().toUtc()),
              updatedBy: Value(currentUser!)));

  Future<int> updateUserLightmode(int userId, bool lightmode) =>
      (update(settings)..where((t) => t.userId.equals(userId))).write(
          SettingsCompanion(
              lightmode: Value(lightmode),
              updatedAt: Value(DateTime.now().toUtc()),
              updatedBy: Value(currentUser!)));

  Stream<List<Setting>> getSettings(int userId) =>
      (select(settings)..where((t) => t.userId.equals(userId))).watch();

  Future<List<Setting>> getRealtime(int userId) =>
      (select(settings)..where((t) => t.userId.equals(userId))).get();

  Future<List<Setting>> notSyncedSettingsEntries(DateTime timestamp) {
    return (select(settings)
          ..where((t) => t.updatedAt.isBiggerThanValue(timestamp)))
        .get();
  }

  Stream<List<bool>> areTablesSynched(
      DateTime settings, DateTime feedback, DateTime history) {
    return isSynced(settings, feedback, history).watch();
  }

  // TABLE: Assets
  Future<void> insertMultipleAssets(List<Insertable<Asset>> list) async {
    await batch((batch) {
      batch.insertAllOnConflictUpdate(assets, list);
    });
  }

  Stream<List<Asset>> getAssetsOfInstruction(int givenInstructionId) {
    final query = (select(assets)..where((t) => t.deletedAt.isNull())).join([
      innerJoin(
          instructionsAssets, assets.id.equalsExp(instructionsAssets.assetId),
          useColumns: false)
    ])
      ..where((instructionsAssets.instructionId).equals(givenInstructionId))
      ..where(instructionsAssets.deletedAt.isNull());
    return query.map((row) => row.readTable(assets)).watch();
  }

  // TABLE: Instruction_Asset
  Future<void> insertMultipleInstructionsAssets(
      List<Insertable<InstructionAsset>> list) async {
    await batch((batch) {
      batch.insertAllOnConflictUpdate(instructionsAssets, list);
    });
  }

  @override
  int get schemaVersion => 1;
}
