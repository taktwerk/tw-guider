import 'package:flutter/material.dart';
import 'package:guider/views/homepage.dart';

void main() {
  runApp(const GuiderApp());
}

class GuiderApp extends StatelessWidget {
  const GuiderApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Guider',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
            seedColor: const Color.fromARGB(255, 92, 172, 252)),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Homepage'),
    );
  }
}
