import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Singleton {
  static final Singleton _singleton = Singleton._internal();
  final _database = AppDatabase();
  static SharedPreferences? _prefsInstance;
  Singleton._internal();
  static final ValueNotifier<bool> _syncing = ValueNotifier<bool>(false);
  static final ValueNotifier<bool> _isSynced = ValueNotifier<bool>(false);

  factory Singleton() {
    return _singleton;
  }

  AppDatabase getDatabase() => _database;
  Future<SharedPreferences> getPrefInstance() async =>
      _prefsInstance ?? await SharedPreferences.getInstance();
  bool getSyncing() => _syncing.value;
  ValueNotifier<bool> getValueNotifierSyncing() => _syncing;
  ValueNotifier<bool> getValueNotifierIsSynced() => _isSynced;

  setSyncing({required bool newSyncing}) {
    _syncing.value = newSyncing;
  }

  setIsSynced({required bool newSyncing}) {
    _isSynced.value = newSyncing;
  }
}
