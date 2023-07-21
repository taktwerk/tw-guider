import 'package:flutter/material.dart';
import 'package:guider/helpers/search.dart';
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
  String chosenCategory = "";

  Future getAllInstructions() async {
    var result = await Search.getAllInstructions();
    setState(() {
      _instructions = result;
    });
  }

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    getAllInstructions();
  }

  void updateInstructions(newInstructions) {
    setState(() {
      _instructions = newInstructions;
    });
  }

  void showCategories(BuildContext context, String message) async {
    await showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(content: StatefulBuilder(
            builder: (BuildContext context, StateSetter setState) {
          return const CategoryPopUp();
        }));
      },
    ).then((value) {
      if (value != null) {
        setState(() {
          chosenCategory = value;
          print(value);
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
                child: SearchBarWidget(updateInstructions: updateInstructions),
              )
            ],
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
