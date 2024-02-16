import 'dart:async';

import 'package:guider/helpers/localstorage/supabase_to_drift.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';

class Realtime {
  static List<StreamSubscription> init() {
    List<StreamSubscription> list = [];
    list.add(getInstructionStream());
    list.add(getCategoryStream());
    list.add(getFeedbackStream());
    list.add(getInstructionStepStream());
    list.add(getInstructionCategoryStream());
    list.add(getSettingStream());
    list.add(getUserStream());
    return list;
  }

  static Future<void> sync() async {
    try {
      if (currentUser != null) {
        var setting = await Singleton().getDatabase().getRealtime(currentUser!);
        var realtime = setting.firstOrNull?.realtime;
        if (realtime != null && realtime) {
          await SupabaseToDrift.sync();
        }
      }
    } catch (e) {
      // SYNC TODO:
      logger.e("Realtime EXCEPTION $e");
    }
  }

  static StreamSubscription getInstructionStream() {
    final sup =
        supabase.from('instruction').stream(primaryKey: ['id']).limit(1).listen(
              (event) async {
                sync();
              },
              onError: (e, s) {
                if (e.toString() == '' || e.toString() == '{}') return;
              },
            );
    return sup;
  }

  static StreamSubscription getCategoryStream() {
    final sup =
        supabase.from('category').stream(primaryKey: ['id']).limit(1).listen(
              (event) async {
                sync();
              },
              onError: (e, s) {
                if (e.toString() == '' || e.toString() == '{}') return;
              },
            );
    return sup;
  }

  static StreamSubscription getFeedbackStream() {
    final sup =
        supabase.from('feedback').stream(primaryKey: ['id']).limit(1).listen(
              (event) async {
                sync();
              },
              onError: (e, s) {
                if (e.toString() == '' || e.toString() == '{}') return;
              },
            );
    return sup;
  }

  static Stream getHistoryStream() {
    final sup = supabase
        .from('history')
        .stream(primaryKey: ['user_id', 'instruction_id'])
        .limit(1)
        .eq('user_id', currentUser);

    return sup;
  }

  static StreamSubscription getInstructionCategoryStream() {
    final sup = supabase
        .from('instruction_category')
        .stream(primaryKey: ['category_id', 'instruction_id'])
        .limit(1)
        .listen(
          (event) async {
            sync();
          },
          onError: (e, s) {
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
            sync();
          },
          onError: (e, s) {
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
            sync();
          },
          onError: (e, s) {
            if (e.toString() == '' || e.toString() == '{}') return;
          },
        );
    return sup;
  }

  static StreamSubscription getUserStream() {
    final sup =
        supabase.from('user').stream(primaryKey: ['id']).limit(1).listen(
              (event) async {
                sync();
              },
              onError: (e, s) {
                if (e.toString() == '' || e.toString() == '{}') return;
              },
            );
    return sup;
  }
}
