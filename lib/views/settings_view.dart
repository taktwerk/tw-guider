import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/languages/supported_languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';

class SettingsView extends ConsumerStatefulWidget {
  const SettingsView({super.key});

  @override
  ConsumerState<SettingsView> createState() => _SettingsViewState();
}

class _SettingsViewState extends ConsumerState<SettingsView> {
  Locale? selectedItem;
  List<Locale> languages = SupportedLanguages.all;
  List<Setting> settings = [];

  @override
  Widget build(BuildContext context) {
    final database = ref.watch(todoDBProvider);
    var settingsStream = database.getSettings(currentUser!);
    final l = Languages.of(context);
    return Container(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          StreamBuilder(
            stream: settingsStream,
            builder:
                (BuildContext context, AsyncSnapshot<List<Setting>> snapshot) {
              return SizedBox(
                width: 300,
                child: DropdownButtonFormField(
                  isExpanded: true,
                  icon: const Icon(Icons.arrow_drop_down_circle),
                  value: snapshot.hasData
                      ? snapshot.data!.isEmpty
                          ? Locale.fromSubtags(languageCode: l!.languageCode)
                          : Locale.fromSubtags(
                              languageCode: snapshot.data!.first.language)
                      : Locale.fromSubtags(languageCode: l!.languageCode),
                  items: languages
                      .map((item) => DropdownMenuItem<Locale>(
                            value: item,
                            child: Text(item.languageCode),
                          ))
                      .toList(),
                  onChanged: (item) => onClick(item),
                  decoration: InputDecoration(
                    labelText: l!.languages,
                    prefixIcon: const Icon(Icons.format_list_numbered),
                    border: const OutlineInputBorder(),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  void onClick(lang) async {
    GuiderApp.setLocale(
        context, Locale.fromSubtags(languageCode: lang.languageCode));
    if (currentUser != null) {
      await Singleton()
          .getDatabase()
          .updateUserSettings(currentUser!, lang.languageCode);
    }
  }
}
