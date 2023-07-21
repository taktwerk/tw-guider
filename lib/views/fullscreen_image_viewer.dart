import 'package:flutter/material.dart';

class FullScreenImageViewer extends StatelessWidget {
  const FullScreenImageViewer(this.url, {Key? key}) : super(key: key);
  final String url;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GestureDetector(
        child: SizedBox(
          width: MediaQuery.of(context).size.width,
          height: MediaQuery.of(context).size.height,
          child: Hero(
            tag: 'imageHero',
            child: Image.network(url, fit: BoxFit.contain),
          ),
        ),
        onTap: () {
          Navigator.pop(context);
        },
      ),
    );
  }
}
