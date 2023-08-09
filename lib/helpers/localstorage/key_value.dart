import 'package:guider/objects/singleton.dart';

class KeyValue {
  static Future<void> initialize() async {
    _setInitialValue(KeyValueEnum.instruction.key);
    _setInitialValue(KeyValueEnum.steps.key);
    _setInitialValue(KeyValueEnum.user.key);
    _setInitialValue(KeyValueEnum.history.key);
    _setInitialValue(KeyValueEnum.feedback.key);
    _setInitialValue(KeyValueEnum.category.key);
    _setInitialValue(KeyValueEnum.instructionCategory.key);
    _setInitialValue(KeyValueEnum.setting.key);
  }

  static Future<void> _setInitialValue(key) async {
    var prefs = await Singleton().getPrefInstance();
    String? value = prefs.getString(key);
    if (value == null) {
      value = DateTime(1900, 3, 1).toIso8601String();
      prefs.setString(key, value);
    }
  }

  static Future<void> setNewValue(key, value) async {
    var prefs = await Singleton().getPrefInstance();
    prefs.setString(key, value);
  }

  static Future<String?> getValue(key) async {
    var prefs = await Singleton().getPrefInstance();
    return prefs.getString(key);
  }
}

enum KeyValueEnum {
  category("sync_category"),
  setting("sync_setting"),
  user("sync_user"),
  instruction("sync_instruction"),
  steps("sync_steps"),
  history("sync_history"),
  instructionCategory("sync_instruction_category"),
  feedback("sync_feedback");

  const KeyValueEnum(this.key);
  final String key;
}
