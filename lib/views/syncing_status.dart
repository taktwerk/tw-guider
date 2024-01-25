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
          Table(
            children: [
              TableRow(
                children: <Widget>[
                  const Center(
                    child: Text("Sync Progress:"),
                  ),
                  Center(
                    child: ValueListenableBuilder<int>(
                        valueListenable: Singleton().getNumberofSynchedTables(),
                        builder: ((context, numberOfSyncedTables, child) {
                          return Text(
                              "Table $numberOfSyncedTables/${Singleton().getDatabase().getNumberOfTables()} (${(numberOfSyncedTables / Singleton().getDatabase().getNumberOfTables() * 100).toInt()}%)");
                        })),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(
            height: 20,
          ),
          ValueListenableBuilder<List<ProgressFraction>>(
              valueListenable: Singleton().getPercentageOfSyncedEntries(),
              builder: ((context, percentageOfSyncedEntries, child) {
                return Table(
                  children:
                      percentageOfSyncedEntries.asMap().entries.map((entry) {
                    final index = entry.key;
                    final syncEntry = entry.value;
                    return TableRow(children: [
                      Center(
                        child: Text("Table ${index + 1}"),
                      ),
                      Center(
                        child: Text(
                          "${syncEntry.synced}/${syncEntry.total}",
                        ),
                      ),
                      Center(
                        child: Text(
                          "(${((syncEntry.synced <= 0 ? 1 : syncEntry.synced) / (syncEntry.total <= 0 ? 1 : syncEntry.total) * 100).toInt()}%)",
                        ),
                      )
                    ]);
                  }).toList(),
                );
              })),
        ],
      ),
    );
  }
}
