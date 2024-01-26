import 'package:flutter/material.dart';
import 'package:guider/objects/singleton.dart';

class SyncingStatus extends StatefulWidget {
  const SyncingStatus({super.key});

  @override
  State<SyncingStatus> createState() => _SyncingStatusState();
}

class _SyncingStatusState extends State<SyncingStatus> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Column(
        children: [
          Center(
            child: Table(
              defaultColumnWidth: IntrinsicColumnWidth(),
              children: [
                TableRow(
                  children: [
                    ValueListenableBuilder<int>(
                        valueListenable: Singleton().getNumberofSynchedTables(),
                        builder: ((context, numberOfSyncedTables, child) {
                          return Text(
                              "Sync Progress: Table $numberOfSyncedTables/${Singleton().getDatabase().getNumberOfTables()} (${(numberOfSyncedTables / Singleton().getDatabase().getNumberOfTables() * 100).toInt()}%)");
                        })),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(
            height: 20,
          ),
          ValueListenableBuilder<List<ProgressFraction>>(
              valueListenable: Singleton().getPercentageOfSyncedEntries(),
              builder: ((context, percentageOfSyncedEntries, child) {
                return Table(
                  defaultColumnWidth: IntrinsicColumnWidth(),
                  children:
                      percentageOfSyncedEntries.asMap().entries.map((entry) {
                    final index = entry.key;
                    final syncEntry = entry.value;
                    return TableRow(children: [
                      Align(
                        alignment: Alignment.centerLeft,
                        child:
                            Text("Table ${index + 1} (${syncEntry.tablename})"),
                      ),
                      Center(
                        child: Text(
                          "${syncEntry.synced}/${syncEntry.total} ",
                        ),
                      ),
                      Align(
                        alignment: Alignment.centerRight,
                        child: Text(
                          "(${((syncEntry.synced <= 0 ? 1 : syncEntry.synced) / (syncEntry.total <= 0 ? 1 : syncEntry.total) * 100).toInt()}%)",
                        ),
                      )
                    ]);
                  }).toList(),
                );
              })),
          const SizedBox(
            height: 20,
          ),
          ValueListenableBuilder<bool>(
              valueListenable: Singleton().getValueNotifierIsSynced(),
              builder: ((context, isSynced, child) {
                return Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Icon(
                      isSynced ? Icons.check_circle : Icons.sync_problem,
                      color: isSynced ? Colors.green : Colors.red,
                    ),
                    const SizedBox(
                        width:
                            8.0), // Add some spacing between the icon and the text
                    Text(
                      isSynced
                          ? 'App is synced up'
                          : 'Local changes detected, sync needed',
                      style: TextStyle(
                          color: isSynced ? Colors.green : Colors.red),
                    ),
                  ],
                );
              })),
        ],
      ),
    );
  }
}
