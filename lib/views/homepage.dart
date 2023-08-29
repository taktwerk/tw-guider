import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/key_value.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/helpers/localstorage/realtime.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/history_view.dart';
import 'package:guider/views/instruction_view.dart';
import 'package:guider/views/login.dart';
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
  final usersStream = Singleton().getDatabase().allUserEntriesAsStream;
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
  }

  Future getUsers() async {
    histStream.listen(
      (event) async {
        await Realtime.sync();
        if (currentUser != null) {
          var newestMostRecent = await Singleton()
              .getDatabase()
              .getInstructionToOpen(currentUser!);
          logger.w("GOT EVENT");

          if (mounted) {
            if (newestMostRecent.isNotEmpty) {
              if (oldDialogContext != null) {
                onDismiss();
              }
              logger.w("EVENT $newestMostRecent");
              bool? results =
                  await Navigator.of(context).push(MaterialPageRoute<bool>(
                      builder: (BuildContext dialogContext) {
                        oldDialogContext = dialogContext;
                        return InstructionView(
                            instruction: newestMostRecent.first, open: true);
                      },
                      fullscreenDialog: true));
              if (results != null && !results) {
                oldDialogContext = null;
              }
            }
          }
        }
      },
      onError: (e, s) {
        //logger.e('realtime 1 error: $e \ns:$s');
        if (e.toString() == '' || e.toString() == '{}') return;
      },
    );
    var result = await Singleton().getDatabase().allUserEntries;
    setState(() {
      users = result;
    });
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
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text("${myTabs[tabController.index].text}"),
        bottom: TabBar(controller: tabController, tabs: myTabs),
        actions: [getUserPopup()],
      ),
      body: TabBarView(
        controller: tabController,
        children: const [
          Home(),
          SettingsView(),
          HistoryView(),
        ],
      ),
    );
  }

  Widget getUserPopup() {
    return StreamBuilder(
        stream: usersStream,
        builder: (BuildContext context, AsyncSnapshot<List<User>> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const CircularProgressIndicator();
          } else if (snapshot.connectionState == ConnectionState.active ||
              snapshot.connectionState == ConnectionState.done) {
            if (snapshot.hasError) {
              return Text('🚨 Error: ${snapshot.error}');
            } else if (snapshot.hasData) {
              return PopupMenuButton(
                itemBuilder: (context) => List.generate(
                    snapshot.data!.length + 1,
                    (index) => index != snapshot.data!.length
                        ? PopupMenuItem(
                            onTap: () {
                              setState(() {
                                currentUser = snapshot.data![index].id;
                                KeyValue.setCurrentUser(
                                    snapshot.data![index].id);
                              });
                              logger.i("Selected user $currentUser");
                            },
                            child: Center(
                                child:
                                    Text("User ${snapshot.data![index].id}")),
                          )
                        : PopupMenuItem(
                            child: Center(
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(Languages.of(context)!.logout),
                                  const Icon(Icons.logout),
                                ],
                              ),
                            ),
                            onTap: () async {
                              logger.i("Logged out");
                              currentUser = null;
                              var prefs = await Singleton().getPrefInstance();
                              prefs.remove(KeyValueEnum.currentUser.key);
                              await KeyValue.saveLogin(false)
                                  .then((value) => Navigator.pushReplacement(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) =>
                                                const LoginPage()),
                                      ));
                            },
                          )),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10)),
              );
            } else {
              return const Text("Empty data");
            }
          } else {
            return Text('State: ${snapshot.connectionState}');
          }
        });
  }
}
