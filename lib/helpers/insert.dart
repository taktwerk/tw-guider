import 'package:guider/main.dart';

class Insert {
  static Future<void> updateHistory(
      {userID = 2, instructionId, created_by = 2, updated_by = 2}) async {
    await supabase.from('history').upsert({
      'user_id': userID,
      'instruction_id': instructionId,
      "created_by": created_by,
      "updated_by": updated_by,
      "updated_at": (DateTime.now()).toIso8601String(),
    }, onConflict: 'user_id,instruction_id');
  }

  static Future<void> setNewStep(
      {userId = 2, instructionId, instructionStepId}) async {
    await supabase
        .from('history')
        .update({'instruction_step_id': instructionStepId})
        .eq('instruction_id', instructionId)
        .eq('user_id', userId);
  }

  static Future<void> sendFeedback(
      {instructionId, user_id = 2, text, image}) async {
    await supabase.from('feedback').insert({
      'instruction_id': instructionId,
      'user_id': user_id,
      'text': text,
      'image': image
    });
  }
}
