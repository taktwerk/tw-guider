import 'package:flutter/material.dart';
import 'package:guider/helpers/search.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/instruction.dart';
import 'package:guider/views/category.dart';
import 'package:guider/widgets/listitem.dart';
import 'package:guider/widgets/searchbar.dart';
import 'package:guider/widgets/tag.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class ListOfInstructions extends ChangeNotifier {
  var list = [];
}

class _HomeState extends State<Home> with AutomaticKeepAliveClientMixin<Home> {
  List<InstructionElement>? _filteredInstructions;
  List<InstructionElement>? _instructionsBySearch;
  List<InstructionElement>? _instructionsByCategory;
  List<InstructionElement>? _allInstructions;
  String chosenCategory = "";
  bool isVisible = false;
  final ScrollController _scrollController = ScrollController();

  Future getAllInstructions() async {
    var result = await Search.getAllInstructions();
    setState(() {
      _filteredInstructions = result;
      _instructionsBySearch = _filteredInstructions;
      _instructionsByCategory = _filteredInstructions;
      _allInstructions = _filteredInstructions;
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
    setState(
      () {
        _filteredInstructions = filtered;
      },
    );
  }

  void showCategories(BuildContext context) async {
    await showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          content: StatefulBuilder(
            builder: (BuildContext context, StateSetter setState) {
              return CategoryPopup(
                  chosenCategory: chosenCategory,
                  updateCategoryInstructions: updateCategoryInstructions);
            },
          ),
        );
      },
    ).then(
      (value) {
        if (value != null) {
          setState(
            () {
              chosenCategory = value;
              if (chosenCategory != "") {
                isVisible = true;
              } else {
                isVisible = false;
              }
            },
          );
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Scaffold(
      body: Column(
        children: [
          Row(
            children: [
              getCategoryButton(),
              Expanded(
                child: SearchBarWidget(
                    updateInstructions: updateSearchInstructions),
              ),
            ],
          ),
          getCategoryTag(),
          _filteredInstructions != null
              ? Expanded(
                  child: Scrollbar(
                  controller: _scrollController,
                  thumbVisibility: true,
                  child: ListView.builder(
                    controller: _scrollController,
                    physics: const BouncingScrollPhysics(),
                    itemCount: _filteredInstructions!.length,
                    itemBuilder: (context, index) {
                      return ListItem(
                          instruction: _filteredInstructions![index]);
                    },
                  ),
                ))
              : const CircularProgressIndicator(),
        ],
      ),
    );
  }

  Widget getCategoryButton() => Padding(
        padding: const EdgeInsets.only(left: 8.0),
        child: TextButton(
          onPressed: () {
            showCategories(context);
          },
          child: const Text('Categories'),
        ),
      );

  Widget getCategoryTag() => Visibility(
      visible: isVisible,
      child: TagContainer(
        child: getTagContent(),
      ));

  Widget getTagContent() => Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            constraints: const BoxConstraints(maxWidth: 200),
            child: Padding(
              padding: const EdgeInsets.only(left: 10),
              child: Text(
                chosenCategory,
                style: const TextStyle(
                  color: Color.fromARGB(255, 35, 38, 68),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          IconButton(
            onPressed: () {
              setState(() {
                isVisible = false;
                chosenCategory = "";
                _filteredInstructions = _instructionsBySearch;
                _instructionsByCategory = _allInstructions;
              });
            },
            icon: const Icon(
              Icons.close,
              color: Color.fromARGB(255, 146, 146, 146),
            ),
          )
        ],
      );
}
