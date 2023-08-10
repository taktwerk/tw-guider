import 'package:flutter/material.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';

class SettingsView extends StatefulWidget {
  const SettingsView({super.key});

  @override
  State<StatefulWidget> createState() => _SettingsViewState();
}

class _SettingsViewState extends State<SettingsView> {
  @override
  Widget build(BuildContext context) {
    final l = Languages.of(context);
    return Column(
      children: [
        Text(l!.settingsTitle),
        ElevatedButton(
            onPressed: () {
              GuiderApp.setLocale(
                  context, const Locale.fromSubtags(languageCode: 'de'));
              setState(() {});
            },
            child: const Text("DE")),
        ElevatedButton(
            onPressed: () {
              GuiderApp.setLocale(
                  context, const Locale.fromSubtags(languageCode: 'en'));
              setState(() {});
            },
            child: const Text("EN"))
      ],
    );
  }
}
