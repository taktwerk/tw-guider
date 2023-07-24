import 'package:flutter/material.dart';
import 'package:guider/helpers/search.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/instruction.dart';
import 'package:guider/views/instruction_view.dart';
import 'package:guider/views/category.dart';
import 'package:guider/widgets/searchbar.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class ListOfInstructions extends ChangeNotifier {
  var list = [];
}

class _HomeState extends State<Home> with AutomaticKeepAliveClientMixin<Home> {
  List<InstructionElement>? _instructions;
  List<InstructionElement>? _instructionsBySearch;
  List<InstructionElement>? _instructionsByCategory;
  List<InstructionElement>? _allInstructions;
  String chosenCategory = "";
  bool isVisible = false;

  Future getAllInstructions() async {
    var result = await Search.getAllInstructions();
    setState(() {
      _instructions = result;
      _instructionsBySearch = _instructions;
      _instructionsByCategory = _instructions;
      _allInstructions = _instructions;
    });
  }

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    getAllInstructions();
  }

  void updateSearchInstructions(newInstructions) {
    setState(() {
      _instructionsBySearch = newInstructions;
    });
    combineCategoryAndSearch();
  }

  void updateCategoryInstructions(newInstructions) {
    setState(() {
      _instructionsByCategory = newInstructions;
    });
    combineCategoryAndSearch();
  }

  void combineCategoryAndSearch() {
    final selectedIds =
        _instructionsBySearch!.map((component) => component.id).toList();
    final filtered = _instructionsByCategory!
        .where((element) => selectedIds.contains(element.id))
        .toList();
    logger.d("Filtered $filtered");
    setState(() {
      _instructions = filtered;
    });
  }

  void showCategories(BuildContext context, String message) async {
    await showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(content: StatefulBuilder(
            builder: (BuildContext context, StateSetter setState) {
          return CategoryPopup(
              chosenCategory: chosenCategory,
              updateCategoryInstructions: updateCategoryInstructions);
        }));
      },
    ).then((value) {
      if (value != null) {
        setState(() {
          chosenCategory = value;
          if (chosenCategory != "") {
            isVisible = true;
          } else {
            isVisible = false;
          }
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Scaffold(
      body: Column(
        children: [
          Row(
            children: [
              Padding(
                padding: const EdgeInsets.only(left: 8.0),
                child: TextButton(
                  onPressed: () {
                    showCategories(context, "Text");
                  },
                  child: const Text('Categories'),
                ),
              ),
              Expanded(
                child: SearchBarWidget(
                    updateInstructions: updateSearchInstructions),
              ),
            ],
          ),
          Visibility(
            visible: isVisible,
            child: Container(
              margin: const EdgeInsets.only(left: 8, bottom: 8, right: 8),
              padding: const EdgeInsets.all(3),
              decoration: BoxDecoration(
                  border: Border.all(color: Colors.blueAccent),
                  borderRadius: const BorderRadius.all(Radius.circular(10))),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(chosenCategory),
                  IconButton(
                      onPressed: () {
                        setState(() {
                          isVisible = false;
                          chosenCategory = "";
                          _instructions = _instructionsBySearch;
                          _instructionsByCategory = _allInstructions;
                        });
                      },
                      icon: const Icon(Icons.close))
                ],
              ),
            ),
          ),
          _instructions != null
              ? Expanded(
                  child: ListView.builder(
                    itemCount: _instructions!.length,
                    itemBuilder: (context, index) {
                      return Card(
                        child: SizedBox(
                          height: 100,
                          child: ListTile(
                            leading: ConstrainedBox(
                              constraints: const BoxConstraints(
                                minWidth: 100,
                                minHeight: 120,
                                maxWidth: 200,
                                maxHeight: 120,
                              ),
                              child: Image.network(_instructions![index].image),
                            ),
                            title: Text(_instructions![index].title),
                            subtitle: Text(_instructions![index].shortTitle),
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => InstructionView(
                                      instruction: _instructions![index]),
                                ),
                              );
                            },
                            trailing: const Icon(Icons.arrow_forward_ios),
                          ),
                        ),
                      );
                    },
                  ),
                )
              : Container(),
        ],
      ),
    );
  }
}
