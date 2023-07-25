import 'package:flutter/material.dart';

class TagContainer extends StatelessWidget {
  final Widget child;

  const TagContainer({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
        margin: const EdgeInsets.only(left: 8, bottom: 8, right: 8),
        decoration: BoxDecoration(
          color: const Color.fromARGB(255, 239, 239, 239),
          border: Border.all(
            color: const Color.fromARGB(255, 239, 239, 239),
          ),
          borderRadius: const BorderRadius.all(
            Radius.circular(20),
          ),
        ),
        child: child);
  }
}
