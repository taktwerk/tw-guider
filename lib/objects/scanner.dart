import 'package:flutter/material.dart';

class ScanModel with ChangeNotifier {
  String _scannedText = "";
  String get text => _scannedText;

  void updateText(String newText) {
    _scannedText = newText;
    notifyListeners();
  }
}
