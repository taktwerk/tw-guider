import 'package:drift_db_viewer/drift_db_viewer.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/app_util.dart';
import 'package:guider/helpers/localstorage/key_value.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/languages/supported_languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/login.dart';

class SettingsView extends StatefulWidget {
  const SettingsView({super.key});

  @override
  State<SettingsView> createState() => _SettingsViewState();
}

class _SettingsViewState extends State<SettingsView> {
  Locale? selectedItem;
  List<Locale> languages = SupportedLanguages.all;
  List<Setting> settings = [];

  final MaterialStateProperty<Icon?> thumbIcon =
      MaterialStateProperty.resolveWith<Icon?>(
    (Set<MaterialState> states) {
      if (states.contains(MaterialState.selected)) {
        return const Icon(Icons.check);
      }
      return const Icon(Icons.close);
    },
  );

  final MaterialStateProperty<Icon?> themeIcon =
      MaterialStateProperty.resolveWith<Icon?>(
    (Set<MaterialState> states) {
      if (states.contains(MaterialState.selected)) {
        return const Icon(Icons.light_mode);
      }
      return const Icon(Icons.dark_mode);
    },
  );

  @override
  Widget build(BuildContext context) {
    var settingsStream = Singleton().getDatabase().getSettings(currentUser!);
    final l = Languages.of(context);
    return ListView(
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(15),
                child: Text(
                  "User $currentUser",
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                    decoration: TextDecoration.underline,
                  ),
                ),
              ),
              StreamBuilder(
                stream: settingsStream,
                builder: (BuildContext context,
                    AsyncSnapshot<List<Setting>> snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const CircularProgressIndicator();
                  } else if (snapshot.connectionState ==
                          ConnectionState.active ||
                      snapshot.connectionState == ConnectionState.done) {
                    if (snapshot.hasError) {
                      return Text('🚨 Error: ${snapshot.error}');
                    } else if (snapshot.hasData && snapshot.data != null) {
                      return Column(
                        children: [
                          SizedBox(
                            width: 300,
                            child: DropdownButtonFormField(
                              isExpanded: true,
                              icon: const Icon(Icons.arrow_drop_down_circle),
                              value: snapshot.hasData
                                  ? snapshot.data!.isEmpty
                                      ? Locale.fromSubtags(
                                          languageCode: l!.languageCode)
                                      : Locale.fromSubtags(
                                          languageCode:
                                              snapshot.data!.first.language)
                                  : Locale.fromSubtags(
                                      languageCode: l!.languageCode),
                              items: languages
                                  .map((item) => DropdownMenuItem<Locale>(
                                        value: item,
                                        child: Text(item.languageCode),
                                      ))
                                  .toList(),
                              onChanged: (item) => onLanguageChange(item),
                              decoration: InputDecoration(
                                labelText: l!.languages,
                                prefixIcon:
                                    const Icon(Icons.format_list_numbered),
                                border: const OutlineInputBorder(),
                              ),
                            ),
                          ),
                          SwitchListTile(
                            title: Text(l.realtime),
                            subtitle: Text(l.realtimeText),
                            thumbIcon: thumbIcon,
                            value: snapshot.data!.isEmpty
                                ? false
                                : snapshot.data!.first.realtime,
                            onChanged: (bool value) {
                              if (snapshot.data!.isNotEmpty) {
                                onRealtimeChange(value);
                              }
                            },
                          ),
                          SwitchListTile(
                            title: const Text("Lightmode/ Darkmode"),
                            thumbIcon: themeIcon,
                            value: snapshot.data!.isEmpty
                                ? true
                                : snapshot.data!.first.lightmode,
                            onChanged: (bool value) {
                              if (snapshot.data!.isNotEmpty) {
                                onThemeChange(value);
                              }
                            },
                          ),
                        ],
                      );
                    } else {
                      return const Text("Empty data");
                    }
                  } else {
                    return Text('State: ${snapshot.connectionState}');
                  }
                },
              ),
              Padding(
                padding: const EdgeInsets.all(5),
                child: ElevatedButton.icon(
                    onPressed: () async {
                      if (!kIsWeb) {
                        await AppUtil.deleteAllImages();
                      }
                      await Singleton().getDatabase().deleteEverything();
                      await KeyValue.resetKeyValues();
                      logger.w("Deleted everything");
                    },
                    icon: const Icon(Icons.delete),
                    label: const Text("DB")),
              ),
              Padding(
                padding: const EdgeInsets.all(5),
                child: ElevatedButton.icon(
                    onPressed: () {
                      final db = Singleton().getDatabase();
                      Navigator.of(context).push(MaterialPageRoute(
                          builder: (context) => DriftDbViewer(db)));
                    },
                    icon: const Icon(Icons.storage),
                    label: const Text("DB")),
              ),
              Padding(
                padding: const EdgeInsets.all(5),
                child: ElevatedButton.icon(
                    style: const ButtonStyle(
                        backgroundColor:
                            MaterialStatePropertyAll<Color>(Colors.red)),
                    onPressed: () async {
                      logger.i("Logged out");
                      currentUser = null;
                      var prefs = await Singleton().getPrefInstance();
                      prefs.remove(KeyValueEnum.currentUser.key);
                      await KeyValue.saveLogin(false)
                          .then((value) => Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => const LoginPage()),
                              ));
                    },
                    icon: Transform.flip(
                      flipX: true,
                      child: const Icon(Icons.logout),
                    ),
                    label: const Text("Logout")),
              ),
            ],
          ),
        )
      ],
    );
  }

  void onLanguageChange(lang) async {
    GuiderApp.setLocale(
        context, Locale.fromSubtags(languageCode: lang.languageCode));
    if (currentUser != null) {
      await Singleton()
          .getDatabase()
          .updateUserLanguage(currentUser!, lang.languageCode);
    }
  }

  Future<void> onRealtimeChange(realtime) async {
    if (currentUser != null) {
      await Singleton()
          .getDatabase()
          .updateUserRealtime(currentUser!, realtime);
    }
  }

  Future<void> onThemeChange(theme) async {
    ThemeMode mode = theme ? ThemeMode.light : ThemeMode.dark;
    GuiderApp.setTheme(context, mode);
    if (currentUser != null) {
      await Singleton().getDatabase().updateUserLightmode(currentUser!, theme);
    }
  }
}
