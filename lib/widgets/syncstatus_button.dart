import 'package:flutter/material.dart';
import 'package:guider/objects/cancellation.dart';
import 'package:guider/objects/singleton.dart';

class SyncStatusIndicator extends StatefulWidget {
  const SyncStatusIndicator({super.key});

  @override
  State<SyncStatusIndicator> createState() => _SyncStatusIndicatorState();
}

class _SyncStatusIndicatorState extends State<SyncStatusIndicator> {
  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder(
      valueListenable: Singleton().getValueNotifierSyncStatus(),
      builder: (context, value, child) {
        IconData icon;
        String text;
        Color color;
        switch (value) {
          case SyncStatus.neverSynced:
            icon = Icons.error;
            text = 'Never synced';
            color = Colors.red;
            break;
          case SyncStatus.pendingSync:
            icon = Icons.sync_problem;
            text = 'Pending sync';
            color = Colors.orange;
            break;
          case SyncStatus.fullSync:
            icon = Icons.sync;
            text = 'Full sync';
            color = Colors.green;
            break;
          case SyncStatus.runningSync:
            icon = Icons.sync;
            text = 'Running sync';
            color = Colors.blue;
            break;
          case SyncStatus.cancelledSync:
            icon = Icons.cancel;
            text = 'Cancelled sync';
            color = Colors.red;
            break;
        }

        return Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Icon(
              icon,
              color: color,
            ),
            const SizedBox(
                width: 8.0), // Add some spacing between the icon and the text
            Text(
              text,
              style: TextStyle(color: color),
            ),
          ],
        );
      },
    );
  }
}
