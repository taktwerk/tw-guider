import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:guider/helpers/device_info.dart';
import 'package:guider/helpers/environment.dart';
import 'package:guider/helpers/localstorage/key_value.dart';
import 'package:guider/helpers/localstorage/realtime.dart';
import 'package:guider/helpers/localstorage/supabase_to_drift.dart';
import 'package:guider/views/login.dart';
import 'package:guider/views/registration.dart';
import 'package:guider/views/second_homepage.dart';
import 'package:internet_connection_checker/internet_connection_checker.dart';
import 'package:guider/languages/app_localizations.dart';
import 'package:logger/logger.dart';
import 'package:media_kit/media_kit.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:guider/languages/supported_languages.dart';

ValueNotifier<bool> isDeviceConnected = ValueNotifier(false);

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  MediaKit.ensureInitialized();
  await Supabase.initialize(
      url: Environment.supabaseClientURL, anonKey: Environment.anonKey);
  await KeyValue.initialize();
  currentUser = await KeyValue.getCurrentUser();
  if (currentUser == null) {
    // TODO: check connectivity
    await SupabaseToDrift.initializeUsers();
  }
  logger.i("Currentuser $currentUser (main)");
  runApp(const GuiderApp());
}

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

  static void setTheme(BuildContext context, ThemeMode theme) {
    var state = context.findAncestorStateOfType<_GuiderAppState>();
    state!.setTheme(theme);
  }

  @override
  State<StatefulWidget> createState() => _GuiderAppState();
}

class _GuiderAppState extends State<GuiderApp> {
  Locale? _locale;
  ThemeMode? _theme;
  // StreamSubscription<ConnectivityResult>? subscription;
  bool? islogin;
  String? client;
  List<StreamSubscription> list = Realtime.init();

  void setLocale(Locale locale) {
    setState(() {
      _locale = locale;
    });
  }

  Future<void> checkDevice() async {
    await KeyValue.getClient().then((value) {
      setState(() {
        client = value;
      });
    });
  }

  void setTheme(ThemeMode theme) {
    setState(() {
      _theme = theme;
    });
  }

  @override
  void initState() {
    super.initState();
    checkUserLoginState();
    checkDevice();
    // subscription = Connectivity()
    //     .onConnectivityChanged
    //     .listen((ConnectivityResult result) async {
    //   isDeviceConnected.value = await InternetConnectionChecker().hasConnection;
    //   logger.w("Internet status: $isDeviceConnected");
    // });
  }

  checkUserLoginState() async {
    await KeyValue.getLogin().then((value) {
      setState(() {
        islogin = value;
      });
    });
  }

  @override
  void dispose() {
    // subscription.cancel();
    for (StreamSubscription sub in list) {
      sub.cancel();
    }
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
      darkTheme: ThemeData(brightness: Brightness.dark, useMaterial3: true),
      themeMode: _theme ?? ThemeMode.system,
      theme: ThemeData(
        brightness: Brightness.light,
        colorScheme: ColorScheme.fromSeed(
            seedColor: const Color.fromARGB(255, 92, 172, 252)),
        useMaterial3: true,
      ),
      home: client != null
          ? islogin != null
              ? islogin!
                  ? const SecondHomePage()
                  : const LoginPage()
              : const LoginPage()
          : const RegistrationPage(),
    );
  }
}
