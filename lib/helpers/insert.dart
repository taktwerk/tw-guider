import 'package:guider/main.dart';

class Insert {
  static Future<void> updateHistory(
      {userID = 2, instructionId, created_by = 2, updated_by = 2}) async {
    await supabase.from('history').upsert({
      'user_id': userID,
      'instruction_id': instructionId,
      "created_by": created_by,
      "updated_by": updated_by,
      "updated_at": (DateTime.now()).toIso8601String()
    }, onConflict: 'user_id,instruction_id');
  }
}
