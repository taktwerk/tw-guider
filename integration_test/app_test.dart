import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:guider/main.dart' as app;
import 'package:integration_test/integration_test.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('end-to-end test', () {
    testWidgets('Login', (tester) async {
      app.main();
      await tester.pumpAndSettle(Duration(milliseconds: 1000));

      // Verify that the login button is present
      expect(find.text("Login"), findsOneWidget);

      // Finds the floating action button to tap on.
      final Finder button = find.byKey(const Key("Login"));
      // // Emulate a tap on the floating action button.
      await tester.tap(button);

      // // Trigger a frame.
      await tester.pumpAndSettle();
    });
  });
}
