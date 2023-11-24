import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/constants.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'dart:convert';

class InputFields {
  final String app;
  final String client;
  final String host;

  InputFields({required this.app, required this.client, required this.host});

  @override
  String toString() {
    return "APP: $app, CLIENT: $client, HOST: $host";
  }
}

class Scanner extends StatefulWidget {
  const Scanner({super.key});

  @override
  State<Scanner> createState() => _ScannerState();
}

class _ScannerState extends State<Scanner> {
  @override
  void dispose() {
    super.dispose();
  }

  MobileScannerController cameraController =
      MobileScannerController(detectionSpeed: DetectionSpeed.noDuplicates);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mobile Scanner'),
        actions: [
          IconButton(
            color: Colors.white,
            icon: ValueListenableBuilder(
              valueListenable: cameraController.torchState,
              builder: (context, state, child) {
                switch (state as TorchState) {
                  case TorchState.off:
                    return const Icon(Icons.flash_off, color: Colors.grey);
                  case TorchState.on:
                    return const Icon(Icons.flash_on, color: Colors.yellow);
                }
              },
            ),
            onPressed: () => cameraController.toggleTorch(),
          ),
          IconButton(
            color: Colors.white,
            icon: ValueListenableBuilder(
              valueListenable: cameraController.cameraFacingState,
              builder: (context, state, child) {
                switch (state) {
                  case CameraFacing.front:
                    return const Icon(Icons.camera_front);
                  case CameraFacing.back:
                    return const Icon(Icons.camera_rear);
                }
              },
            ),
            onPressed: () => cameraController.switchCamera(),
          ),
        ],
      ),
      body: MobileScanner(
        controller: cameraController,
        onDetect: (capture) {
          final List<Barcode> barcodes = capture.barcodes;
          final Uint8List? image = capture.image;
          for (final barcode in barcodes) {
            debugPrint('Barcode found! ${barcode.rawValue}');
            if (image != null) {
              try {
                Map<String, dynamic> response = json.decode(barcode.rawValue!);
                String? app = response[Const.app.key];
                String? host = response[Const.host.key];
                String? client = response[Const.client.key];
                if (app == null || host == null || client == null) {
                  throw Exception();
                }
                showDialog(
                    context: context,
                    builder: (context) => Scaffold(
                          body: Column(
                            children: [
                              Text(
                                "App: ${response[Const.app.key]}",
                                style: const TextStyle(
                                    color: Colors.greenAccent, fontSize: 16),
                              ),
                              Text(
                                "Client: ${response[Const.client.key]}",
                                style: const TextStyle(
                                    color: Colors.greenAccent, fontSize: 16),
                              ),
                              Text(
                                "Host: ${response[Const.host.key]}",
                                style: const TextStyle(
                                    color: Colors.greenAccent, fontSize: 16),
                              ),
                              Image(image: MemoryImage(image))
                            ],
                          ),
                        ));
                Future.delayed(const Duration(seconds: 1), () {
                  if (mounted) {
                    Navigator.pop(context);
                    Navigator.pop(context,
                        InputFields(app: app, client: client, host: host));
                  }
                });
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                      content: Text("SOME INFO MISSING OR NOT A VALID JSON")));

                  Navigator.pop(context);
                }
              }
            }
          }
        },
      ),
    );
  }
  // @override
  // Widget build(BuildContext context) {
  //   return Scaffold(
  //     appBar: AppBar(title: const Text('Mobile Scanner')),
  //     body: MobileScanner(
  //       fit: BoxFit.contain,
  //       controller: MobileScannerController(
  //         detectionSpeed: DetectionSpeed.noDuplicates,
  //         // facing: CameraFacing.back,
  //         // torchEnabled: false,
  //         returnImage: true,
  //       ),
  //       onDetect: (capture) {
  //         final List<Barcode> barcodes = capture.barcodes;
  //         final Uint8List? image = capture.image;
  //         for (final barcode in barcodes) {
  //           print('Barcode found! ${barcode.rawValue}');
  //         }
  //         if (image != null) {
  //           showDialog(
  //             context: context,
  //             builder: (context) => Image(image: MemoryImage(image)),
  //           );
  //           Future.delayed(const Duration(seconds: 5), () {
  //             Navigator.pop(context);
  //           });
  //         }
  //       },
  //     ),
  //   );
  // }
}
