import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/supabase_to_drift.dart';
import 'package:guider/objects/cancellation.dart';
import 'package:guider/objects/singleton.dart';

class CancelSyncButton extends StatefulWidget {
  const CancelSyncButton({super.key});

  @override
  State<CancelSyncButton> createState() => _CancelSyncButtonState();
}

class _CancelSyncButtonState extends State<CancelSyncButton> {
  void _startSync() {
    SupabaseToDrift.sync();
  }

  void _cancelSync() {
    Singleton().getCancelToken().cancel();
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<SyncStatus>(
      valueListenable: Singleton().getValueNotifierSyncStatus(),
      builder: (context, syncStatus, child) {
        return syncStatus == SyncStatus.runningSync
            ? ElevatedButton.icon(
                onPressed: _cancelSync,
                icon: const Icon(Icons.cancel),
                label: const Text('Cancel Sync'),
              )
            : ElevatedButton.icon(
                onPressed: _startSync,
                icon: const Icon(Icons.sync),
                label: const Text('Start Sync'),
              );
      },
    );
  }
}
