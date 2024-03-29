import 'package:flutter/material.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/objects/scanner.dart';

class SearchBarWidget extends StatefulWidget {
  final Function updateInstructions;

  final ScanModel scanModel;
  const SearchBarWidget(
      {super.key, required this.updateInstructions, required this.scanModel});

  @override
  State<SearchBarWidget> createState() => _SearchBarWidgetState();
}

class _SearchBarWidgetState extends State<SearchBarWidget> {
  // This controller will store the value of the search bar
  final TextEditingController _searchController = TextEditingController();
  @override
  void initState() {
    super.initState();
    widget.scanModel.addListener(_updateControllerText);
  }

  void _updateControllerText() {
    _searchController.text = widget.scanModel.text;
    search(widget.scanModel.text);
  }


  @override
  void dispose() {
    _searchController.dispose();
    widget.scanModel.removeListener(_updateControllerText);

    super.dispose();
  }

  Future<void> search(value) async {
    widget.updateInstructions(value);
  }

  void clear() async {
    _searchController.clear();
    widget.updateInstructions("");
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
