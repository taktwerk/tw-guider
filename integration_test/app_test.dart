import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:guider/languages/de.dart';
import 'package:guider/languages/en.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart' as app;
import 'package:guider/views/instruction_view.dart';
import 'package:guider/widgets/listitem.dart';
import 'package:integration_test/integration_test.dart';

void main() {
  final binding = IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  const String feedbackEntryText = 'This is an integration test feedback';
  const String instructionTitle = "Breaking and Entering";
  const String user = "User 1";
  const int id = 20;
  String initLanguage = 'en';
  Languages l = initLanguage == 'de' ? LanguageDe() : LanguageEn();

  group('end-to-end test', () {
    Future<void> login(WidgetTester tester) async {
      await tester.pumpAndSettle(const Duration(milliseconds: 1000));

      // Verify that the login button is present
      expect(find.text("Login"), findsOneWidget);

      // Finds the floating action button to tap on.
      final Finder button = find.byKey(const Key("Login"));
      // // Emulate a tap on the floating action button.
      await tester.tap(button);

      // // // Trigger a frame.
      await tester.pumpAndSettle();
    }

    Future<void> setLanguageInApp(WidgetTester tester, String lang) async {
      initLanguage = lang;
      l = initLanguage == 'de' ? LanguageDe() : LanguageEn();
      await tester.pumpAndSettle();

      final settingsTab = find.byIcon(Icons.settings);
      await tester.tap(settingsTab);
      await tester.pumpAndSettle();

      final dropdown = find.byKey(Key("dropdown"));
      await tester.tap(dropdown);
      await tester.pumpAndSettle();
      final dropdownItem = find.text(lang).last;
      await tester.tap(dropdownItem);
      await tester.pumpAndSettle();
    }

    Future<void> listView(WidgetTester tester) async {
      final instructionsTab = find.byIcon(Icons.folder);
      await tester.tap(instructionsTab);
      await tester.pumpAndSettle();
      final listFinder = find.byKey(const Key("listview"));
      final itemFinder = find.byKey(const Key("$id"));

      // NOTE: if performance profiling should be used:
      //   flutter drive \
      // --driver=test_driver/perf_driver.dart \
      // --target=integration_test/app_test.dart \
      // —profile
      // expect(itemFinder, findsOneWidget);
      // await binding.traceAction(
      //   () async {
      //     // Scroll until the item to be found appears.
      //     await tester.dragUntilVisible(itemFinder, listFinder, Offset(0, -100),
      //         maxIteration: 1000);
      //     expect(itemFinder, findsOneWidget);
      //     await tester.tap(itemFinder);
      //     await tester.pumpAndSettle();
      //   },
      //   reportKey: 'scrolling_timeline',
      // );

      await tester.dragUntilVisible(
          itemFinder, listFinder, const Offset(0, -100),
          maxIteration: 1000);
      expect(itemFinder, findsOneWidget);
      await tester.pumpAndSettle();

      await tester.tap(itemFinder);
      await tester.pumpAndSettle();
      expect(find.byType(InstructionView), findsOneWidget);
      expect(find.text(instructionTitle), findsOneWidget);
    }

    Future<void> enterFeedback(WidgetTester tester) async {
      final itemFinder = find.text(l.feedback);
      await tester.pumpAndSettle();

      expect(itemFinder, findsOneWidget);
      await tester.tap(itemFinder);
      await tester.pumpAndSettle();

      await tester.enterText(find.byType(TextField), feedbackEntryText);
      await tester.tap(find.text(l.save));
      await tester.pumpAndSettle();
    }

    Future<void> feedbackView(WidgetTester tester) async {
      final itemFinder = find.byTooltip(l.feedback);
      await tester.tap(itemFinder);
      await tester.pumpAndSettle();

      final listFinder = find.byKey(const Key("listview_feedback"));
      final itemFeedbackEntry = find.text(feedbackEntryText);
      await tester.dragUntilVisible(
          itemFeedbackEntry, listFinder, Offset(0, -50),
          maxIteration: 1000);
      expect(itemFeedbackEntry, findsOneWidget);
      await tester.pumpAndSettle();
    }

    Future<void> feedbackDelete(WidgetTester tester) async {
      final itemFinder = find.byIcon(Icons.delete).at(0);
      await tester.tap(itemFinder);
      await tester.pumpAndSettle();
      await Future.delayed(const Duration(seconds: 2));
      final confirmButton = find.text(l.confirm);
      final itemFeedbackEntry = find.text(feedbackEntryText);
      await tester.tap(confirmButton);
      await tester.pumpAndSettle();

      await Future.delayed(const Duration(seconds: 3));
      expect(itemFeedbackEntry, findsNothing);
      await tester.pumpAndSettle();
    }

    Future<void> history(WidgetTester tester) async {
      await tester.tap(find.byTooltip(l.back));
      await tester.pumpAndSettle();
      await tester.tap(find.text(l.instructionSteps));
      await tester.pumpAndSettle();
      await tester.tap(find.byTooltip(l.back));

      final historyTab = find.text(l.historyTitle);
      await tester.tap(historyTab);
      await tester.pumpAndSettle();

      Text test = tester.firstWidget(find.descendant(
        of: find.byType(ListItem).at(0),
        matching: find.byKey(const Key("listitem_title")),
      ));
      expect(test.data, instructionTitle);
      await tester.pumpAndSettle();
      await Future.delayed(const Duration(seconds: 2));
    }

    Future<void> settings(WidgetTester tester) async {
      await setLanguageInApp(tester, 'de');
      expect(find.text(l.settingsTitle).first, findsOneWidget);
      expect(find.text(user), findsOneWidget);
    }

    testWidgets('All tests', (tester) async {
      app.main();
      await setLanguageInApp(tester, initLanguage);

      // NOTE: do not use the login test if already logged in on macos

      //await login(tester);
      await listView(tester);
      await enterFeedback(tester);
      await feedbackView(tester);
      await feedbackDelete(tester);
      await history(tester);
      await settings(tester);
    });
  });
}
