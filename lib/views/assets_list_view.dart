import 'package:flutter/material.dart';
import 'package:grouped_list/grouped_list.dart';
import 'package:guider/helpers/constants.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/views/assets_view.dart';
import 'package:guider/widgets/file_widgets.dart';

class AssetsListView extends StatefulWidget {
  const AssetsListView({super.key, required this.instructionId});
  final int instructionId;

  @override
  State<StatefulWidget> createState() => _AssetsListViewState();
}

class _AssetsListViewState extends State<AssetsListView> {
  @override
  Widget build(BuildContext context) {
    final assets =
        Singleton().getDatabase().getAssetsOfInstruction(widget.instructionId);
    return Scaffold(
        appBar: AppBar(
          title: const Text("Instruction Assets"),
        ),
        body: Column(
          children: [
            StreamBuilder<List<Asset>>(
                stream: assets,
                builder: (BuildContext context,
                    AsyncSnapshot<List<Asset>> snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const CircularProgressIndicator();
                  } else if (snapshot.connectionState ==
                          ConnectionState.active ||
                      snapshot.connectionState == ConnectionState.done) {
                    if (snapshot.hasError) {
                      return Text('🚨 Error: ${snapshot.error}');
                    } else if (snapshot.hasData) {
                      return Expanded(
                          child: GroupedListView<dynamic, String>(
                        useStickyGroupSeparators: true,
                        stickyHeaderBackgroundColor:
                            Theme.of(context).primaryColor,
                        elements: snapshot.data!,
                        itemComparator: (item1, item2) => item1.name.compareTo(
                            item2.name), //alphabetically sorted (name)
                        groupComparator: (value1, value2) => value1.compareTo(
                            value2), //alphabetically sorted (content type).
                        groupSeparatorBuilder: (value) => Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(16),
                          // color: Color.fromARGB(255, 149, 148, 148),
                          child: Text(value),
                        ),
                        itemBuilder: (context, element) => Card(
                          elevation: 4,
                          child: ListTile(
                            onTap: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (context) => AssetsView(
                                    fileObject: FileObject(
                                        id: element.id,
                                        url: element.file,
                                        textfield: element.textfield,
                                        type: element.type,
                                        folderName:
                                            Const.assetsImagesFolderName.key),
                                  ),
                                ),
                              );
                            },
                            contentPadding: const EdgeInsets.all(12),
                            leading: element.type.icon,
                            title: Text(element.name),
                          ),
                        ),
                        groupBy: (element) => element.type.key,
                      ));
                    } else {
                      return const Text("Empty data");
                    }
                  } else {
                    return Text('State: ${snapshot.connectionState}');
                  }
                })
          ],
        ));
  }
}
