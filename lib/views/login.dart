import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/key_value.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/homepage.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  List<User> users = [];
  User? selectedItem;

  @override
  void initState() {
    super.initState();
    getUsers();
  }

  Future<void> getUsers() async {
    var result = await Singleton().getDatabase().allUserEntries;
    setState(() {
      users = result;
      selectedItem = result[0];
    });
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l = Languages.of(context);
    return Scaffold(
        body: SizedBox(
      width: double.infinity,
      height: double.infinity,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          users.isNotEmpty
              ? SizedBox(
                  width: 300,
                  child: DropdownButtonFormField(
                    isExpanded: true,
                    icon: const Icon(Icons.arrow_drop_down_circle),
                    value: selectedItem,
                    items: users
                        .map((item) => DropdownMenuItem<User>(
                              value: item,
                              child: Text("${l!.user} ${item.id}"),
                            ))
                        .toList(),
                    onChanged: (item) => setState(
                      () {
                        selectedItem = item;
                      },
                    ),
                    decoration: InputDecoration(
                      labelText: l!.users,
                      prefixIcon: const Icon(Icons.format_list_numbered),
                      border: const OutlineInputBorder(),
                    ),
                  ),
                )
              : const CircularProgressIndicator(),
          ElevatedButton(
              onPressed: () {
                KeyValue.setNewUser(selectedItem!.id);
                KeyValue.saveLogin(true);
                currentUser = selectedItem!.id;
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const MyHomePage()),
                );
              },
              child: Text(l!.login))
        ],
      ),
    ));
  }
}
