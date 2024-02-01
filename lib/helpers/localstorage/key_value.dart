import 'package:guider/main.dart';
import 'package:guider/objects/cancellation.dart';
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
    _setInitialValue(KeyValueEnum.asset.key);
    _setInitialValue(KeyValueEnum.instructionAsset.key);
    _setInitialSyncStatus();
  }

  static Future<void> _setInitialValue(key) async {
    String? value = await getValue(key);
    if (value == null) {
      value = DateTime(1900, 3, 1).toIso8601String();
      setNewValue(key, value);
    }
  }

  static Future<void> _setInitialSyncStatus() async {
    SyncStatus? value = await getSyncStatus();
    // in case the app gets closed while syncing, set the SyncStatus to pending to be able to start the sync manually again
    if (value == SyncStatus.runningSync) {
      value = SyncStatus.pendingSync;
    }
    saveSyncStatus(value ?? SyncStatus.neverSynced);
  }

  static Future<void> resetKeyValues() async {
    var prefs = await Singleton().getPrefInstance();
    await prefs.clear();
    if (currentUser != null) {
      prefs.setInt(KeyValueEnum.currentUser.key, currentUser!);
    }
    await initialize();
  }

  // static Future<void> setInitialUser() async {
  //   int? value = await getCurrentUser();
  //   if (value == null) {
  //     var users = await Singleton().getDatabase().getUserSortedById();
  //     var initialUser = users.firstOrNull;
  //     if (initialUser != null) {
  //       setCurrentUser(initialUser.id);
  //       currentUser = initialUser.id;
  //     }
  //   }
  // }

  static Future<void> setNewValue(key, value) async {
    var prefs = await Singleton().getPrefInstance();
    prefs.setString(key, value);
  }

  static Future<String?> getValue(key) async {
    var prefs = await Singleton().getPrefInstance();
    return prefs.getString(key);
  }

  static Future<void> setCurrentUser(value) async {
    var prefs = await Singleton().getPrefInstance();
    prefs.setInt(KeyValueEnum.currentUser.key, value);
  }

  static Future<int?> getCurrentUser() async {
    var prefs = await Singleton().getPrefInstance();
    return prefs.getInt(KeyValueEnum.currentUser.key);
  }

  static Future<bool> saveLogin(islogin) async {
    var prefs = await Singleton().getPrefInstance();
    return await prefs.setBool(KeyValueEnum.login.key, islogin);
  }

  static Future getLogin() async {
    var prefs = await Singleton().getPrefInstance();
    return prefs.getBool(KeyValueEnum.login.key);
  }

  static Future<bool> saveClient(client) async {
    var prefs = await Singleton().getPrefInstance();
    return await prefs.setString(KeyValueEnum.client.key, client);
  }

  static Future getClient() async {
    var prefs = await Singleton().getPrefInstance();
    return prefs.getString(KeyValueEnum.client.key);
  }

  static Future<void> saveSyncStatus(SyncStatus status) async {
    var prefs = await Singleton().getPrefInstance();
    prefs.setInt(KeyValueEnum.syncStatus.key, status.index);
    Singleton().setSyncStatus(newStatus: status);
  }

  static Future<SyncStatus?> getSyncStatus() async {
    var prefs = await Singleton().getPrefInstance();
    final statusIndex = prefs.getInt(KeyValueEnum.syncStatus.key);
    return statusIndex != null ? SyncStatus.values[statusIndex] : null;
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
  feedback("sync_feedback"),
  currentUser("current_user"),
  login("login"),
  asset("sync_asset"),
  instructionAsset("sync_instruction_asset"),
  client("client"),
  syncStatus("sync_status");

  const KeyValueEnum(this.key);
  final String key;
}
