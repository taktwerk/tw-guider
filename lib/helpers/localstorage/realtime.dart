import 'dart:async';

import 'package:guider/helpers/localstorage/supabase_to_drift.dart';
import 'package:guider/main.dart';

class Realtime {
  static StreamSubscription getInstructionStream() {
    final sup =
        supabase.from('instruction').stream(primaryKey: ['id']).limit(1).listen(
              (event) async {
                print("instruction event ${event.length}");
                await SupabaseToDrift.sync();
              },
              onError: (e, s) {
                logger.e('realtime 1 error: $e \ns:$s');
                if (e.toString() == '' || e.toString() == '{}') return;
              },
            );
    return sup;
  }

  static StreamSubscription getCategoryStream() {
    final sup =
        supabase.from('category').stream(primaryKey: ['id']).limit(1).listen(
              (event) async {
                print("category event ${event.length}");
                await SupabaseToDrift.sync();
              },
              onError: (e, s) {
                logger.e('realtime 1 error: $e \ns:$s');
                if (e.toString() == '' || e.toString() == '{}') return;
              },
            );
    return sup;
  }

  static StreamSubscription getFeedbackStream() {
    final sup =
        supabase.from('feedback').stream(primaryKey: ['id']).limit(1).listen(
              (event) async {
                print("feedback event ${event.length}");
                await SupabaseToDrift.sync();
              },
              onError: (e, s) {
                logger.e('realtime 1 error: $e \ns:$s');
                if (e.toString() == '' || e.toString() == '{}') return;
              },
            );
    return sup;
  }

  static StreamSubscription getHistoryStream() {
    final sup = supabase
        .from('history')
        .stream(primaryKey: ['user_id', 'instruction_id'])
        .limit(1)
        .listen(
          (event) async {
            print("history event ${event.length}");
            await SupabaseToDrift.sync();
          },
          onError: (e, s) {
            logger.e('realtime 1 error: $e \ns:$s');
            if (e.toString() == '' || e.toString() == '{}') return;
          },
        );
    return sup;
  }

  static StreamSubscription getInstructionCategoryStream() {
    final sup = supabase
        .from('instruction_category')
        .stream(primaryKey: ['category_id', 'instruction_id'])
        .limit(1)
        .listen(
          (event) async {
            print("instruction_category event ${event.length}");
            await SupabaseToDrift.sync();
          },
          onError: (e, s) {
            logger.e('realtime 1 error: $e \ns:$s');
            if (e.toString() == '' || e.toString() == '{}') return;
          },
        );
    return sup;
  }

  static StreamSubscription getInstructionStepStream() {
    final sup = supabase
        .from('instruction_step')
        .stream(primaryKey: ['id'])
        .limit(1)
        .listen(
          (event) async {
            print("instruction_step event ${event.length}");
            await SupabaseToDrift.sync();
          },
          onError: (e, s) {
            logger.e('realtime 1 error: $e \ns:$s');
            if (e.toString() == '' || e.toString() == '{}') return;
          },
        );
    return sup;
  }

  static StreamSubscription getSettingStream() {
    final sup = supabase
        .from('setting')
        .stream(primaryKey: ['user_id'])
        .limit(1)
        .listen(
          (event) async {
            print("setting event ${event.length}");
            await SupabaseToDrift.sync();
          },
          onError: (e, s) {
            logger.e('realtime 1 error: $e \ns:$s');
            if (e.toString() == '' || e.toString() == '{}') return;
          },
        );
    return sup;
  }

  static StreamSubscription getUserStream() {
    final sup =
        supabase.from('user').stream(primaryKey: ['id']).limit(1).listen(
              (event) async {
                print("user event ${event.length}");
                await SupabaseToDrift.sync();
              },
              onError: (e, s) {
                logger.e('realtime 1 error: $e \ns:$s');
                if (e.toString() == '' || e.toString() == '{}') return;
              },
            );
    return sup;
  }
}
