import 'package:flutter/material.dart';
import 'package:guider/languages/de.dart';
import 'package:guider/languages/en.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';

class AppLocalizationsDelegate extends LocalizationsDelegate<Languages> {
  const AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) => ['en', 'de'].contains(locale.languageCode);

  @override
  Future<Languages> load(Locale locale) => _load(locale);

  static Future<Languages> _load(Locale locale) async {
    switch (locale.languageCode) {
      case 'en':
        logger.i("changed to EN");
        return LanguageEn();
      case 'de':
        logger.i("changed to DE");
        return LanguageDe();
      default:
        return LanguageEn();
    }
  }

  @override
  bool shouldReload(LocalizationsDelegate<Languages> old) => false;
}
