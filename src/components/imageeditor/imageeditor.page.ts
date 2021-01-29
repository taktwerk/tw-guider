import { ModalController } from '@ionic/angular';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import ImageEditor from 'tui-image-editor';
// import blackTheme from 'black-theme'

interface CustomControls {
  name: string
  icon: string
  subControls?: CustomControls[]
}

@Component({
  selector: 'text-editor',
  templateUrl: './imageeditor.page.html',
  styleUrls: ['./imageeditor.page.scss'],
})
export class ImageEditorComponent implements OnInit {

  @Input() model;

  ImageEditor: ImageEditor;

  currentControl: CustomControls = { name: null, icon: null };
  currentSubControl: CustomControls = { name: null, icon: null };

  controls: CustomControls[] = [
    {
      name: 'Draw',
      icon: 'create',
      subControls: [
        {
          name: 'Free Hand',
          icon: 'pulse',
        },
        {
          name: 'Line',
          icon: 'remove',
        }
      ]
    }
  ]
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

  onControl(control: CustomControls) {
    // stop all modes
    this.ImageEditor.stopDrawingMode();

    //
    this.currentControl.name != control.name ? this.currentControl = control : this.currentControl = { name: null, icon: null };
  }

  onSubControl(control: CustomControls) {
    // stop all modes
    this.ImageEditor.stopDrawingMode();

    // 
    this.currentSubControl.name != control.name ? this.currentSubControl = control : this.currentSubControl = { name: null, icon: null };
    if (this.currentSubControl.name != null) {
      switch (control.name) {
        case ('Free Hand'):
          this.ImageEditor.stopDrawingMode();
          this.ImageEditor.startDrawingMode('FREE_DRAWING', { width: 15, color: 'red' });
          break;
        case ('Line'):
          this.ImageEditor.stopDrawingMode();
          this.ImageEditor.startDrawingMode('LINE_DRAWING', { width: 15, color: 'red' });
          break;
        default:
      }

    }

  }

  closeControl() {
    // stop all modes
    this.ImageEditor.stopDrawingMode();
    this.currentControl = { name: null, icon: null };
    this.currentSubControl = { name: null, icon: null };
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
