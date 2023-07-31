import 'package:flutter/material.dart';
import 'package:guider/helpers/insert.dart';
import 'package:guider/helpers/search.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/instruction.dart';
import 'package:guider/objects/instruction_steps.dart';
import 'package:guider/views/instructionstep_view.dart';

class InstructionStepOverview extends StatefulWidget {
  const InstructionStepOverview(
      {super.key, required this.instruction, required this.steps});

  final InstructionElement instruction;
  final List<InstructionStep> steps;

  @override
  State<StatefulWidget> createState() => _InstructionStepViewState();
}

class _InstructionStepViewState extends State<InstructionStepOverview> {
  final List<InstructionStepView> _views = [];
  final List<String> _items = [];
  String? selectedItem;
  InstructionStepView? currentView;
  int? _itemsLength;
  int? instructionId;

  @override
  void initState() {
    super.initState();
    initializeStepViews();
    getLastVisitedStep(widget.instruction.id);
  }

  Future getLastVisitedStep(id) async {
    var res =
        await Search.getLastVisitedStep(instructionId: id, userId: currentUser);
    var item = "Step ${res.stepNr}/${widget.steps.length}";
    int index = _items.indexOf(item);
    setState(() {
      selectedItem = item;
      currentView = _views[index];
      instructionId = id;
    });
  }

  void initializeStepViews() {
    for (var item in widget.steps) {
      _views.add(InstructionStepView(
          instructionTitle: widget.instruction.title, instructionStep: item));
      _items.add("Step ${item.stepNr}/${widget.steps.length}");
    }
    setState(() {
      _itemsLength = _items.length;
    });
  }

  _renderWidget() {
    return currentView;
  }

  void setNewStep(index) {
    Insert.setNewStep(
        userId: currentUser,
        instructionStepId: _views[index].instructionStep.id,
        instructionId: instructionId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
          title: Text(widget.instruction.title),
        ),
        body: currentView != null
            ? Container(
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
                        items: _items
                            .map((item) => DropdownMenuItem<String>(
                                  value: item,
                                  child: Text(item),
                                ))
                            .toList(),
                        onChanged: (item) => setState(
                          () {
                            int index = _items.indexOf(item!);
                            setNewStep(index);
                            selectedItem = item;
                            currentView = _views[index];
                          },
                        ),
                        decoration: const InputDecoration(
                          labelText: "Instruction Steps",
                          prefixIcon: Icon(Icons.format_list_numbered),
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ),
                    const SizedBox(height: 5.0),
                    _renderWidget(),
                    backAndForthButtons(),
                  ],
                ),
              )
            : const Center(
                child: CircularProgressIndicator(),
              ));
  }

  Widget backAndForthButtons() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _items.indexOf(selectedItem!) != 0
            ? ElevatedButton.icon(
                icon: const Icon(Icons.arrow_back_ios),
                onPressed: () {
                  setState(() {
                    var index =
                        (_items.indexOf(selectedItem!) - 1) % _itemsLength!;
                    setNewStep(index);
                    selectedItem = _items[index];
                    currentView = _views[index];
                  });
                },
                label: const Text("Back"),
              )
            : Container(),
        _items.indexOf(selectedItem!) != _itemsLength! - 1
            ? Directionality(
                textDirection: TextDirection.rtl,
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.arrow_back_ios),
                  onPressed: () {
                    setState(() {
                      var index =
                          (_items.indexOf(selectedItem!) + 1) % _itemsLength!;
                      setNewStep(index);
                      selectedItem = _items[index];
                      currentView = _views[index];
                    });
                  },
                  label: const Text("Next"),
                ),
              )
            : Directionality(
                textDirection: TextDirection.rtl,
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.done_all),
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  label: const Text("!Done"),
                ),
              ),
      ],
    );
  }
}
