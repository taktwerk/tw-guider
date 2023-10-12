import 'dart:async';
import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:media_kit/media_kit.dart';
import 'package:media_kit_video/media_kit_video.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';

Map<String, Function> fileTypeToWidget = {
  // 'jpg', 'png', 'jpeg', 'webp'
  for (var ext in ['image']) ext: (file) => ImageFileWidget(asset: file),
  for (var ext in ['pdf']) ext: (file) => PdfFileWidget(asset: file),
  // 'mp3', 'wav'
  for (var ext in ['audio']) ext: (file) => AudioFileWidget(asset: file),
  // 'mp4'
  for (var ext in ['video']) ext: (file) => VideoFileWidget(asset: file),
  for (var ext in ['text']) ext: (file) => TextWidget(asset: file),
};

abstract class FileWidget extends StatefulWidget {
  final Asset asset;

  const FileWidget({super.key, required this.asset});

  @override
  State<FileWidget> createState() => _FileWidgetState();
}

class _FileWidgetState extends State<FileWidget> {
  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}

class VideoFileWidget extends FileWidget {
  const VideoFileWidget({super.key, required Asset asset})
      : super(asset: asset);

  @override
  State<FileWidget> createState() => _VideoFileWidgetState();
}

class _VideoFileWidgetState extends _FileWidgetState {
  late final player = Player();
  // Create a [VideoController] to handle video output from [Player].
  late final controller = VideoController(player);

  @override
  void dispose() {
    player.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    //TODO: make sure that the video file (url) exists
    player.open(Media(widget.asset.file!));
    final video = Video(
      controller: controller,
    );

    return Center(
      child: video,
    );
  }
}

class ImageFileWidget extends FileWidget {
  const ImageFileWidget({super.key, required Asset asset})
      : super(asset: asset);

  @override
  State<FileWidget> createState() => _ImageFileWidgetState();
}

class _ImageFileWidgetState extends _FileWidgetState {
  // final _instruction = Instruction(
  //     id: 1,
  //     title: "Big Top Pee-Wee 12352837182761827681 5513ef",
  //     shortTitle: "51079-458",
  //     image: "https://dummyimage.com/2380x2166.png/5513ef/000000",
  //     description: "Test",
  //     createdAt: DateTime.now(),
  //     createdBy: 1,
  //     updatedAt: DateTime.now(),
  //     updatedBy: 1);

  @override
  Widget build(BuildContext context) {
    final l = Languages.of(context);

    return Image.network(
      widget.asset.file!,
    );

    // return FutureBuilder(
    //     future: AppUtil.filePath(
    //         _instruction, Const.instructionImagesFolderName.key),
    //     builder: (_, snapshot) {
    //       if (snapshot.hasError) {
    //         return Text(l!.somethingWentWrong);
    //       }
    //       if ((snapshot.connectionState == ConnectionState.waiting)) {
    //         return const CircularProgressIndicator();
    //       }
    //       if (snapshot.data!.isNotEmpty) {
    //         return Image.file(
    //           File(snapshot.data!),
    //           height: 150,
    //           width: 250,
    //           fit: BoxFit.cover,
    //         );
    //       }
    //       return Text(l!.noImageAvailable);
    //     });
  }
}

class PdfFileWidget extends FileWidget {
  const PdfFileWidget({super.key, required Asset asset}) : super(asset: asset);

  @override
  State<FileWidget> createState() => _PdfFileWidgetState();
}

class _PdfFileWidgetState extends _FileWidgetState {
  @override
  Widget build(BuildContext context) {
    return SfPdfViewer.network(widget.asset.file ?? "");
  }
}

class AudioFileWidget extends FileWidget {
  const AudioFileWidget({super.key, required Asset asset})
      : super(asset: asset);

  @override
  State<FileWidget> createState() => _AudioFileWidgetState();
}

class _AudioFileWidgetState extends _FileWidgetState {
  late final player = Player();
  Duration _position = Duration.zero;
  Duration _totalDuration = Duration.zero;
  bool _playing = false;
  StreamSubscription<Duration>? _positionStream;
  StreamSubscription<Duration>? _durationStream;
  bool currentlyChangingSlider = false;

  StreamSubscription<bool>? _isPlayingStream;

  @override
  void dispose() async {
    player.dispose();
    _positionStream?.cancel();
    _isPlayingStream?.cancel();
    _durationStream?.cancel();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    initializeAudio();
  }

  String _printDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, "0");
    String twoDigitMinutes = twoDigits(duration.inMinutes.remainder(60));
    String twoDigitSeconds = twoDigits(duration.inSeconds.remainder(60));
    return "${twoDigits(duration.inHours)}:$twoDigitMinutes:$twoDigitSeconds";
  }

  Future<void> initializeAudio() async {
    //TODO: make sure that the audio file (url) exists
    await player.open(Media(widget.asset.file!), play: false);
    _positionStream = player.stream.position.listen((e) {
      //only change position of slider when the user is not actively using the slider
      if (!currentlyChangingSlider) {
        setState(() {
          _position = e;
        });
      }
    });
    _durationStream = player.stream.duration.listen((e) {
      setState(() {
        _totalDuration = e;
      });
    });
    _isPlayingStream = player.stream.playing.listen((e) {
      setState(() {
        _playing = e;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        children: [
          IconButton(
            icon: _playing
                ? const Icon(Icons.pause)
                : const Icon(Icons.play_arrow),
            onPressed: () {
              player.playOrPause();
            },
          ),
          Slider(
            value: _position.inSeconds.toDouble(),
            min: 0,
            max: _totalDuration.inSeconds.toDouble(),
            onChanged: (value) {
              setState(() {
                _position = Duration(seconds: value.toInt());
              });
            },
            onChangeStart: (value) {
              setState(() {
                currentlyChangingSlider = true;
              });
            },
            onChangeEnd: (value) {
              setState(() {
                currentlyChangingSlider = false;
              });
              player.seek(Duration(seconds: value.toInt()));
            },
          ),
          Text(
              '${_printDuration(_position)} / ${_printDuration(_totalDuration)}'),
        ],
      ),
    );
  }
}
