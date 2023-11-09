import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:guider/helpers/constants.dart';
import 'package:guider/helpers/localstorage/app_util.dart';
import 'package:guider/helpers/localstorage/localstorage.dart';
import 'package:guider/languages/languages.dart';
import 'package:guider/views/fullscreen_image_viewer.dart';
import 'package:media_kit/media_kit.dart';
import 'package:media_kit_video/media_kit_video.dart';
import 'package:pdfx/pdfx.dart';
import 'package:http/http.dart' as http;
import 'dart:io' show File, Platform;
import 'package:model_viewer_plus/model_viewer_plus.dart';
import 'package:flutter/foundation.dart' as foundation;

class FileObject {
  final int id;
  final String? url;
  final ContentType type;
  final String? textfield;
  final String folderName;
  FileObject(
      {required this.id,
      required this.url,
      required this.type,
      required this.textfield,
      required this.folderName});
}

Map<String, Function> fileTypeToWidget = {
  // 'jpg', 'png', 'jpeg', 'webp'
  for (var ext in ['image']) ext: (file) => ImageFileWidget(fileObject: file),
  for (var ext in ['pdf']) ext: (file) => PdfFileWidget(fileObject: file),
  // 'mp3', 'wav'
  for (var ext in ['audio']) ext: (file) => AudioFileWidget(fileObject: file),
  // 'mp4'
  for (var ext in ['video']) ext: (file) => VideoFileWidget(fileObject: file),
  for (var ext in ['text']) ext: (file) => TextWidget(fileObject: file),
  for (var ext in ['threeD']) ext: (file) => ThreeDWidget(fileObject: file),
};

abstract class FileWidget extends StatefulWidget {
  final FileObject fileObject;

  const FileWidget({super.key, required this.fileObject});

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
  const VideoFileWidget({super.key, required FileObject fileObject})
      : super(fileObject: fileObject);

  @override
  State<FileWidget> createState() => _VideoFileWidgetState();
}

class _VideoFileWidgetState extends _FileWidgetState {
  late final player = Player();
  // Create a [VideoController] to handle video output from [Player].
  late final controller = VideoController(player);
  Duration skip = const Duration(seconds: 5);
  String? path;

  @override
  void initState() {
    super.initState();
    getFilePath();
  }

  @override
  void dispose() {
    player.dispose();
    super.dispose();
  }

  void getFilePath() async {
    if (!kIsWeb) {
      path = await AppUtil.filePath(widget.fileObject.id, widget.fileObject.url,
          widget.fileObject.folderName);
    } else {
      //TODO: make sure that the video file (url) exists
      path = widget.fileObject.url ?? "";
    }
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    if (path != null && path!.isNotEmpty) {
      player.open(Media(path!));
    }
    final video = Video(
      controller: controller,
    );

    return Scaffold(
      appBar: AppBar(title: const Text("Video Viewer")),
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
  const ImageFileWidget({super.key, required FileObject fileObject})
      : super(fileObject: fileObject);

  @override
  State<FileWidget> createState() => _ImageFileWidgetState();
}

class _ImageFileWidgetState extends _FileWidgetState {
  final String tagName =
      "assetTag"; //to make the fullscreen viewer work it needs a reference tag

  @override
  Widget build(BuildContext context) {
    final l = Languages.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text("Image Viewer"),
      ),
      body: Center(
        child: GestureDetector(
          child: Hero(
            tag: tagName,
            child: FractionallySizedBox(
              widthFactor: 0.75,
              child: (foundation.kIsWeb)
                  ? Image.network(
                      widget.asset.file!,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Container(
                          color: Colors.red,
                          alignment: Alignment.center,
                          child: const Text(
                            'No image',
                          ),
                        );
                      },
                    )
                  : FutureBuilder(
                      future: AppUtil.filePath(widget.asset.id,
                          widget.asset.file, Const.assetsImagesFolderName.key),
                      builder: (_, snapshot) {
                        if (snapshot.hasError) {
                          return Text(l!.somethingWentWrong);
                        }
                        if ((snapshot.connectionState ==
                            ConnectionState.waiting)) {
                          return const CircularProgressIndicator();
                        }
                        if (snapshot.data!.isNotEmpty) {
                          return Image.file(
                            File(snapshot.data!),
                            fit: BoxFit.cover,
                          );
                        }
                        return Center(
                          child: Text(l!.noImageAvailable),
                        );
                      },
                    ),
            ),
          ),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => FullScreenImageViewer(
                      id: widget.asset.id,
                      url: widget.asset.file!,
                      folderName: Const.assetsImagesFolderName.key,
                      tagName: tagName)),
            );
          },
        ),
      ),
    );
  }
}

