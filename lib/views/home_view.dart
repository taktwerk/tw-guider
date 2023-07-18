import 'package:flutter/material.dart';
import 'package:guider/helpers/search.dart';
import 'package:guider/objects/instruction.dart';
import 'package:guider/views/instruction_view.dart';
import 'package:guider/widgets/searchbar.dart';
import 'package:provider/provider.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();

}

class ListOfInstructions extends ChangeNotifier {
  var list = [];
}

class _HomeState extends State<Home> {
  List<InstructionElement>? _instructions;

  Future getAllInstructions() async {
    var result = await Search.getAllInstructions();
    setState(() {
      _instructions = result;
    });
  }

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          SearchBarWidget(updateInstructions: updateInstructions),
          _instructions != null
          ? Expanded(child: 
          ListView.builder(
            itemCount: _instructions!.length,
            itemBuilder: (context, index) {
              return Card(
                child: SizedBox(
                  height: 120,
                  child: ListTile(
                        title: Text(_instructions![index].title),
                        subtitle: Text(_instructions![index].shortTitle),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => InstructionView(user: _instructions![index])),
                          );
                        },
                      ),),
              );
            })
          ,)
          :Container(),
        ],

      )

    );
  }
}
