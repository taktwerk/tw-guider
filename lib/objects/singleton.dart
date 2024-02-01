import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/objects/cancellation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Singleton {
  static final Singleton _singleton = Singleton._internal();
  final _database = AppDatabase();
  static SharedPreferences? _prefsInstance;
  static final CancellationToken _cancellationToken = CancellationToken();
  Singleton._internal();
  static final ValueNotifier<int> _numberOfSyncedTables = ValueNotifier<int>(0);
  static final ValueNotifier<List<ProgressFraction>>
      _percentageOfSyncedEntries = ValueNotifier<List<ProgressFraction>>([]);
  static final ValueNotifier<SyncStatus> _syncStatus =
      ValueNotifier<SyncStatus>(SyncStatus.neverSynced);

  factory Singleton() {
    return _singleton;
  }

  AppDatabase getDatabase() => _database;
  Future<SharedPreferences> getPrefInstance() async =>
      _prefsInstance ?? await SharedPreferences.getInstance();

  bool getSyncing() => _syncStatus.value == SyncStatus.runningSync;
  SyncStatus getSyncStatus() => _syncStatus.value;
  ValueNotifier<int> getNumberofSynchedTables() => _numberOfSyncedTables;
  ValueNotifier<List<ProgressFraction>> getPercentageOfSyncedEntries() =>
      _percentageOfSyncedEntries;
  ValueNotifier<SyncStatus> getValueNotifierSyncStatus() => _syncStatus;

  CancellationToken getCancelToken() => _cancellationToken;

  void setSyncStatus({required SyncStatus newStatus}) {
    _syncStatus.value = newStatus;
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
  String tablename;

  ProgressFraction(this.synced, this.total, this.tablename);

  @override
  String toString() {
    return "$synced/$total, $tablename";
  }
}
