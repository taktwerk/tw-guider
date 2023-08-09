import 'package:flutter/material.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/objects/singleton.dart';

class SearchBarWidget extends StatefulWidget {
  final Function updateInstructions;
  const SearchBarWidget({super.key, required this.updateInstructions});

  @override
  State<SearchBarWidget> createState() => _SearchBarWidgetState();
}

class _SearchBarWidgetState extends State<SearchBarWidget> {
  _SearchBarWidgetState();

  // This controller will store the value of the search bar
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _searchController.addListener(_latestInputValue);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _latestInputValue() {
    // print("Latest text ${_searchController.text}");
  }

  Future<void> search(value) async {
    var val = await Singleton().getDatabase().getInstructionBySearch(value);
    widget.updateInstructions(val);
  }

  void clear() async {
    _searchController.clear();
    var val = await Singleton().getDatabase().allInstructionEntries;
    widget.updateInstructions(val);
  }

  @override
  Widget build(BuildContext context) {
    final l = Languages.of(context);
    return Container(
      padding: const EdgeInsets.all(8.0),
      child: Container(
        // Add padding around the search bar
        padding: const EdgeInsets.symmetric(horizontal: 8.0),
        child: TextField(
          controller: _searchController,
          decoration: InputDecoration(
            hintText: l!.search,
            // Add a clear button to the search bar
            suffixIcon: IconButton(
              icon: const Icon(Icons.clear),
              onPressed: () => clear(),
            ),
            // Add a search icon or button to the search bar
            prefixIcon: IconButton(
              icon: const Icon(Icons.search),
              onPressed: () {
                search(_searchController.text);
              },
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(20.0),
            ),
          ),
          onSubmitted: (value) => search(value),
        ),
      ),
    );
  }
}
