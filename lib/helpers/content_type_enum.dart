import 'package:flutter/material.dart';

enum ContentType {
  image("image", Icon(Icons.image)),
  video("video", Icon(Icons.video_file)),
  pdf("pdf", Icon(Icons.picture_as_pdf)),
  audio("audio", Icon(Icons.audio_file)),
  text("text", Icon(Icons.description)),
  threeD("threeD", Icon(Icons.view_in_ar));

  const ContentType(this.key, this.icon);
  final String key;
  final Icon icon;
}
