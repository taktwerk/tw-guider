import 'package:guider/helpers/localstorage/key_value.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';

class DriftToSupabase {
  static Future<void> uploadFeedback() async {
    var feed = await Singleton().getDatabase().notSyncedFeedbackEntries;
    logger.i("Not synced feedback: $feed");
    int len = feed.length;
    for (int i = 0; i < len; i++) {
      var entry = feed[i];
      await supabase.from('feedback').insert({
        'id': entry.id,
        'user_id': entry.userId,
        'message': entry.message,
        'image': entry.image,
        'instruction_id': entry.instructionId,
        'created_at': entry.createdAt.toUtc().toIso8601String(),
        'created_by': entry.createdBy,
        'updated_at': entry.updatedAt.toUtc().toIso8601String(),
        'updated_by': entry.updatedBy,
        'deleted_at': entry.deletedAt,
        'deleted_by': entry.deletedBy,
      });
      await Singleton().getDatabase().updateFeedback(entry);
    }
  }

  static Future<void> uploadHistory() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.history.key);
    print("Last synced $lastSynced");
    var history = await Singleton()
        .getDatabase()
        .notSyncedHistoryEntries(DateTime.parse(lastSynced!));
    print("Not synced history: $history");
    int len = history.length;
    for (int i = 0; i < len; i++) {
      var historyEntry = history[i];
      await supabase.from('history').upsert({
        'user_id': historyEntry.userId,
        'instruction_id': historyEntry.instructionId,
        "created_at": historyEntry.createdAt.toUtc().toIso8601String(),
        "created_by": historyEntry.createdBy,
        "updated_at": historyEntry.updatedAt.toUtc().toIso8601String(),
        "updated_by": historyEntry.updatedBy,
        'deleted_at': historyEntry.deletedAt,
        'deleted_by': historyEntry.deletedBy,
        "instruction_step_id": historyEntry.instructionStepId,
      }, onConflict: 'user_id,instruction_id').gt("updated_at", lastSynced);
    }
  }
}
