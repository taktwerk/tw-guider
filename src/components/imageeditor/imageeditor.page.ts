import { ModalController } from '@ionic/angular';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import ImageEditor from 'tui-image-editor';
// import blackTheme from 'black-theme'

@Component({
  selector: 'text-editor',
  templateUrl: './imageeditor.page.html',
  styleUrls: ['./imageeditor.page.scss'],
})
export class ImageEditorComponent implements OnInit {

  @Input() model;

  ImageEditor: ImageEditor;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    // var FileSaver = require('file-saver');
    this.ImageEditor = new ImageEditor(document.querySelector('#tui-image-editor'), {
      cssMaxWidth: document.documentElement.clientWidth,
      cssMaxHeight: document.documentElement.clientHeight,
    });

    this.ImageEditor.loadImageFromURL(this.model.getFileImagePath().changingThisBreaksApplicationSecurity, 'Editor Test').then(() => {
      this.ImageEditor.clearUndoStack();
    })

  }

  onChange(e) {
    console.log(e);
  }

  async onDone() {
    await this.modalController.dismiss();
  }

  onReady(e) {

  }
}
