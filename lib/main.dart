import 'package:flutter/material.dart';
import 'package:guider/views/homepage.dart';
import 'package:logger/logger.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(
      url: "https://spohaqvzfgvdihxcwvff.supabase.co",
      anonKey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwb2hhcXZ6Zmd2ZGloeGN3dmZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkyMzM0OTgsImV4cCI6MjAwNDgwOTQ5OH0.vOlkfj8sLoDvmWV3rrbNWwpu0Iir0Z5V5P4MuUpI5oI");
  runApp(const GuiderApp());
}

final supabase = Supabase.instance.client;
int currentUser = 1;

var logger = Logger(
    printer: PrettyPrinter(
        methodCount: 2, // number of method calls to be displayed
        errorMethodCount: 8, // number of method calls if stacktrace is provided
        lineLength: 120, // width of the output
        colors: true, // Colorful log messages
        printEmojis: true, // Print an emoji for each log message
        printTime: true // Should each log print contain a timestamp  ),
        ));

class GuiderApp extends StatelessWidget {
  const GuiderApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
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
