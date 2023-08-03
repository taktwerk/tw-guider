import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:internet_connection_checker/internet_connection_checker.dart';
import 'package:guider/languages/app_localizations.dart';
import 'package:guider/views/homepage.dart';
import 'package:logger/logger.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:guider/languages/supported_languages.dart';

ValueNotifier<bool> isDeviceConnected = ValueNotifier(false);
final database = AppDatabase();

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

class GuiderApp extends StatefulWidget {
  const GuiderApp({super.key});

  static void setLocale(BuildContext context, Locale newLocale) {
    var state = context.findAncestorStateOfType<_GuiderAppState>();
    state!.setLocale(newLocale);
  }

  @override
  State<StatefulWidget> createState() => _GuiderAppState();
}

class _GuiderAppState extends State<GuiderApp> {
  Locale _locale = const Locale.fromSubtags(languageCode: 'en');
  late StreamSubscription<ConnectivityResult> subscription;

  void setLocale(Locale locale) {
    setState(() {
      _locale = locale;
    });
  }

  @override
  void initState() {
    super.initState();
    database.addInstruction(InstructionsCompanion.insert(
        description: 'description',
        image: 'image',
        shortTitle: 'short title',
        title: 'title'));
    test();

    subscription = Connectivity()
        .onConnectivityChanged
        .listen((ConnectivityResult result) async {
      isDeviceConnected.value = await InternetConnectionChecker().hasConnection;
      logger.w("Internet status: $isDeviceConnected");
    });
  }

  test() async {
    var allI = await database.allInstructionEntries;
    print("INSTRUCTIONS $allI");
  }

  @override
  void dispose() {
    subscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      locale: _locale,
      supportedLocales: SupportedLanguages.all,
      localizationsDelegates: const [
        AppLocalizationsDelegate(),
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      localeResolutionCallback: (locale, supportedLocales) {
        for (var supportedLocale in supportedLocales) {
          if (supportedLocale.languageCode == locale?.languageCode &&
              supportedLocale.countryCode == locale?.countryCode) {
            return supportedLocale;
          }
        }
        return supportedLocales.first;
      },
      debugShowCheckedModeBanner: false,
      title: 'Guider',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
            seedColor: const Color.fromARGB(255, 92, 172, 252)),
        useMaterial3: true,
      ),
      home: const MyHomePage(),
    );
  }
}
