import 'dart:async';

import 'package:drift/drift.dart';
import 'package:drift/wasm.dart';
import 'package:flutter/foundation.dart';

/// Obtains a database connection for running drift on the web.
DatabaseConnection connect() {
  return DatabaseConnection.delayed(Future(() async {
    final db = await WasmDatabase.open(
      databaseName: 'guider-app',
      sqlite3Uri: Uri.parse('/sqlite3.wasm'),
      driftWorkerUri: Uri.parse('/drift_worker.js'),
    );
    // Depending how central local persistence is to your app, you may want
    // to show a warning to the user if only unrealiable implemetentations
    // are available.
    if (db.missingFeatures.isNotEmpty) {
      debugPrint('Using ${db.chosenImplementation} due to unsupported '
          'browser features: ${db.missingFeatures}');
    }

    return db.resolvedExecutor;
  }));
}

Future<void> validateDatabaseSchema(GeneratedDatabase database) async {
  // Unfortunately, validating database schemas only works for native platforms
  // right now.
}
