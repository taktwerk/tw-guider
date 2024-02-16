class CancellationToken {
  bool _isCancellationRequested = false;

  bool get isCancellationRequested => _isCancellationRequested;

  void cancel() {
    _isCancellationRequested = true;
  }

  void reset() {
    _isCancellationRequested = false;
  }

  void throwIfCancellationRequested() {
    if (_isCancellationRequested) {
      throw CancellationException();
    }
  }
}

class CancellationException implements Exception {
  @override
  String toString() => 'Operation was cancelled';
}

enum SyncStatus {
  neverSynced,
  pendingSync,
  fullSync,
  runningSync,
  cancelledSync
}