class PdfFileWidget extends FileWidget {
  const PdfFileWidget({super.key, required FileObject fileObject})
      : super(fileObject: fileObject);

  @override
  State<FileWidget> createState() => _PdfFileWidgetState();
}

class _PdfFileWidgetState extends _FileWidgetState {
  PdfControllerPinch? _pdfController;
  final int _initialPage = 1;
  bool loading = true;
  Timer? timer;

  @override
  void initState() {
    super.initState();
    _loadDocument();

    // show "No PDF available." if nothing has been loaded after 5 seconds
    timer = Timer(const Duration(seconds: 5), () {
      setState(() {
        loading = false;
      });
    });
  }

  Future<void> _loadDocument() async {
    if (kIsWeb) {
      var response = await http.get(Uri.parse(widget.fileObject.url!));
      setState(() {
        _pdfController = PdfControllerPinch(
          document: PdfDocument.openData(response.bodyBytes),
          initialPage: _initialPage,
        );
      });
    } else {
      final path = await AppUtil.filePath(widget.fileObject.id,
          widget.fileObject.url, widget.fileObject.folderName);

      if (path.isNotEmpty) {
        final document = PdfDocument.openFile(path);
        setState(() {
          _pdfController = PdfControllerPinch(
            document: document,
            initialPage: _initialPage,
          );
        });
      }
    }
  }

  @override
  void dispose() {
    timer?.cancel();
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
          title: const Text("PDF Viewer"),
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
                : loading
                    ? const CircularProgressIndicator()
                    : const Icon(
                        Icons.cancel,
                        color: Colors.redAccent,
                      ),
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
            ? loading
                ? const Center(child: CircularProgressIndicator())
                : Center(child: Text(Languages.of(context)!.noContentAvailable))
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
  const AudioFileWidget({super.key, required FileObject fileObject})
      : super(fileObject: fileObject);

  @override
  State<FileWidget> createState() => _AudioFileWidgetState();
}

class _AudioFileWidgetState extends _FileWidgetState {
  final player = Player();
  Duration _position = Duration.zero;
  Duration _totalDuration = Duration.zero;
  bool _playing = false;
  StreamSubscription<Duration>? _positionStream;
  StreamSubscription<Duration>? _durationStream;
  bool currentlyChangingSlider = false;
  bool? audioAvailable;

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
    String path;

    if (!kIsWeb) {
      path = await AppUtil.filePath(widget.fileObject.id, widget.fileObject.url,
          widget.fileObject.folderName);
    } else {
      path = widget.fileObject.url ?? "";
    }

    if (path.isNotEmpty) {
      audioAvailable = true;
      await player.open(Media(path), play: false);
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
    } else {
      setState(() {
        audioAvailable = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Audio Listener")),
      body: Center(
        child: audioAvailable == null
            ? const CircularProgressIndicator()
            : audioAvailable!
                ? Column(
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
                  )
                : Text(Languages.of(context)!.noContentAvailable),
      ),
    );
  }
}

class TextWidget extends FileWidget {
  const TextWidget({super.key, required FileObject fileObject})
      : super(fileObject: fileObject);

  @override
  State<FileWidget> createState() => _TextWidgetState();
}

class _TextWidgetState extends _FileWidgetState {
  final ScrollController _scrollController = ScrollController();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Text Viewer"),
      ),
      body: Column(
        children: [
          Expanded(
              child: Scrollbar(
            thumbVisibility: true,
            controller: _scrollController,
            child: SingleChildScrollView(
              controller: _scrollController,
              child: Text.rich(TextSpan(
                  text: widget.asset.textfield ??
                      Languages.of(context)!.noContentAvailable)),
            ),
          ))
        ],
      ),
    );
  }
}

class ThreeDWidget extends FileWidget {
  const ThreeDWidget({super.key, required FileObject fileObject})
      : super(fileObject: fileObject);

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
    if (!kIsWeb && isDevice()) {
      String fileName = await AppUtil.filePath(widget.fileObject.id,
          widget.fileObject.url, widget.fileObject.folderName);
      if (fileName.isNotEmpty) {
        path = "file://$fileName";
      } else {
        path = "";
      }
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
