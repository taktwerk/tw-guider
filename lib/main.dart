import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:guider/helpers/localstorage/key_value.dart';
import 'package:guider/helpers/localstorage/supabase_to_drift.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/homepage.dart';
import 'package:guider/views/login.dart';
import 'package:internet_connection_checker/internet_connection_checker.dart';
import 'package:guider/languages/app_localizations.dart';
import 'package:logger/logger.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:guider/languages/supported_languages.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart' as provider;

ValueNotifier<bool> isDeviceConnected = ValueNotifier(false);

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(
      url: "https://spohaqvzfgvdihxcwvff.supabase.co",
      anonKey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwb2hhcXZ6Zmd2ZGloeGN3dmZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkyMzM0OTgsImV4cCI6MjAwNDgwOTQ5OH0.vOlkfj8sLoDvmWV3rrbNWwpu0Iir0Z5V5P4MuUpI5oI");
  await KeyValue.initialize();
  currentUser = await KeyValue.getCurrentUser();
  if (currentUser == null) {
    await SupabaseToDrift.initializeUsers();
  }
  logger.i("Currentuser $currentUser (main)");
  runApp(const provider.ProviderScope(child: GuiderApp()));
}

final todoDBProvider =
    provider.Provider.autoDispose((ref) => Singleton().getDatabase());
final supabase = Supabase.instance.client;
int? currentUser;

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
  Locale? _locale;
  late StreamSubscription<ConnectivityResult> subscription;
  bool _isLoading = false;

  void setLocale(Locale locale) {
    setState(() {
      _locale = locale;
    });
  }

  @override
  void initState() {
    super.initState();

    subscription = Connectivity()
        .onConnectivityChanged
        .listen((ConnectivityResult result) async {
      isDeviceConnected.value = await InternetConnectionChecker().hasConnection;
      logger.w("Internet status: $isDeviceConnected");
    });
  }

  void _onSyncButtonClick() async {
    setState(() => _isLoading = true);

    await SupabaseToDrift.sync()
        .then((value) => setState(() => _isLoading = false));
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
      home: currentUser != null ? const MyHomePage() : const LoginPage(),
      builder: (context, child) {
        return Scaffold(
          body: Stack(
            children: [
              child!,
              Positioned(
                  right: 120,
                  top: 0,
                  child: FloatingActionButton(
                    onPressed: () => _onSyncButtonClick(),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: Row(
                      children: [
                        _isLoading
                            ? Container(
                                width: 24,
                                height: 24,
                                padding: const EdgeInsets.all(2.0),
                                child: const CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 3,
                                ),
                              )
                            : const Icon(Icons.sync),
                        const Text("Sync"),
                      ],
                    ),
                  )),
            ],
          ),
        );
      },
    );
  }
}
