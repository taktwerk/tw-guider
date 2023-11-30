import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/drift_to_supabase.dart';
import 'package:guider/helpers/localstorage/key_value.dart';
import 'package:guider/helpers/localstorage/supabase_to_drift.dart';
import 'package:guider/main.dart';
import 'package:guider/views/login.dart';
import 'dart:io' show Platform;

import 'package:guider/views/scanner.dart';

class RegistrationPage extends StatefulWidget {
  const RegistrationPage({super.key});

  @override
  State<RegistrationPage> createState() => _RegistrationPageState();
}

class _RegistrationPageState extends State<RegistrationPage> {
  final appController = TextEditingController();
  final clientController = TextEditingController();
  final hostController = TextEditingController();
  InputFields? scannerResponse;
  @override
  void initState() {
    super.initState();
  }

  Future<void> getUsers() async {}

  bool isDevice() {
    return Platform.isAndroid || Platform.isIOS;
  }

  Future<void> validateForm() async {
    // NOTE: check if combination exists in supabase. If yes, save client locally, register device on supabase and push to login page with users
    try {
      String app = appController.text;
      String client = clientController.text;
      String host = hostController.text;
      if (app == "guider" &&
          await SupabaseToDrift.clientUsersAvailable(client)) {
        String? deviceId = await getDeviceId();
        if (deviceId != null) {
          await KeyValue.saveClient(client);
          await DriftToSupabase.registerDevice(deviceId);
          if (!mounted) return;
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const LoginPage()),
          );
        }
      } else {
        if (!mounted) return;
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text("Invalid input.")));
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text("Could not validate registration form")));
      logger.e("Could not validate registration form");
    }
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: const Text("Registration Page")),
        body: SingleChildScrollView(
          child: Column(
            children: [
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
                child: TextField(
                  controller: appController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'App',
                  ),
                ),
              ),
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
                child: TextField(
                  controller: clientController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Client',
                  ),
                ),
              ),
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
                child: TextField(
                  controller: hostController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Host',
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(5),
                child: ElevatedButton(
                    onPressed: () {
                      validateForm();
                    },
                    child: Text("Register")),
              ),
              Padding(
                padding: const EdgeInsets.all(5),
                child: Visibility(
                  visible: !kIsWeb && isDevice() ? true : false,
                  child: IconButton(
                    icon: const Icon(Icons.qr_code_scanner),
                    tooltip: 'Scanner',
                    onPressed: () async {
                      scannerResponse = await Navigator.of(context).push(
                          MaterialPageRoute(
                              builder: (context) => const Scanner()));
                      setState(() {
                        if (scannerResponse != null) {
                          appController.text = scannerResponse!.app;
                          clientController.text = scannerResponse!.client;
                          hostController.text = scannerResponse!.host;
                          validateForm();
                        }
                        logger.i("Scanner response: $scannerResponse");
                      });
                    },
                  ),
                ),
              )
            ],
          ),
        ));
  }
}
