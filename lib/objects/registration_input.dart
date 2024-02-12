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
