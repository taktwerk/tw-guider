import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Singleton {
  static final Singleton _singleton = Singleton._internal();
  final _database = AppDatabase();
  static SharedPreferences? _prefsInstance;
  static bool syncing = false;
  Singleton._internal();

  factory Singleton() {
    return _singleton;
  }

  AppDatabase getDatabase() => _database;
  Future<SharedPreferences> getPrefInstance() async =>
      _prefsInstance ?? await SharedPreferences.getInstance();
  bool getSyncing() => syncing;

  setSyncing({required bool newSyncing}) {
    syncing = newSyncing;
  }
}
