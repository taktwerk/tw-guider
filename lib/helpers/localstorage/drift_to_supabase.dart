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
        'created_at': entry.createdAt.toIso8601String(),
        'created_by': entry.createdBy,
        'updated_at': entry.updatedAt.toIso8601String(),
        'updated_by': entry.updatedBy,
      });
      await Singleton().getDatabase().updateFeedback(entry);
    }
  }
}
