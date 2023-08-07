import 'package:guider/helpers/localstorage/localstorage.dart';

class Singleton {
  static final Singleton _singleton = Singleton._internal();
  final _database = AppDatabase();
  Singleton._internal();

  factory Singleton() {
    return _singleton;
  }

  AppDatabase getDatabase() => _database;
}
