import 'dart:async';
import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/instructionstep_view.dart';
import 'package:guider/widgets/streambuilder_widgets.dart';

class InstructionStepOverview extends StatefulWidget {
  const InstructionStepOverview({super.key, required this.instruction});

  final Instruction instruction;

  @override
  State<StatefulWidget> createState() => _InstructionStepViewState();
}

class _InstructionStepViewState extends State<InstructionStepOverview> {
  StreamSubscription? _subscription;

  @override
  void dispose() {
    _subscription?.cancel();
    super.dispose();
  }

  _renderWidget(step) {
    return step != null
        ? InstructionStepView(
            instructionTitle: widget.instruction.title, instructionStep: step)
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
    final instruction =
        Singleton().getDatabase().getInstructionById(widget.instruction.id);
    final steps = Singleton()
        .getDatabase()
        .getInstructionStepsByInstructionId(widget.instruction.id);
    final lastVisitedStep = Singleton().getDatabase().getLastVisitedStep(
        instructionId: widget.instruction.id, userId: currentUser!);
    return Scaffold(
        appBar: AppBar(
          title: getTitleStream(instruction),
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
              } else if (snapshot.hasData) {
                return StreamBuilder(
                  stream: lastVisitedStep,
                  builder: (BuildContext stepContext,
                      AsyncSnapshot<List<InstructionStep>> stepSnapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const CircularProgressIndicator();
                    } else if (snapshot.connectionState ==
                            ConnectionState.active ||
                        snapshot.connectionState == ConnectionState.done) {
                      if (snapshot.hasError) {
                        return Text('🚨 Error: ${snapshot.error}');
                      } else if (stepSnapshot.hasData) {
                        return Container(
                          padding: const EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              SizedBox(
                                width: 300,
                                child: DropdownButtonFormField(
                                  isExpanded: true,
                                  icon:
                                      const Icon(Icons.arrow_drop_down_circle),
                                  value: stepSnapshot.data!.first,
                                  items: snapshot.data!
                                      .map((item) =>
                                          DropdownMenuItem<InstructionStep>(
                                            value: item,
                                            child: Text(
                                                "${l!.step} ${item.stepNr}"),
                                          ))
                                      .toList(),
                                  onChanged: (item) {
                                    if (item != null) {
                                      setNewStep(item.id);
                                    }
                                  },
                                  decoration: InputDecoration(
                                    labelText: l!.instructionSteps,
                                    prefixIcon:
                                        const Icon(Icons.format_list_numbered),
                                    border: const OutlineInputBorder(),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 5.0),
                              Expanded(
                                  child: ListView(
                                children: [
                                  _renderWidget(stepSnapshot.data!.first)
                                ],
                              )),
                              backAndForthButtons(
                                  snapshot.data, stepSnapshot.data!.first),
                            ],
                          ),
                        );
                      } else {
                        return const Text("Empty data LASTVISITEDSTEP");
                      }
                    } else {
                      return Text('State: ${snapshot.connectionState}');
                    }
                  },
                );
              } else {
                return const Text("Empty data OVERVIEW");
              }
            } else {
              return Text('State: ${snapshot.connectionState}');
            }
          },
        ));
  }

  Widget backAndForthButtons(steps, currentStep) {
    final l = Languages.of(context);
    return currentStep != null
        ? Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              steps.indexOf(currentStep) != 0
                  ? ElevatedButton.icon(
                      icon: const Icon(Icons.arrow_back_ios),
                      onPressed: () {
                        var index =
                            (steps.indexOf(currentStep!) - 1) % steps.length;
                        setNewStep(steps[index].id);
                      },
                      label: Text(l!.back),
                    )
                  : Container(),
              steps.indexOf(currentStep!) != steps.length - 1
                  ? Directionality(
                      textDirection: TextDirection.rtl,
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.arrow_back_ios),
                        onPressed: () {
                          var index =
                              (steps.indexOf(currentStep!) + 1) % steps.length;
                          setNewStep(steps[index].id);
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
