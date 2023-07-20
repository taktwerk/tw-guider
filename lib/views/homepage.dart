import 'package:flutter/material.dart';
import 'package:guider/views/history_view.dart';
import 'package:guider/views/settings_view.dart';
import 'package:guider/views/home_view.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage>
    with SingleTickerProviderStateMixin {
  late TabController tabController;
  final List<Tab> myTabs = <Tab>[
    const Tab(text: 'Home', icon: Icon(Icons.home)),
    const Tab(text: 'Settings', icon: Icon(Icons.settings)),
    const Tab(text: "History", icon: Icon(Icons.history))
  ];

  @override
  void initState() {
    super.initState();
    tabController = TabController(length: 3, vsync: this);
    tabController.addListener(() {
      setState(() {});
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
      ),
      body: TabBarView(
          controller: tabController,
          children: const [Home(), Settings(), History()]),
    );
  }
}
