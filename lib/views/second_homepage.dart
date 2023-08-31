import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/helpers/localstorage/realtime.dart';
import 'package:guider/helpers/localstorage/supabase_to_drift.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/history_view.dart';
import 'package:guider/views/instruction_view.dart';
import 'package:guider/views/settings_view.dart';
import 'package:guider/views/home_view.dart';
import 'package:drift_db_viewer/drift_db_viewer.dart';

class SecondHomePage extends StatefulWidget {
  const SecondHomePage({super.key});

  @override
  State<SecondHomePage> createState() => _SecondHomePageState();
}

class _SecondHomePageState extends State<SecondHomePage>
    with SingleTickerProviderStateMixin {
  List<User>? users;
  int _pageIndex = 0;
  Stream histStream = Realtime.getHistoryStream();
  List<Instruction>? openHistory;
  BuildContext? oldDialogContext;

  @override
  void initState() {
    super.initState();
    getUsers();
    initHistoryStream();
  }

  onDismiss() {
    if (oldDialogContext != null) {
      Navigator.of(oldDialogContext!).pop();
    }
    oldDialogContext = null;
  }

  Future getUsers() async {
    var result = await Singleton().getDatabase().allUserEntries;
    setState(() {
      users = result;
    });
  }

  void initHistoryStream() {
    histStream.listen(
      (event) async {
        await Realtime.sync();
        if (currentUser != null) {
          var newestMostRecent = await Singleton()
              .getDatabase()
              .getInstructionToOpen(currentUser!);
          if (mounted) {
            if (newestMostRecent.isNotEmpty) {
              if (oldDialogContext != null) {
                onDismiss();
              }
              var historyEntry = await Singleton()
                  .getDatabase()
                  .getUserHistory(currentUser!, newestMostRecent.first.id);
              logger.w("EVENT $newestMostRecent");
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
        }
      },
      onError: (e, s) {
        if (e.toString() == '' || e.toString() == '{}') return;
      },
    );
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
            icon: const Icon(Icons.search),
            tooltip: 'Search',
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.storage),
            tooltip: 'DB',
            onPressed: () {
              final db = Singleton().getDatabase();
              Navigator.of(context).push(
                  MaterialPageRoute(builder: (context) => DriftDbViewer(db)));
            },
          ),
          ValueListenableBuilder<bool>(
              valueListenable: Singleton().getValueNotifierSyncing(),
              builder: ((context, value, child) {
                return value
                    ? Container(
                        padding: const EdgeInsets.all(2.0),
                        child: Transform.scale(
                          scale: 0.5,
                          child: const CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 3,
                          ),
                        ))
                    : IconButton(
                        icon: const Icon(Icons.sync),
                        tooltip: 'Sync',
                        onPressed: () => _onSyncButtonClick(),
                      );
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
