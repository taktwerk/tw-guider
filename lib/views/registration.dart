import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/app_info.dart';
import 'package:guider/helpers/constants.dart';
import 'package:guider/helpers/device_info.dart';
import 'package:guider/helpers/localstorage/drift_to_supabase.dart';
import 'package:guider/helpers/localstorage/key_value.dart';
import 'package:guider/helpers/localstorage/supabase_to_drift.dart';
import 'package:guider/main.dart';
import 'package:guider/views/code_scanner.dart';
import 'package:guider/views/login.dart';
import 'dart:io' show Platform;

import 'package:guider/objects/registration_input.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

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
  bool scanning = false;
  @override
  void initState() {
    super.initState();
  }

  Future<void> getUsers() async {}

  Future<void> validateForm() async {
    // NOTE: check if combination exists in supabase. If yes, save client locally, register device on supabase and push to login page with users
    try {
      String app = appController.text;
      String client = clientController.text;
      String host = hostController.text;
      AppInfo appInfo = await appInformation();
      if (app == appInfo.name &&
          await SupabaseToDrift.clientUsersAvailable(client)) {
        if (appInfo.deviceID != "") {
          await KeyValue.saveClient(client);
          await DriftToSupabase.registerDevice(appInfo.deviceID);
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
                    child: const Text("Register")),
              ),
              Padding(
                padding: const EdgeInsets.all(5),
                child: Visibility(
                  visible:
                      (kIsWeb || DeviceInfo.isDevice() || DeviceInfo.isMacOS())
                          ? true
                          : false,
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
                                              'Barcode found! (REGISTRATION) ${barcode.rawValue}');
                                          try {
                                            Map<String, dynamic> response =
                                                json.decode(barcode.rawValue!);
                                            String? app =
                                                response[Const.app.key];
                                            String? host =
                                                response[Const.host.key];
                                            String? client =
                                                response[Const.client.key];
                                            if (app == null ||
                                                host == null ||
                                                client == null) {
                                              throw Exception();
                                            }

                                            if (mounted) {
                                              Navigator.pop(
                                                  context,
                                                  InputFields(
                                                      app: app,
                                                      client: client,
                                                      host: host));
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
                          appController.text = scannerResponse!.app;
                          clientController.text = scannerResponse!.client;
                          hostController.text = scannerResponse!.host;
                          validateForm();
                        }
                        Future.delayed(const Duration(seconds: 3), () {
                          scanning = false;
                        });

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
