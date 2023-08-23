//Custom class in project directory
import 'package:flutter/material.dart';

class CustomSnackBar {
  CustomSnackBar._();
  static buildErrorSnackbar(BuildContext context, String message) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }
}
