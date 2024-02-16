import 'dart:async';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/device_info.dart';
import 'package:guider/helpers/localstorage/key_value.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/helpers/localstorage/realtime.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/cancellation.dart';
import 'package:guider/objects/scanner.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/code_scanner.dart';
import 'package:guider/views/history_view.dart';
import 'package:guider/views/instruction_view.dart';
import 'package:guider/views/settings_view.dart';
import 'package:guider/views/home_view.dart';
import 'package:drift_db_viewer/drift_db_viewer.dart';
import 'package:guider/views/user_feedback_view.dart';
import 'package:guider/views/syncing_status.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:provider/provider.dart';

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
  String? scannerResponse;
  bool scanning = false;

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
      // set syncStatus to pending when currently not syncing and the database has returned a valid value of "false"
      if (!Singleton().getSyncing() && event.isNotEmpty && !event.first) {
        Singleton().setSyncStatus(newStatus: SyncStatus.pendingSync);
      }
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
    Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => SyncingStatus()),
    );
    // if (!Singleton().getSyncing()) {
    //   try {
    //     await SupabaseToDrift.sync();
    //   } catch (e) {
    //     await Singleton().setSyncing(newSyncing: false);
    //     logger.e("Exception: $e");
    //   }
    // }
  }

  bool isDevice() {
    return Platform.isAndroid || Platform.isIOS;
  }

  @override
  Widget build(BuildContext context) {
    final l = Languages.of(context);
    final scanModel = Provider.of<ScanModel>(context, listen: false);
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
          Visibility(
            visible: !kIsWeb && isDevice() ? true : false,
            child: IconButton(
              icon: const Icon(Icons.qr_code_scanner),
              tooltip: 'Scanner',
              onPressed: () async {
                scannerResponse =
                    await Navigator.of(context).push(MaterialPageRoute(
                        builder: (context) => CodeScanner(
                              onDetect: (capture) {
                                if (!scanning) {
                                  scanning = true;
                                  final List<Barcode> barcodes =
                                      capture.barcodes;
                                  final barcode = barcodes.firstOrNull;
                                  if (barcode != null) {
                                    debugPrint(
                                        'Barcode found! ${barcode.rawValue}');
                                    try {
                                      String response = barcode.rawValue ?? "";
                                      if (mounted) {
                                        Navigator.pop(context, response);
                                      }
                                    } catch (e) {
                                      if (mounted) {
                                        ScaffoldMessenger.of(context)
                                            .showSnackBar(const SnackBar(
                                                content: Text(
                                                    "SOME INFO MISSING OR NOT A VALID JSON")));

                                        Navigator.pop(context);
                                      }
                                    }
                                  } else {
                                    logger.w('No barcodes found.');
                                  }
                                }
                              },
                            )));
                setState(() {
                  if (scannerResponse != null) {
                    scanModel.updateText(scannerResponse!);
                  }

                  Future.delayed(const Duration(seconds: 3), () {
                    scanning = false;
                  });
                });
              },
            ),
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
          ValueListenableBuilder(
              valueListenable: Singleton().getValueNotifierSyncStatus(),
              builder: ((context, syncStatus, child) {
                return syncStatus == SyncStatus.runningSync
                    ? InkWell(
                        onTap: () => _onSyncButtonClick(),
                        child: Container(
                            padding: const EdgeInsets.all(2.0),
                            child: Transform.scale(
                              scale: 0.5,
                              child: const CircularProgressIndicator(
                                strokeWidth: 3,
                              ),
                            )),
                      )
                    : IconButton(
                        color: syncStatus == SyncStatus.pendingSync
                            ? Colors.red
                            : Colors.white,
                        icon: const Icon(Icons.sync),
                        tooltip: 'Sync',
                        onPressed: () => _onSyncButtonClick(),
                      );
              }))
        ],
      ),
      body: SafeArea(
        child: IndexedStack(
          index: _pageIndex,
          children: <Widget>[
            NavigatorPage(
              child: Home(
                scanNotifier: scanModel,
              ),
            ),
            const NavigatorPage(
              child: HistoryView(),
            ),
            const NavigatorPage(
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
