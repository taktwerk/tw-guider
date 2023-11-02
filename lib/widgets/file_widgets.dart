import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:media_kit/media_kit.dart';
import 'package:media_kit_video/media_kit_video.dart';
import 'package:pdfx/pdfx.dart';
import 'package:http/http.dart' as http;
import 'dart:io' show Platform;

Map<String, Function> fileTypeToWidget = {
  // 'jpg', 'png', 'jpeg', 'webp'
  for (var ext in ['image']) ext: (file) => ImageFileWidget(asset: file),
  for (var ext in ['pdf']) ext: (file) => PdfFileWidget(asset: file),
  // 'mp3', 'wav'
  for (var ext in ['audio']) ext: (file) => AudioFileWidget(asset: file),
  // 'mp4'
  for (var ext in ['video']) ext: (file) => VideoFileWidget(asset: file),
  for (var ext in ['text']) ext: (file) => TextWidget(asset: file),
  for (var ext in ['threeD']) ext: (file) => ThreeDWidget(asset: file),
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
  Duration skip = const Duration(seconds: 5);

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

    return Scaffold(
      appBar: AppBar(title: Text("Video Viewer")),
      body: Center(
        child: kIsWeb
            ? video
            : (Platform.isIOS || Platform.isAndroid)
                ? getDeviceVideoControls(video)
                : (Platform.isWindows || Platform.isMacOS || Platform.isLinux)
                    ? getDesktopVideoControls(video)
                    : video,
      ),
    );
  }

  Duration getNewPosition(Duration time) {
    // set current position to 0 seconds if player.state.position - skip is under 0 seconds.
    if (time.compareTo(const Duration(seconds: 0)) <= 0) {
      return const Duration(seconds: 0);
    }
    // set current position to 'duration' seconds if player.state.position + skip is over 'duration' seconds
    if (time.compareTo(player.state.duration) > 0) {
      return player.state.duration;
    } else {
      return time;
    }
  }

  Widget getDesktopVideoControls(video) {
    return MaterialDesktopVideoControlsTheme(
      child: video,
      normal: MaterialDesktopVideoControlsThemeData(
        bottomButtonBar: getBottomBarDesktop(),
        topButtonBar: [
          const Spacer(),
          MaterialDesktopCustomButton(
            onPressed: () {
              debugPrint('Custom "Settings" button pressed.');
            },
            icon: const Icon(Icons.settings),
          ),
        ],
      ),
      fullscreen: MaterialDesktopVideoControlsThemeData(
          controlsHoverDuration: const Duration(seconds: 1),
          primaryButtonBar: getPrimaryBarDesktop(),
          bottomButtonBar: getBottomBarDesktop()),
    );
  }

  Widget getDeviceVideoControls(video) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: MaterialVideoControlsTheme(
        normal: MaterialVideoControlsThemeData(
          primaryButtonBar: getPrimaryBarDevice(),
          topButtonBar: [
            const Spacer(),
            MaterialDesktopCustomButton(
              onPressed: () {
                debugPrint('Custom "Settings" button pressed.');
              },
              icon: const Icon(Icons.settings),
            ),
          ],
        ),
        fullscreen: MaterialVideoControlsThemeData(
            primaryButtonBar: getPrimaryBarDevice()),
        child: video,
      ),
    );
  }

  List<Widget> getBottomBarDesktop() {
    return [
      const MaterialDesktopPlayOrPauseButton(),
      const MaterialDesktopVolumeButton(),
      const MaterialDesktopPositionIndicator(),
      MaterialDesktopCustomButton(
          icon: const Icon(Icons.replay_5),
          onPressed: () {
            player.seek(
              getNewPosition(player.state.position - skip),
            );
          }),
      MaterialDesktopCustomButton(
          icon: const Icon(Icons.forward_5),
          onPressed: () =>
              player.seek(getNewPosition(player.state.position + skip))),
      const Spacer(),
      const MaterialDesktopFullscreenButton(),
    ];
  }

  List<Widget> getPrimaryBarDesktop() {
    return [
      const Spacer(flex: 2),
      MaterialDesktopCustomButton(
          icon: const Icon(Icons.replay_5),
          onPressed: () =>
              player.seek(getNewPosition(player.state.position - skip))),
      const Spacer(),
      const MaterialDesktopPlayOrPauseButton(iconSize: 48.0),
      const Spacer(),
      MaterialDesktopCustomButton(
          icon: const Icon(Icons.forward_5),
          onPressed: () =>
              player.seek(getNewPosition(player.state.position + skip))),
      const Spacer(flex: 2)
    ];
  }

  List<Widget> getPrimaryBarDevice() {
    return [
      const Spacer(flex: 2),
      MaterialCustomButton(
          icon: const Icon(Icons.replay_5),
          onPressed: () =>
              player.seek(getNewPosition(player.state.position - skip))),
      const Spacer(),
      const MaterialPlayOrPauseButton(iconSize: 48.0),
      const Spacer(),
      MaterialCustomButton(
          icon: const Icon(Icons.forward_5),
          onPressed: () =>
              player.seek(getNewPosition(player.state.position + skip))),
      const Spacer(flex: 2)
    ];
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

    return Scaffold(
        appBar: AppBar(
          title: Text("Image Viewer"),
        ),
        body: Center(
          child: Image.network(
            widget.asset.file!,
          ),
        ));

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
  PdfControllerPinch? _pdfController;
  final int _initialPage = 1;

  @override
  void initState() {
    super.initState();
    _loadDocument();
  }

  Future<void> _loadDocument() async {
    var response = await http.get(Uri.parse(widget.asset.file!));
    setState(() {
      _pdfController = PdfControllerPinch(
        document: PdfDocument.openData(response.bodyBytes),
        initialPage: _initialPage,
      );
    });
  }

  @override
  void dispose() {
    _pdfController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    Widget loaderWidget = const Center(
      child: CircularProgressIndicator(
        valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
      ),
    );
    return Scaffold(
        appBar: AppBar(
          title: Text("PDF Viewer"),
          actions: <Widget>[
            IconButton(
              icon: const Icon(Icons.navigate_before),
              onPressed: () {
                _pdfController!.previousPage(
                  curve: Curves.ease,
                  duration: const Duration(milliseconds: 100),
                );
              },
            ),
            _pdfController != null
                ? PdfPageNumber(
                    controller: _pdfController!,
                    builder: (_, loadingState, page, pagesCount) => Container(
                      alignment: Alignment.center,
                      child: Text(
                        '$page/${pagesCount ?? 0}',
                        style: const TextStyle(fontSize: 22),
                      ),
                    ),
                  )
                : const CircularProgressIndicator(),
            IconButton(
              icon: const Icon(Icons.navigate_next),
              onPressed: () {
                _pdfController!.nextPage(
                  curve: Curves.ease,
                  duration: const Duration(milliseconds: 100),
                );
              },
            ),
          ],
        ),
        body: _pdfController == null
            ? const Center(child: CircularProgressIndicator())
            : Center(
                child: SafeArea(
                  child: Container(
                    color: Colors.grey,
                    height: MediaQuery.of(context).size.height,
                    child: _pdfController == null
                        ? loaderWidget
                        : PdfViewPinch(
                            builders:
                                PdfViewPinchBuilders<DefaultBuilderOptions>(
                              options: const DefaultBuilderOptions(),
                              documentLoaderBuilder: (_) => const Center(
                                  child: CircularProgressIndicator()),
                              pageLoaderBuilder: (_) => const Center(
                                  child: CircularProgressIndicator()),
                              errorBuilder: (_, error) =>
                                  Center(child: Text(error.toString())),
                            ),
                            controller: _pdfController!,
                          ),
                  ),
                ),
              ));
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
    return Scaffold(
      appBar: AppBar(title: Text("Audio Listener")),
      body: Center(
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
      ),
    );
  }
}

