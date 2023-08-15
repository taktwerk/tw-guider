import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/drift_to_supabase.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/views/category.dart';
import 'package:guider/widgets/listitem.dart';
import 'package:guider/widgets/searchbar.dart';
import 'package:guider/widgets/tag.dart';
import 'package:guider/objects/singleton.dart';
import 'package:guider/helpers/localstorage/supabase_to_drift.dart';
import 'package:drift_db_viewer/drift_db_viewer.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class ListOfInstructions extends ChangeNotifier {
  var list = [];
}

class _HomeState extends State<Home> with AutomaticKeepAliveClientMixin<Home> {
  List<Instruction>? _filteredInstructions;
  List<Instruction>? _instructionsBySearch;
  List<Instruction>? _instructionsByCategory;
  List<Instruction>? _allInstructions;
  String chosenCategory = "";
  bool isVisible = false;
  bool loaded = false;
  bool loading = false;
  final ScrollController _scrollController = ScrollController();

  void getAllInstructions() async {
    var data = await Singleton().getDatabase().allInstructionEntries;
    setState(() {
      _filteredInstructions = data;
      _instructionsBySearch = data;
      _instructionsByCategory = data;
      _allInstructions = data;
    });
  }

  Future<void> sync() async {
    try {
      await DriftToSupabase.uploadFeedback();

      await DriftToSupabase.uploadHistory();

      await DriftToSupabase.uploadSettings();
      await SupabaseToDrift.sync();

      //   print(
      //       "All history entries: ${await Singleton().getDatabase().allHistoryEntries}");

      // var lastSynced = await KeyValue.getValue(KeyValueEnum.feedback.key);

      //           var history = await Singleton()
      //     .getDatabase()
      //     .notSyncedHistoryEntries(DateTime.parse(lastSynced!));
      // print("Not synced history: $history");

      getAllInstructions();
    } catch (e) {
      setState(() {
        loading = false;
      });
      //handleError(e);
      logger.e("Error log ${e.toString()}");
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("$e")));
    }
  }

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    getAllInstructions();
  }

  Future<void> updateSearchInstructions(newInstructions) async {
    setState(() {
      _instructionsBySearch = newInstructions;
    });
    await combineCategoryAndSearch();
  }

  Future<void> updateCategoryInstructions(newInstructions) async {
    setState(() {
      _instructionsByCategory = newInstructions;
    });
    await combineCategoryAndSearch();
  }

  Future<void> combineCategoryAndSearch() async {
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
    final l = Languages.of(context);
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
          Padding(
            padding: const EdgeInsets.all(20),
            child: ElevatedButton.icon(
                onPressed: () {
                  final db =
                      Singleton().getDatabase(); //This should be a singleton
                  Navigator.of(context).push(MaterialPageRoute(
                      builder: (context) => DriftDbViewer(db)));
                },
                icon: const Icon(Icons.storage),
                label: const Text("DB")),
          ),
          ElevatedButton(
              onPressed: () {
                setState(() {
                  loading = true;
                });
                sync().then((value) {
                  setState(() {
                    isVisible = false;
                    chosenCategory = "";
                    loading = false;
                  });
                });
              },
              child: Text(l!.synchronize)),
          loading ? const CircularProgressIndicator() : Container(),
          _filteredInstructions != null
              ? _filteredInstructions!.isEmpty
                  ? Text(l.noInstructionsAvailable)
                  : Expanded(
                      child: Scrollbar(
                      controller: _scrollController,
                      thumbVisibility: true,
                      child: ListView.builder(
                        controller: _scrollController,
                        physics: const BouncingScrollPhysics(),
                        itemCount: _filteredInstructions?.length,
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
          child: Text(Languages.of(context)!.categorieButtonText),
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
