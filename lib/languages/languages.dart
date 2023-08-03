import 'package:flutter/material.dart';
// import 'package:guider/languages/de.dart';
// import 'package:guider/languages/en.dart';

abstract class Languages {
  static Languages? of(BuildContext context) {
    return Localizations.of<Languages>(context, Languages);
  }

  String get languageCode;
  String get homeTitle;
  String get settingsTitle;
  String get historyTitle;
  String get labelSelectLanguage;
  String get categorieButtonText;
  String get steps;
  String get step;
  String get lastUpdate;
  String get instructionSteps;
  String get feedback;
  String get feedbackContent;
  String get noImageSelected;
  String get imageSelected;
  String get chooseImage;
  String get cancel;
  String get send;
  String get fromGallery;
  String get takeImage;
  String get description;
  String get shortTitle;
  String get back;
  String get next;
  String get done;
  String get pleaseEnterValue;
  String get search;
}