import 'dart:async';
import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/key_value.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/helpers/localstorage/realtime.dart';
import 'package:guider/helpers/localstorage/supabase_to_drift.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/history_view.dart';
import 'package:guider/views/instruction_view.dart';
import 'package:guider/views/scanner.dart';
import 'package:guider/views/settings_view.dart';
import 'package:guider/views/home_view.dart';
import 'package:drift_db_viewer/drift_db_viewer.dart';
import 'package:guider/views/user_feedback_view.dart';

class SecondHomePage extends StatefulWidget {
  const SecondHomePage({super.key});

  @override
  State<SecondHomePage> createState() => _SecondHomePageState();
}

class _SecondHomePageState extends State<SecondHomePage>
    with SingleTickerProviderStateMixin {
  User? user;
  int _pageIndex = 0;
  Stream histStream = Realtime.getHistoryStream();
  List<Instruction>? openHistory;
  BuildContext? oldDialogContext;
  StreamSubscription? subscription;
  StreamSubscription? syncedSubscription;

  @override
  void initState() {
    super.initState();
    getUsers();
    initHistoryStream();
    initSyncedStream();
  }

  void initSyncedStream() async {
    var lastSyncedSetting = await KeyValue.getValue(KeyValueEnum.setting.key);
    var lastSyncedFeedback = await KeyValue.getValue(KeyValueEnum.feedback.key);
    var lastSyncedHistory = await KeyValue.getValue(KeyValueEnum.history.key);
    syncedSubscription = Singleton()
        .getDatabase()
        .areTablesSynched(
            DateTime.parse(lastSyncedSetting!),
            DateTime.parse(lastSyncedFeedback!),
            DateTime.parse(lastSyncedHistory!))
        .listen((event) {
      logger.w("Was synced? $event");
      Singleton().setIsSynced(newSyncing: event.first);
    });
  }

  onDismiss() {
    if (oldDialogContext != null) {
      Navigator.of(oldDialogContext!).pop();
    }
    oldDialogContext = null;
  }

  Future getUsers() async {
    var result = await Singleton().getDatabase().getUserById(currentUser!);
    setState(() {
      user = result.firstOrNull;
    });
  }

  void initHistoryStream() {
    subscription = histStream.listen(
      (event) async {
        await Realtime.sync();
        if (currentUser != null) {
          var newestMostRecent = await Singleton()
              .getDatabase()
              .getInstructionToOpen(currentUser!);
          if (newestMostRecent.isNotEmpty) {
            if (oldDialogContext != null) {
              onDismiss();
            }
            var historyEntry = await Singleton()
                .getDatabase()
                .getUserHistory(currentUser!, newestMostRecent.first.id);
            if (mounted) {
              bool? results =
                  await Navigator.of(context).push(MaterialPageRoute<bool>(
                builder: (BuildContext dialogContext) {
                  oldDialogContext = dialogContext;
                  return InstructionView(
                      instruction: newestMostRecent.first,
                      open: true,
                      additionalData: historyEntry.first.additionalData);
                },
                fullscreenDialog: true,
              ));
              if (results != null && !results) {
                oldDialogContext = null;
              }
            }
          }
        }
      },
      onError: (e, s) {
        if (e.toString() == '' || e.toString() == '{}') return;
      },
    );
  }

  @override
  void dispose() {
    syncedSubscription?.cancel();
    subscription?.cancel();
    super.dispose();
  }

  void _onSyncButtonClick() async {
    if (!Singleton().getSyncing()) {
      try {
        await SupabaseToDrift.sync();
      } catch (e) {
        await Singleton().setSyncing(newSyncing: false);
        logger.e("Exception: $e");
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final l = Languages.of(context);

    final List<String> myTabs2 = <String>[
      l?.instructionsTitle ?? '',
      l?.historyTitle ?? '',
      l?.settingsTitle ?? '',
    ];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(myTabs2[_pageIndex]),
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.qr_code_scanner),
            tooltip: 'Scanner',
            onPressed: () {
              Navigator.of(context)
                  .push(MaterialPageRoute(builder: (context) => Scanner()));
            },
          ),
          IconButton(
            icon: const Icon(Icons.feedback),
            tooltip: 'Feedback',
            onPressed: () {
              Navigator.of(context).push(MaterialPageRoute(
                  builder: (context) => const UserFeedbackView()));
            },
          ),
          Visibility(
            visible: user != null ? user!.role == "admin" : false,
            child: IconButton(
              icon: const Icon(Icons.storage),
              tooltip: 'DB',
              onPressed: () {
                final db = Singleton().getDatabase();
                Navigator.of(context).push(
                    MaterialPageRoute(builder: (context) => DriftDbViewer(db)));
              },
            ),
          ),
          ValueListenableBuilder<bool>(
              valueListenable: Singleton().getValueNotifierSyncing(),
              builder: ((context, syncing, child) {
                return ValueListenableBuilder(
                    valueListenable: Singleton().getValueNotifierIsSynced(),
                    builder: ((context, isSynced, child) {
                      return syncing
                          ? Container(
                              padding: const EdgeInsets.all(2.0),
                              child: Transform.scale(
                                scale: 0.5,
                                child: CircularProgressIndicator(
                                  color: isSynced ? Colors.white : Colors.red,
                                  strokeWidth: 3,
                                ),
                              ))
                          : IconButton(
                              color: isSynced ? Colors.white : Colors.red,
                              icon: const Icon(Icons.sync),
                              tooltip: 'Sync',
                              onPressed: () => _onSyncButtonClick(),
                            );
                    }));
              })),
        ],
      ),
      body: SafeArea(
        child: IndexedStack(
          index: _pageIndex,
          children: const <Widget>[
            NavigatorPage(
              child: Home(),
            ),
            NavigatorPage(
              child: HistoryView(),
            ),
            NavigatorPage(
              child: SettingsView(),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        items: <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: const Icon(Icons.folder),
            label: l?.instructionsTitle,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.history),
            label: l?.historyTitle,
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.settings),
            label: l?.settingsTitle,
          ),
        ],
        currentIndex: _pageIndex,
        onTap: (int index) {
          setState(
            () {
              _pageIndex = index;
            },
          );
        },
      ),
    );
  }
}

class NavigatorPage extends StatefulWidget {
  const NavigatorPage({super.key, required this.child});

  final Widget child;

  @override
  State<NavigatorPage> createState() => _NavigatorPageState();
}

class _NavigatorPageState extends State<NavigatorPage> {
  @override
  Widget build(BuildContext context) {
    return Navigator(onGenerateRoute: (RouteSettings settings) {
      return MaterialPageRoute(
          settings: settings,
          builder: (BuildContext context) {
            return widget.child;
          });
    });
  }
}
