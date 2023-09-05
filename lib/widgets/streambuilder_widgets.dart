import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';

Widget getTitleStream(instruction) {
  return StreamBuilder(
      stream: instruction,
      builder:
          (BuildContext context, AsyncSnapshot<List<Instruction>> snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const CircularProgressIndicator();
        } else if (snapshot.connectionState == ConnectionState.active ||
            snapshot.connectionState == ConnectionState.done) {
          if (snapshot.hasError) {
            return Text('🚨 Error: ${snapshot.error}');
          } else if (snapshot.hasData) {
            return SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Text(
                snapshot.data!.first.title,
              ),
            );
          } else {
            return const Text("Empty data TITLE");
          }
        } else {
          return Text('State: ${snapshot.connectionState}');
        }
      });
}
