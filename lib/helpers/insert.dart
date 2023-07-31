import 'package:guider/main.dart';

class Insert {
  static Future<void> updateHistory(
      {userId = 2, instructionId, createdBy = 2, updatedBy = 2}) async {
    await supabase.from('history').upsert({
      'user_id': userId,
      'instruction_id': instructionId,
      "created_by": createdBy,
      "updated_by": updatedBy,
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
      {instructionId, userId = 2, text, image}) async {
    await supabase.from('feedback').insert({
      'instruction_id': instructionId,
      'user_id': userId,
      'text': text,
      'image': image
    });
  }
}
