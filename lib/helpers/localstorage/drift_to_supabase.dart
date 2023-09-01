import 'dart:convert';
import 'package:guider/helpers/constants.dart';
import 'package:guider/helpers/localstorage/key_value.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class DriftToSupabase {
  static Future<void> uploadFeedback() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.feedback.key);

    var feed = await Singleton()
        .getDatabase()
        .notSyncedFeedbackEntries(DateTime.parse(lastSynced!));
    logger.i("Not synced feedback: $feed");

    int len = feed.length;
    for (int i = 0; i < len; i++) {
      var entry = feed[i];
      await supabase.from('feedback').upsert({
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
      }, onConflict: 'id');
    }
  }

  static Future<void> uploadFeedbackImages() async {
    var images = await Singleton().getDatabase().allBytesEntries;
    int len = images.length;
    for (int i = 0; i < len; i++) {
      var image = images[i];
      await supabase.storage.from('feedback_images').uploadBinary(
          "${image.imageXid}.png", base64.decode(image.image),
          fileOptions: const FileOptions(cacheControl: '3600', upsert: false));
      await Singleton().getDatabase().deleteBytesEntry(image.feedbackId);
    }
  }

  static Future<void> uploadHistory(data) async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.history.key);
    var history = await Singleton()
        .getDatabase()
        .notSyncedHistoryEntries(DateTime.parse(lastSynced!));
    var filteredHistory = [];
    for (int i = 0; i < history.length; i++) {
      var localEntry = history[i];
      if (data.isNotEmpty) {
        for (int j = 0; j < data.length; j++) {
          var entryFromSupabase = data[j];
          if (entryFromSupabase[Const.userId.key] == localEntry.userId &&
              entryFromSupabase[Const.instructionId.key] ==
                  localEntry.instructionId) {
            if (DateTime.parse(entryFromSupabase[Const.updatedAt.key])
                    .compareTo(localEntry.updatedAt.toUtc()) <
                0) {
              filteredHistory.add(localEntry);
            }
          } else {
            filteredHistory.add(localEntry);
          }
        }
      } else {
        filteredHistory.add(localEntry);
      }
    }
    int len = filteredHistory.length;
    for (int i = 0; i < len; i++) {
      var historyEntry = filteredHistory[i];
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

  static Future<void> uploadSettings() async {
    var lastSynced = await KeyValue.getValue(KeyValueEnum.setting.key);
    var settings = await Singleton()
        .getDatabase()
        .notSyncedSettingsEntries(DateTime.parse(lastSynced!));
    int len = settings.length;
    for (int i = 0; i < len; i++) {
      var settingsEntry = settings[i];
      await supabase.from('setting').update({
        'language': settingsEntry.language,
        'updated_at': settingsEntry.updatedAt.toUtc().toIso8601String(),
        'updated_by': settingsEntry.updatedBy,
        'realtime': settingsEntry.realtime,
        'lightmode': settingsEntry.lightmode,
      }).eq('user_id', settingsEntry.userId);
    }
  }
}
