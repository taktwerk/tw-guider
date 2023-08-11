import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/key_value.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/history_view.dart';
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
  //TODO: add language specific text
  final List<Tab> myTabs = <Tab>[
    const Tab(text: 'Home', icon: Icon(Icons.home)),
    const Tab(text: 'Settings', icon: Icon(Icons.settings)),
    const Tab(text: "History", icon: Icon(Icons.history))
  ];
  List<User>? users;

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

  Widget getUserPopup() => PopupMenuButton(
      itemBuilder: (context) => users != null
          ? List.generate(
              users!.length,
              (index) => PopupMenuItem(
                    onTap: () {
                      setState(() {
                        currentUser = users![index].id;
                        KeyValue.setNewUser(users![index].id);
                      });
                      logger.i("Selected user $currentUser");
                    },
                    child: Text("User ${users![index].id}"),
                  ))
          : [const PopupMenuItem(child: CircularProgressIndicator())]);
}
