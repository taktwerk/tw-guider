import 'dart:io';
import 'package:android_id/android_id.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:guider/main.dart';

class DeviceInfo {
  static bool isLargeScreen(context) {
    if (MediaQuery.sizeOf(context).shortestSide > 600) {
      return true;
    } else {
      return false;
    }
  }

  static bool landscapeAllowed(context) {
    if (isLargeScreen(context)) {
      return true;
    } else {
      return false;
    }
  }

  static bool inTabletLayout(context) {
    if (landscapeAllowed(context) &&
        MediaQuery.orientationOf(context) == Orientation.landscape) {
      return true;
    } else {
      return false;
    }
  }

  static Future<String?> getDeviceId() async {
    String? deviceId;

    try {
      final DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();

      if (kIsWeb) {
        final webBrowserInfo = await deviceInfo.webBrowserInfo;

        deviceId =
            '${webBrowserInfo.vendor ?? '-'} + ${webBrowserInfo.userAgent ?? '-'} + ${webBrowserInfo.hardwareConcurrency.toString()}';
      } else if (Platform.isAndroid) {
        const androidId = AndroidId();

        deviceId = await androidId.getId();
      } else if (Platform.isIOS) {
        final iosInfo = await deviceInfo.iosInfo;

        deviceId = iosInfo.identifierForVendor;
      } else if (Platform.isLinux) {
        final linuxInfo = await deviceInfo.linuxInfo;

        deviceId = linuxInfo.machineId;
      } else if (Platform.isWindows) {
        final windowsInfo = await deviceInfo.windowsInfo;

        deviceId = windowsInfo.deviceId;
      } else if (Platform.isMacOS) {
        final macOsInfo = await deviceInfo.macOsInfo;

        deviceId = macOsInfo.systemGUID;
      }
    } on PlatformException {
      logger.e('Error: Failed to get platform version.');
    }
    logger.i("DEVICE ID: $deviceId");
    return deviceId;
  }
}
