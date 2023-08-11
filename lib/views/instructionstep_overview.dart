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
  final List<InstructionStepView> _views = [];
  final List<String> _items = [];
  String? selectedItem;
  InstructionStepView? currentView;
  int? _itemsLength;
  int? instructionId;

  @override
  void initState() {
    super.initState();
    init();
  }

  void init() async {
    await initializeStepViews();
    await getLastVisitedStep(widget.instruction.id);
  }

  Future<void> getLastVisitedStep(id) async {
    try {
      var res = await Singleton()
          .getDatabase()
          .getLastVisitedStep(instructionId: id, userId: currentUser!);

      var item = "${res.stepNr}/${widget.steps.length}";
      int index = _items.indexOf(item);
      setState(() {
        selectedItem = item;
        currentView = _views[index];
        instructionId = id;
      });
    } catch (e) {
      logger.e("Exception: $e");
    }
  }

  Future<void> initializeStepViews() async {
    for (var item in widget.steps) {
      _views.add(InstructionStepView(
          instructionTitle: widget.instruction.title, instructionStep: item));
      _items.add("${item.stepNr}/${widget.steps.length}");
    }
    setState(() {
      _itemsLength = _items.length;
    });
  }

  _renderWidget() {
    return currentView;
  }

  void setNewStep(index) async {
    await Singleton().getDatabase().setNewStep(
        userId: currentUser!,
        instructionId: instructionId!,
        instructionStepId: _views[index].instructionStep.id);
  }

  @override
  Widget build(BuildContext context) {
    final l = Languages.of(context);
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
                                  child: Text("${l!.step} $item"),
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
                        decoration: InputDecoration(
                          labelText: l!.instructionSteps,
                          prefixIcon: const Icon(Icons.format_list_numbered),
                          border: const OutlineInputBorder(),
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
    final l = Languages.of(context);
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
                label: Text(l!.back),
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
    );
  }
}
