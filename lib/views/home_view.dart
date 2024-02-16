import 'dart:async';
import 'package:flutter/material.dart';
import 'package:guider/helpers/device_info.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/main.dart';
import 'package:guider/objects/scanner.dart';
import 'package:guider/views/category.dart';
import 'package:guider/views/instruction_view.dart';
import 'package:guider/widgets/instruction_overview_widget.dart';
import 'package:guider/widgets/listitem.dart';
import 'package:guider/widgets/searchbar.dart';
import 'package:guider/widgets/tag.dart';
import 'package:guider/objects/singleton.dart';
import 'package:provider/provider.dart';

class Home extends StatefulWidget {
  const Home({super.key, required this.scanNotifier});

  final ScanModel scanNotifier;

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> with AutomaticKeepAliveClientMixin<Home> {
  String searchWord = "";
  int category = -1;
  String chosenCategory = "";
  bool isVisible = false;
  final ScrollController _scrollController = ScrollController();
  StreamSubscription? languageSubscription;
  Completer<Instruction?> _completer = Completer<Instruction?>();

  final ValueNotifier<Instruction?> _instruction = ValueNotifier(null);

  Future<void> setInitSettings() async {
    if (currentUser != null) {
      languageSubscription =
          Singleton().getDatabase().getSettings(currentUser!).listen((event) {
        if (event.isNotEmpty) {
          GuiderApp.setLocale(
              context, Locale.fromSubtags(languageCode: event.first.language));
          GuiderApp.setTheme(context,
              event.first.lightmode ? ThemeMode.light : ThemeMode.dark);
        }
      });
    }
  }

  @override
  void initState() {
    super.initState();
    setInitSettings();
    widget.scanNotifier.addListener(scanCallback);
  }

  @override
  bool get wantKeepAlive => true;

  @override
  void dispose() {
    languageSubscription?.cancel();
    _scrollController.dispose();
    widget.scanNotifier.removeListener(scanCallback);
    super.dispose();
  }

  Future<void> updateSearchInstructions(word) async {
    setState(() {
      searchWord = word;
    });
  }

  Future<void> updateCategoryInstructions(cat) async {
    setState(() {
      category = cat;
    });
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

  void scanCallback() async {
    _completer = Completer<Instruction?>();

    bool tabletLayout = DeviceInfo.inTabletLayout(context) ? true : false;
    if (tabletLayout) {
    } else {
      final instruction = await _completer.future;
      if (instruction != null && _instruction.value != null) {
        if (mounted) {
          Navigator.of(context).popUntil((route) => route.isFirst);

          Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => InstructionView(
                      instruction: _instruction.value!,
                      open: false,
                      additionalData: null,
                    )),
          );
        }
      } else {
        if (mounted) {
          Navigator.of(context).popUntil((route) => route.isFirst);
        }
      }
    }
  }

  void mobileCallback(Instruction instruction) {
    _instruction.value = instruction;
    Navigator.push(
      context,
      MaterialPageRoute(
          builder: (context) => InstructionView(
                instruction: instruction,
                open: false,
                additionalData: null,
              )),
    );
  }

  void tabletCallback(Instruction instruction) {
    _instruction.value = instruction;
  }

  void setInstruction(Instruction? instruction) {
    _instruction.value = instruction;
    if (!_completer.isCompleted) {
      // If not, complete the completer
      _completer.complete(instruction);
    }
  }

  @override
  Widget build(BuildContext context) {
    bool tabletLayout = DeviceInfo.inTabletLayout(context) ? true : false;
    super.build(context);
    return Scaffold(
        body: Row(
      children: <Widget>[
        Expanded(
            flex: 1,
            child: Column(
              children: [
                Row(
                  children: [
                    getCategoryButton(),
                    Expanded(
                        child: SearchBarWidget(
                            updateInstructions: updateSearchInstructions,
                            scanModel: widget.scanNotifier)),
                  ],
                ),
                getCategoryTag(),
                Listing(
                  setInstruction: setInstruction,
                  callback: tabletLayout ? tabletCallback : mobileCallback,
                  category: category,
                  searchWord: searchWord,
                )
              ],
            )),
        Visibility(
            visible: tabletLayout,
            child: ValueListenableBuilder(
                valueListenable: _instruction,
                builder: (_, instruction, __) {
                  return instruction != null
                      ? Expanded(
                          flex: tabletLayout ? 1 : 0,
                          child: InstructionOverviewWidget(
                            instruction: instruction,
                            additionalData: null,
                            open: false,
                          ),
                        )
                      : Expanded(
                          flex: tabletLayout ? 1 : 0,
                          child: const Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text('No instruction selected!'),
                            ],
                          ));
                }))
      ],
    ));
  }

  Widget errorOrLoadingCard(input) {
    return InkWell(
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Card(
          elevation: 4,
          child: Center(
            child: Text(input),
          ),
        ),
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
                category = -1;
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

class Listing extends StatefulWidget {
  final Function callback;
  final int category;
  final String searchWord;
  final Function setInstruction;

  const Listing(
      {super.key,
      required this.callback,
      required this.category,
      required this.searchWord,
      required this.setInstruction});

  @override
  State<Listing> createState() => _ListingState();
}

class _ListingState extends State<Listing> {
  final ScrollController _scrollController = ScrollController();
  Widget errorOrLoadingCard(input) {
    return InkWell(
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Card(
          elevation: 4,
          child: Center(
            child: Text(input),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    var filteredInstructions = Singleton()
        .getDatabase()
        .combineCategoryAndSearch(widget.category, widget.searchWord);
    return StreamBuilder(
        stream: filteredInstructions,
        builder: (BuildContext context,
            AsyncSnapshot<List<InstructionWithCount>> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const CircularProgressIndicator();
          } else if (snapshot.connectionState == ConnectionState.active ||
              snapshot.connectionState == ConnectionState.done) {
            if (snapshot.hasError) {
              return errorOrLoadingCard('🚨 Error: ${snapshot.error}');
            } else if (snapshot.hasData) {
              logger.w("SNAPSHOT HAS DATA");
              Future.delayed(Duration.zero, () async {
                if (snapshot.data!.firstOrNull != null &&
                    snapshot.data!.length == 1) {
                  widget
                      .setInstruction(snapshot.data!.firstOrNull?.instruction);
                } else {
                  widget.setInstruction(null);
                }
              });
              return Expanded(
                  child: Scrollbar(
                      controller: _scrollController,
                      thumbVisibility: true,
                      child: ListView.builder(
                        key: const Key("listview"),
                        itemCount: snapshot.data?.length,
                        controller: _scrollController,
                        physics: const BouncingScrollPhysics(),
                        itemBuilder: (context, index) {
                          return ListItem(
                            itemSelectedCallback: widget.callback,
                            key: Key("${snapshot.data![index].instruction.id}"),
                            instruction: snapshot.data![index].instruction,
                            count: snapshot.data![index].count,
                          );
                        },
                      )));
            } else {
              return const Text("Empty data");
            }
          } else {
            return Text('State: ${snapshot.connectionState}');
          }
        });
  }
}
