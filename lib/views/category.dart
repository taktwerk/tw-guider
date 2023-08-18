import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';

class CategoryPopup extends ConsumerStatefulWidget {
  const CategoryPopup(
      {Key? key,
      required this.chosenCategory,
      required this.updateCategoryInstructions})
      : super(key: key);
  final String chosenCategory;
  final Function updateCategoryInstructions;

  @override
  ConsumerState<CategoryPopup> createState() => _CategoryPopupState();
}

class _CategoryPopupState extends ConsumerState<CategoryPopup> {
  final ScrollController _scrollController = ScrollController();

  void search(category) async {
    widget.updateCategoryInstructions(category);
  }

  void clear() async {
    widget.updateCategoryInstructions(-1);
  }

  @override
  Widget build(BuildContext context) {
    final database = ref.watch(todoDBProvider);
    var categories = database.allCategoryEntries;
    final l = Languages.of(context);
    return SizedBox(
      width: double.minPositive,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            l!.categorieButtonText,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          StreamBuilder(
              stream: categories,
              builder: (BuildContext context,
                  AsyncSnapshot<List<Category>> snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const CircularProgressIndicator();
                } else if (snapshot.connectionState == ConnectionState.active ||
                    snapshot.connectionState == ConnectionState.done) {
                  if (snapshot.hasError) {
                    return Text('🚨 Error: ${snapshot.error}');
                  } else if (snapshot.hasData) {
                    final list = snapshot.data!;
                    var selectedIndex = list.indexWhere(
                        (category) => category.name == widget.chosenCategory);
                    return Flexible(
                        child: Scrollbar(
                      controller: _scrollController,
                      thumbVisibility: true,
                      child: ListView.builder(
                        controller: _scrollController,
                        physics: const BouncingScrollPhysics(),
                        itemCount: snapshot.data!.length,
                        itemBuilder: (BuildContext context, int index) {
                          return ListTile(
                            selectedTileColor: Colors.blue,
                            title:
                                Center(child: Text(snapshot.data![index].name)),
                            selected: index == selectedIndex,
                            onTap: () {
                              Navigator.of(context)
                                  .pop(snapshot.data![index].name);
                              search(snapshot.data![index].id);
                            },
                          );
                        },
                      ),
                    ));
                  } else {
                    return const Text("Empty data");
                  }
                } else {
                  return Text('State: ${snapshot.connectionState}');
                }
              }),
        ],
      ),
    );
  }
}
