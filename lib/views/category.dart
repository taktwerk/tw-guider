import 'package:flutter/material.dart';
import 'package:guider/helpers/search.dart';
import 'package:guider/objects/category.dart';

class CategoryPopUp extends StatefulWidget {
  const CategoryPopUp({Key? key}) : super(key: key);

  @override
  State<CategoryPopUp> createState() => _CategoryPopUpState();
}

class _CategoryPopUpState extends State<CategoryPopUp> {
  // Initial Selected Value
  String dropdownvalue = 'Category 1';
  int _selectedIndex = 0;
  List<Category>? _categories;

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
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.maxFinite,
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
                ? ListView.builder(
                    itemCount: _categories!.length,
                    itemBuilder: (BuildContext context, int index) {
                      return ListTile(
                        selectedTileColor: Colors.blue,
                        title: Center(child: Text(_categories![index].name)),
                        selected: index == _selectedIndex,
                        onTap: () {
                          setState(
                            () {
                              _selectedIndex = index;
                            },
                          );
                        },
                      );
                    },
                  )
                : const CircularProgressIndicator(),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop(_categories![_selectedIndex].name);
            },
            child: const Text("OK"),
          )
        ],
      ),
    );
  }
}



  // Container(
  //           width: double.maxFinite,
  //           child: Column(
  //             mainAxisAlignment: MainAxisAlignment.center,
  //             mainAxisSize: MainAxisSize.min,
  //             children: [
  //               const Text(
  //                 "Categories",
  //                 style: TextStyle(fontWeight: FontWeight.bold),
  //               ),
  //               const SizedBox(height: 8),
  //               Flexible(
  //                 child: SingleChildScrollView(
  //                   child: Text(message),
  //                 ),
  //               ),
  //               ElevatedButton(
  //                 onPressed: () {
  //                   Navigator.of(context).pop();
  //                 },
  //                 child: Text("OK"),
  //               )
  //             ],
  //           ),
  //         ),





    //   return Column(
    //   mainAxisSize: MainAxisSize.min,
    //   children: [
    //     DropdownButton(
    //       // Initial Value
    //       value: dropdownvalue,

    //       // Down Arrow Icon
    //       icon: const Icon(Icons.keyboard_arrow_down),

    //       // Array list of items
    //       items: items.map((String items) {
    //         return DropdownMenuItem(
    //           value: items,
    //           child: Text(items),
    //         );
    //       }).toList(),
    //       // After selecting the desired option,it will
    //       // change button value to selected value
    //       onChanged: (String? newValue) {
    //         setState(() {
    //           dropdownvalue = newValue!;
    //         });
    //       },
    //     ),
    //     TextButton(
    //         onPressed: () {
    //           Navigator.pop(context, dropdownvalue);
    //         },
    //         child: const Text("Ok"))
    //   ],
    // );