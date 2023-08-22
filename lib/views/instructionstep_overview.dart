import 'dart:async';
import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/instructionstep_view.dart';

class InstructionStepOverview extends StatefulWidget {
  const InstructionStepOverview(
      {super.key, required this.instruction, required this.steps});

  final Instruction instruction;
  final List<InstructionStep> steps;

  @override
  State<StatefulWidget> createState() => _InstructionStepViewState();
}

class _InstructionStepViewState extends State<InstructionStepOverview> {
  InstructionStep? selectedItem;
  StreamSubscription? _subscription;

  @override
  void initState() {
    super.initState();
    init();
  }

  void init() async {
    _subscription = Singleton()
        .getDatabase()
        .getLastVisitedStep(
            instructionId: widget.instruction.id, userId: currentUser!)
        .listen((event) {
      setState(() {
        selectedItem = event;
      });
    });
  }

  @override
  void dispose() {
    _subscription?.cancel();
    super.dispose();
  }

  _renderWidget() {
    return selectedItem != null
        ? InstructionStepView(
            instructionTitle: widget.instruction.title,
            instructionStep: selectedItem!)
        : const CircularProgressIndicator();
  }

  void setNewStep(id) async {
    await Singleton().getDatabase().setNewStep(
        userId: currentUser!,
        instructionId: widget.instruction.id,
        instructionStepId: id);
  }

  @override
  Widget build(BuildContext context) {
    final l = Languages.of(context);
    final steps = Singleton()
        .getDatabase()
        .getInstructionStepsByInstructionId(widget.instruction.id);
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
          title: Text(widget.instruction.title),
        ),
        body: StreamBuilder(
          stream: steps,
          builder: (BuildContext context,
              AsyncSnapshot<List<InstructionStep>> snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const CircularProgressIndicator();
            } else if (snapshot.connectionState == ConnectionState.active ||
                snapshot.connectionState == ConnectionState.done) {
              if (snapshot.hasError) {
                return Text('🚨 Error: ${snapshot.error}');
              } else if (snapshot.hasData && selectedItem != null) {
                return Container(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      SizedBox(
                        width: 300,
                        child: DropdownButtonFormField(
                          isExpanded: true,
                          icon: const Icon(Icons.arrow_drop_down_circle),
                          value: selectedItem,
                          items: snapshot.data!
                              .map((item) => DropdownMenuItem<InstructionStep>(
                                    value: item,
                                    child: Text("${l!.step} ${item.stepNr}"),
                                  ))
                              .toList(),
                          onChanged: (item) => setState(
                            () {
                              setNewStep(item?.id);
                              selectedItem = item;
                            },
                          ),
                          decoration: InputDecoration(
                            labelText: l!.instructionSteps,
                            prefixIcon: const Icon(Icons.format_list_numbered),
                            border: const OutlineInputBorder(),
                          ),
                        ),
                      ),
                      const SizedBox(height: 5.0),
                      Expanded(
                          child: ListView(
                        children: [_renderWidget()],
                      )),
                      backAndForthButtons(snapshot.data),
                    ],
                  ),
                );
              } else {
                return const Text("Empty data");
              }
            } else {
              return Text('State: ${snapshot.connectionState}');
            }
          },
        ));
  }

  Widget backAndForthButtons(steps) {
    final l = Languages.of(context);
    return selectedItem != null
        ? Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              steps.indexOf(selectedItem!) != 0
                  ? ElevatedButton.icon(
                      icon: const Icon(Icons.arrow_back_ios),
                      onPressed: () {
                        setState(() {
                          var index =
                              (steps.indexOf(selectedItem!) - 1) % steps.length;
                          setNewStep(steps[index].id);
                          selectedItem = steps[index];
                        });
                      },
                      label: Text(l!.back),
                    )
                  : Container(),
              steps.indexOf(selectedItem!) != steps.length - 1
                  ? Directionality(
                      textDirection: TextDirection.rtl,
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.arrow_back_ios),
                        onPressed: () {
                          setState(() {
                            var index = (steps.indexOf(selectedItem!) + 1) %
                                steps.length;
                            setNewStep(steps[index].id);
                            selectedItem = steps[index];
                          });
                        },
                        label: Text(l!.next),
                      ),
                    )
                  : Directionality(
                      textDirection: TextDirection.rtl,
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.done_all),
                        onPressed: () {
                          Navigator.of(context).pop();
                        },
                        label: Text("!${l!.done}"),
                      ),
                    ),
            ],
          )
        : Container();
  }
}
