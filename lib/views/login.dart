import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/key_value.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/helpers/localstorage/supabase_to_drift.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/second_homepage.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  List<User>? users;
  User? selectedItem;

  @override
  void initState() {
    super.initState();
    getUsers();
  }

  Future<void> getUsers() async {
    // TODO: check connectivity
    try {
      await SupabaseToDrift.initializeUsers();
      await SupabaseToDrift.initializeSettings();
    } catch (e) {
      var usersResult = await Singleton().getDatabase().allUserEntries;

      setState(() {
        users = usersResult;
        selectedItem = usersResult.firstOrNull;
      });
    }

    var result = await Singleton().getDatabase().allUserEntries;
    if (mounted) {
      setState(() {
        users = result;
        selectedItem = result.firstOrNull;
      });
    }
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
          users != null
              ? users!.isNotEmpty
                  ? SizedBox(
                      width: 300,
                      child: DropdownButtonFormField(
                        isExpanded: true,
                        icon: const Icon(Icons.arrow_drop_down_circle),
                        value: selectedItem,
                        items: users!
                            .map((item) => DropdownMenuItem<User>(
                                  value: item,
                                  child: Text(
                                      "${item.username} (${item.role}, ID: ${item.id})"),
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
                  : const Text("No users available")
              : const CircularProgressIndicator(),
          ElevatedButton(
              key: const Key("Login"),
              onPressed: () {
                if (users != null) {
                  if (users!.isNotEmpty) {
                    KeyValue.setCurrentUser(selectedItem!.id);
                    KeyValue.saveLogin(true);
                    currentUser = selectedItem!.id;
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const SecondHomePage()),
                    );
                  }
                }
              },
              child: Text(l!.login))
        ],
      ),
    ));
  }
}
