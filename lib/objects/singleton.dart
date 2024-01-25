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
  static final ValueNotifier<int> _numberOfSyncedTables = ValueNotifier<int>(0);
  static final ValueNotifier<List<ProgressFraction>>
      _percentageOfSyncedEntries = ValueNotifier<List<ProgressFraction>>([]);

  factory Singleton() {
    return _singleton;
  }

  AppDatabase getDatabase() => _database;
  Future<SharedPreferences> getPrefInstance() async =>
      _prefsInstance ?? await SharedPreferences.getInstance();
  bool getSyncing() => _syncing.value;
  ValueNotifier<bool> getValueNotifierSyncing() => _syncing;
  ValueNotifier<bool> getValueNotifierIsSynced() => _isSynced;
  ValueNotifier<int> getNumberofSynchedTables() => _numberOfSyncedTables;
  ValueNotifier<List<ProgressFraction>> getPercentageOfSyncedEntries() =>
      _percentageOfSyncedEntries;

  void setSyncing({required bool newSyncing}) {
    _syncing.value = newSyncing;
  }

  void setIsSynced({required bool newSyncing}) {
    _isSynced.value = newSyncing;
  }

  void setNumberOfSyncedTables({required int numberOfSyncedTables}) {
    _numberOfSyncedTables.value = numberOfSyncedTables;
  }

  void incrementNumberOfSyncedTables() {
    _numberOfSyncedTables.value++;
  }

  void resetNumberOfSyncedTables() {
    _numberOfSyncedTables.value = 0;
  }

  void addAndUpdate(ProgressFraction progress) {
    _percentageOfSyncedEntries.value.add(progress);
    updateNotifier();
  }

  void updateNotifier() {
    _percentageOfSyncedEntries.value =
        List.from(_percentageOfSyncedEntries.value);
  }

  void resetPercentageOfSyncedEntries() {
    _percentageOfSyncedEntries.value = [];
  }
}

class ProgressFraction {
  int synced;
  int total;

  ProgressFraction(this.synced, this.total);

  @override
  String toString() {
    return "$synced/$total";
  }
}
