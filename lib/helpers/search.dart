import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:guider/objects/instruction.dart';

class Search {

  
  static Future<List<InstructionElement>> getAllInstructions() async {
    final String response = await rootBundle.loadString('assets/jsons/instruction.json');
    final Instructions instructions = instructionFromJson(response);
    return instructions.instructionElements;
  }

  static Future<List<InstructionElement>> getInstructionBySearch(value) async {
    // TODO: take from localstorage
    var allInstructions = await getAllInstructions();
    final result = <InstructionElement>[];
    for(var item in allInstructions) {
      if(myFilter(item, value)) {
        result.add(item);
      }
    }
    print("Result length ${result.length}");
    return result;
    }

  static bool myFilter(item, value) {
    var lowercaseItemTitle = item.title.toLowerCase();
    var lowercaseItemShorttitle = item.shortTitle.toLowerCase();
    var lowercaseValue = value.toLowerCase();
    if(lowercaseItemTitle.contains(lowercaseValue) || lowercaseItemShorttitle.contains(lowercaseValue)) {
      return true;
    }
    return false;
  }
}