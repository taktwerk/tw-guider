import 'package:flutter/material.dart';
import 'package:guider/helpers/insert.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/instruction.dart';
import 'package:guider/views/instruction_view.dart';

class ListItem extends StatelessWidget {
  const ListItem({
    super.key,
    required InstructionElement instruction,
  }) : _instruction = instruction;

  final InstructionElement _instruction;

  @override
  Widget build(BuildContext context) {
    final l = Languages.of(context);
    return Card(
      elevation: 4,
      margin: const EdgeInsets.all(10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(5)),
      child: InkWell(
          onTap: () {
            Insert.updateHistory(
                userId: currentUser, instructionId: _instruction.id);
            Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) =>
                      InstructionView(instruction: _instruction)),
            );
          },
          child: SizedBox(
              height: 150,
              child: Container(
                  padding: const EdgeInsets.all(10),
                  child: Row(
                    children: [
                      Expanded(
                          flex: 20,
                          child: Container(
                              alignment: Alignment.topLeft,
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(5),
                                child: Image.network(
                                  _instruction.image,
                                  height: 150,
                                  width: 250,
                                  fit: BoxFit.cover,
                                ),
                              ))),
                      const Spacer(flex: 2),
                      Expanded(
                        flex: 50,
                        child: Column(
                          children: [
                            Expanded(
                                flex: 1,
                                child: Align(
                                    alignment: Alignment.topLeft,
                                    child: Container(
                                        padding: const EdgeInsets.fromLTRB(
                                            7, 2, 7, 2),
                                        decoration: BoxDecoration(
                                            color: Colors.grey.shade400,
                                            border: Border.all(
                                                color: Colors.grey.shade400),
                                            borderRadius:
                                                const BorderRadius.all(
                                                    Radius.circular(20))),
                                        child: Text(
                                          _instruction.shortTitle,
                                          style: const TextStyle(
                                              fontSize: 15,
                                              color: Colors.white),
                                        )))),
                            Expanded(
                              flex: 2,
                              child: Align(
                                  alignment: Alignment.topLeft,
                                  child: Text(_instruction.title,
                                      style: const TextStyle(fontSize: 23))),
                            ),
                            Expanded(
                              flex: 1,
                              child: Align(
                                  alignment: Alignment.bottomLeft,
                                  child: Text(
                                      '${l!.steps}: ? | ${l.lastUpdate}: ${_instruction.updatedAt}',
                                      style:
                                          const TextStyle(color: Colors.grey))),
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.arrow_forward_ios)
                    ],
                  )))),
    );
  }
}