class TextWidget extends FileWidget {
  const TextWidget({super.key, required Asset asset}) : super(asset: asset);

  @override
  State<FileWidget> createState() => _TextWidgetState();
}

class _TextWidgetState extends _FileWidgetState {
  final ScrollController _scrollController = ScrollController();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Text Viewer"),
      ),
      body: Column(
        children: [
          Expanded(
              child: Scrollbar(
            thumbVisibility: true,
            controller: _scrollController,
            child: SingleChildScrollView(
              controller: _scrollController,
              child: Text.rich(TextSpan(text: widget.asset.textfield ?? '')),
            ),
          ))
        ],
      ),
    );
  }
}

class ThreeDWidget extends FileWidget {
  const ThreeDWidget({super.key, required Asset asset}) : super(asset: asset);

  @override
  State<FileWidget> createState() => _ThreeDWidgetState();
}

class _ThreeDWidgetState extends _FileWidgetState {
  String? path;

  @override
  void initState() {
    super.initState();
    getFilePath();
  }

  bool isDevice() {
    return Platform.isAndroid || Platform.isIOS;
  }

  bool isDesktop() {
    return Platform.isMacOS || Platform.isLinux || Platform.isWindows;
  }

  Future<void> getFilePath() async {
    // the 3D model only works on the device (the package webview that is used is only supported on devices)
    if (isDevice()) {
      path =
          "file://${await AppUtil.filePath(widget.asset.id, widget.asset.file, Const.assetsImagesFolderName.key)}";
    } else {
      path = "";
    }
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text("3D Viewer"),
        ),
        body: path != null
            ? path!.isEmpty
                ? Center(child: Text(Languages.of(context)!.noContentAvailable))
                : ModelViewer(
                    backgroundColor: Color.fromARGB(0xFF, 0xEE, 0xEE, 0xEE),
                    src: path!,
                    alt: 'A 3D Model',
                    autoRotate: true,
                  )
            : const CircularProgressIndicator());
  }
}
