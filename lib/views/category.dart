import 'package:flutter/material.dart';
import 'package:guider/helpers/search.dart';
import 'package:guider/objects/category.dart';

class CategoryPopup extends StatefulWidget {
  const CategoryPopup(
      {Key? key,
      required this.chosenCategory,
      required this.updateCategoryInstructions})
      : super(key: key);
  final String chosenCategory;
  final Function updateCategoryInstructions;

  @override
  State<CategoryPopup> createState() => _CategoryPopupState();
}

class _CategoryPopupState extends State<CategoryPopup> {
  // Initial Selected Value
  int _selectedIndex = -1;
  List<Category>? _categories;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    getCategories();
  }

  Future getCategories() async {
    var result = await Search.getCategories();
    setState(() {
      _categories = result;
    });
    _selectedIndex = _categories!
        .indexWhere((category) => category.name == widget.chosenCategory);
  }

  void search(category) async {
    var val = await Search.getInstructionByCategory(category);
    widget.updateCategoryInstructions(val);
  }

  void clear() async {
    var val = await Search.getAllInstructions();
    widget.updateCategoryInstructions(val);
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.minPositive,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            "Categories",
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Flexible(
            child: _categories != null
                ? Scrollbar(
                    controller: _scrollController,
                    thumbVisibility: true,
                    child: ListView.builder(
                      controller: _scrollController,
                      physics: const BouncingScrollPhysics(),
                      itemCount: _categories!.length,
                      itemBuilder: (BuildContext context, int index) {
                        return ListTile(
                          selectedTileColor: Colors.blue,
                          title: Center(child: Text(_categories![index].name)),
                          selected: index == _selectedIndex,
                          onTap: () {
                            setState(
                              () {
                                if (_selectedIndex == index) {
                                  _selectedIndex = -1;
                                } else {
                                  _selectedIndex = index;
                                }
                              },
                            );
                          },
                        );
                      },
                    ),
                  )
                : const CircularProgressIndicator(),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              if (_selectedIndex == -1) {
                Navigator.of(context).pop("");
                clear();
              } else {
                Navigator.of(context).pop(_categories![_selectedIndex].name);
                search(_categories![_selectedIndex].id);
              }
            },
            child: const Text("OK"),
          )
        ],
      ),
    );
  }
}