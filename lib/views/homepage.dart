import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/helpers/localstorage/realtime.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/history_view.dart';
import 'package:guider/views/instruction_view.dart';
import 'package:guider/views/settings_view.dart';
import 'package:guider/views/home_view.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage>
    with SingleTickerProviderStateMixin {
  late TabController tabController;
  List<User>? users;
  Stream histStream = Realtime.getHistoryStream();
  List<Instruction>? openHistory;
  BuildContext? oldDialogContext;

  onDismiss() {
    if (oldDialogContext != null) {
      Navigator.of(oldDialogContext!).pop();
    }
    oldDialogContext = null;
  }

  @override
  void initState() {
    super.initState();
    tabController = TabController(length: 3, vsync: this);
    tabController.addListener(() {
      setState(() {});
    });
    getUsers();
    initHistoryStream();
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
                              additionalData:
                                  historyEntry.first.additionalData);
                        },
                        fullscreenDialog: true));
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

  @override
  void dispose() {
    tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l = Languages.of(context);
    final List<Tab> myTabs = <Tab>[
      Tab(text: l?.homeTitle, icon: const Icon(Icons.home)),
      Tab(text: l?.settingsTitle, icon: const Icon(Icons.settings)),
      Tab(text: l?.historyTitle, icon: const Icon(Icons.history))
    ];
    return Scaffold(
      appBar: AppBar(
        title: Text("${myTabs[tabController.index].text}"),
        bottom: TabBar(controller: tabController, tabs: myTabs),
      ),
      body: TabBarView(
        controller: tabController,
        children: const [
          //Home(),
          SettingsView(),
          HistoryView(),
        ],
      ),
    );
  }
}
