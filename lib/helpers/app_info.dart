import 'package:flutter/services.dart';
import 'package:guider/main.dart';
import 'package:yaml/yaml.dart';

Future<AppInfo> appInformation() async {
  final yamlString = await rootBundle.loadString("pubspec.yaml");
  final parsedYaml = loadYaml(yamlString);
  final deviceID = await getDeviceId();
  return AppInfo(
      version: parsedYaml['version'],
      name: parsedYaml['name'],
      deviceID: deviceID ?? "");
}

class AppInfo {
  final String version;
  final String name;
  final String deviceID;
  AppInfo({required this.version, required this.name, required this.deviceID});
}
