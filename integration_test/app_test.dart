import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:guider/main.dart' as app;
import 'package:guider/views/instruction_view.dart';
import 'package:integration_test/integration_test.dart';

void main() {
  final binding = IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('end-to-end test', () {
    Future<void> login(WidgetTester tester) async {
      app.main();
      await tester.pumpAndSettle(Duration(milliseconds: 1000));

      // Verify that the login button is present
      expect(find.text("Login"), findsOneWidget);

      // Finds the floating action button to tap on.
      final Finder button = find.byKey(const Key("Login"));
      // // Emulate a tap on the floating action button.
      await tester.tap(button);

      // // // Trigger a frame.
      await tester.pumpAndSettle();
    }

    Future<void> listView(WidgetTester tester) async {
      final listFinder = find.byKey(const Key("listview"));
      final itemFinder = find.byKey(const Key("20"));

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

      await tester.dragUntilVisible(itemFinder, listFinder, Offset(0, -50),
          maxIteration: 1000);
      expect(itemFinder, findsOneWidget);
      await tester.pumpAndSettle();

      await tester.tap(itemFinder);
      await tester.pumpAndSettle();
      expect(find.byType(InstructionView), findsOneWidget);
      expect(find.text("Breaking and Entering"), findsOneWidget);
    }

    testWidgets('Login', (tester) async {
      // NOTE: do not use the login test if already logged in on macos
      await login(tester);
      await listView(tester);
    });
  });
}
