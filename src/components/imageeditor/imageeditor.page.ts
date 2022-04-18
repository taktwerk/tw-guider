/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @angular-eslint/component-selector */
import { MiscService } from './../../services/misc-service';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { RecordedFile, DownloadService } from '../../services/download-service';
// import { File as nFile } from '@ionic-native/file/ngx';
import { File as nFile } from '@awesome-cordova-plugins/file/ngx';
import { ApiSync } from '../../providers/api-sync';
import { GuideStepService } from '../../providers/api/guide-step-service';
import { Location } from '@angular/common';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from '../../services/auth-service';
// import 'tui-image-editor';
// const tui = import('tui-image-editor');


import * as tui from 'tui-image-editor/dist/tui-image-editor'


interface CustomControls {
  name: string;
  icon: string;
  subControls?: CustomControls[];
}


@Component({
  selector: 'text-editor',
  templateUrl: './imageeditor.page.html',
  styleUrls: ['./imageeditor.page.scss'],
})
export class ImageEditorComponent implements OnInit {

  @Input() model;

  // ImageEditor: any;
  editor: any;
  ImageEditor: any;
  iCanvas;
  loading = (message?) => this.loadingController.create({ duration: 2000, message: message || 'Please wait' });
  canvasFile;

  currentControl: CustomControls = { name: null, icon: null };
  currentSubControl: CustomControls = { name: null, icon: null };

  selectedAnnotation = null;
  willRedo = false;
  willUndo = false;

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
  ];
  constructor(private storage: Storage,
    private guideStepService: GuideStepService,
    private modalController: ModalController,
    private downloadService: DownloadService,
    private file: nFile,
    private apiSync: ApiSync,
    private location: Location,
    public platform: Platform,
    public loadingController: LoadingController,
    public authService: AuthService,
    public miscService: MiscService
  ) { }

  ionViewDidEnter() {
    this.storage.set('ImageEditorComponentOpen', true);
  }

  async ngOnInit() {
    (await this.loading('Loading Canvas')).present();

    // this.ImageEditor = new (await tui).default();

    // this.ImageEditor.

    // console.log(tui);

    this.editor = new tui(document.querySelector('#tui-image-editor'), {
      cssMaxWidth: document.documentElement.clientWidth,
      cssMaxHeight: document.documentElement.clientHeight,
    });

    // load metadata
    try {
      console.log("check this.model.local_attached_file", this.model.local_attached_file);
      // this.canvasFile = JSON.parse(this.model.design_canvas_file);
      // this.canvasFile = JSON.parse(this.model.local_attached_file);
      this.canvasFile = this.model.local_attached_file;
      console.log("check this.canvasFile", this.canvasFile);
    }
    catch (error) {
      console.log(error);
      this.canvasFile = null;
    }


    this.iCanvas = this.editor._graphics.getCanvas();
    const selectionStyle = this.editor._graphics.cropSelectionStyle;

    console.log('this.model.local_attached_file', this.model.local_attached_file);
    console.log('this.model.getFileImagePath(1)', this.model.getFileImagePath(1));
    console.log('this.model.getFileImagePath()', this.model.getFileImagePath());

    const originalImageFile = encodeURI(this.model.local_attached_file);
    const convertFileSrc = this.downloadService.getWebviewFileSrc(originalImageFile);
    const SafeImageUrl = this.downloadService.getSafeUrl(convertFileSrc);

    // console.log('SafeUrl', SafeImageUrl);
    // console.log('this.canvasFile', this.canvasFile);

    setTimeout(async () => {
      this.iCanvas.lowerCanvasEl.style.border = 'double #2d2d2b';
      if (this.canvasFile != null) {
        // console.log("this.editor==>", this.editor);
        console.log("check this.canvasFile.backgroundImage.src", this.canvasFile);
        this.editor.loadImageFromURL(this.canvasFile, 'Editor Test');
      }
      else {
        this.editor.loadImageFromURL(this.model.getFileImagePath().changingThisBreaksApplicationSecurity, 'Editor Test');
      }
      // this.iCanvas.loadFromJSON(this.canvasFile, async () => {
      //   const list = this.iCanvas.getObjects();
      //   list.forEach((obj) => {
      //     obj.set(selectionStyle);
      //   });


      // });
      (await this.loading()).dismiss();
    }, 200);

    if (this.editor._invoker._undoStack.length > 1) {
      this.willUndo = true;
    }
    if (!this.editor.isEmptyRedoStack()) {
      this.willRedo = true;
    }

    this.editor.on('objectAdded', (props) => { });

    this.editor.on('mousedown', (e) => { });

    this.editor.on('objectActivated', (props) => {
      this.selectedAnnotation = props;
    });

    this.editor.on('redoStackChanged', (length) => {
      console.log('redoStackChanged', length);
      if (this.editor.isEmptyRedoStack()) {
        this.willRedo = false;
      } else {
        this.willRedo = true;
      }
    });

    this.editor.on('undoStackChanged', (length) => {
      console.log('undoStackChanged', length);
      if (this.editor._invoker._undoStack.length === 1 || length === 1) {
        this.willUndo = false;
      } else {
        this.willUndo = true;
      }
    });
  }

  onControl(control: CustomControls) {
    // stop all modes
    this.editor.stopDrawingMode();
    //
    this.currentControl.name !== control.name ? this.currentControl = control : this.currentControl = { name: null, icon: null };
  }

  onSubControl(control: CustomControls) {
    // stop all modes
    this.editor.stopDrawingMode();
    //
    this.currentSubControl.name !== control.name ? this.currentSubControl = control : this.currentSubControl = { name: null, icon: null };
    if (this.currentSubControl.name != null) {
      switch (control.name) {
        case ('Free Hand'):
          this.editor.stopDrawingMode();
          this.editor.startDrawingMode('FREE_DRAWING', { width: 15, color: 'red' });
          break;
        case ('Line'):
          this.editor.stopDrawingMode();
          this.editor.startDrawingMode('LINE_DRAWING', { width: 15, color: 'red' });
          break;
        default:
      }
    }
  }

  onRedo() {
    this.editor.redo().then(() => {
      if (this.editor.isEmptyRedoStack()) {
        this.willRedo = false;
      }
    });
  }

  onUndo() {
    if (this.editor._invoker._undoStack.length > 1) {
      this.editor.undo().then(() => {
        if (this.editor._invoker._undoStack.length === 1) {
          this.willUndo = false;
        }
      });
    }
  }

  deleteSelected() {
    this.editor.removeObject(this.selectedAnnotation.id)
      .then(() => {
        this.selectedAnnotation = null;
      })
      .catch((e) => console.log('delete error', e));
  }

  closeControl() {
    // stop all modes
    this.editor.stopDrawingMode();
    this.currentControl = { name: null, icon: null };
    this.currentSubControl = { name: null, icon: null };
  }

  onChange(e) {
    console.log(e);
  }

  stringify(circObj: Object) {
    const replacerFunc = () => {
      const visited = new WeakSet();
      return (key: any, value: any) => {
        if (typeof value === "object" && value !== null) {
          if (visited.has(value)) {
            return;
          }
          visited.add(value);
        }
        return value;
      };
    };

    return JSON.stringify(circObj, replacerFunc())
  }

  async onDone() {
    const user = await this.authService.getLastUser();
    if (!user) {
      return;
    }
    this.model.user_id = user.userId;
    this.model.created_by = user.userId;
    this.model.client_id = user.client_id;


    this.model.design_canvas_file = this.stringify(this.iCanvas);
    (await this.loading('Saving Changes')).present();
    const renderedImageUrl = this.editor.toDataURL({ format: 'png' });
    console.log("check rendered Image URL", renderedImageUrl);
    const blob = this.base64ToBlob(renderedImageUrl);
    console.log("check blob", blob);

    const fileName = new Date().getTime() + '.png';
    const recordedFile = new RecordedFile();

    const xhr = new XMLHttpRequest();
    let originalImageDataUrl;
    let originalImageDataUrlBlob;
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        originalImageDataUrl = reader.result;
        originalImageDataUrlBlob = this.base64ToBlob(originalImageDataUrl);
      };
      reader.readAsDataURL(xhr.response);
    };

    if (JSON.parse(this.model.design_canvas_file).backgroundImage.src) {
      xhr.open('GET', JSON.parse(this.model.design_canvas_file).backgroundImage.src);
    }

    xhr.responseType = 'blob';
    xhr.send();

    if (this.downloadService.testBrowser) {
      this.modalController.dismiss();
      return;
    } else if (this.downloadService.platform.is('capacitor')) {
      this.downloadService.checkTempDir('_temp').then(() => {
        this.file.writeFile(this.file.dataDirectory + '/_temp', fileName, originalImageDataUrlBlob, { replace: true }).then(async (thumbres) => {
          recordedFile.thumbnailUri = await this.downloadService.getResolvedNativeFilePath(thumbres.nativeURL);

          this.file.writeFile(this.file.dataDirectory + '/_temp', fileName, blob, { replace: true }).then(async (urires) => {

            recordedFile.uri = await this.downloadService.getResolvedNativeFilePath(urires.nativeURL);
            this.model.setFile(recordedFile);

            setTimeout(() => {
              this.guideStepService.save(this.model).then(async (res) => {
                this.apiSync.setIsPushAvailableData(true);

                this.storage.set('ImageEditorComponentOpen', false);
                (await this.loading()).dismiss({ canvasSaved: true });
                this.miscService.events.next({ TAG: this.guideStepService.dbModelApi.TAG + ':update' });

                await this.modalController.dismiss();
              }).catch((e) => console.log(e));
            }, 300);
          }).catch((e) => console.log(e));
        }).catch((e) => console.log(e));
      });
    }
  }

  base64ToBlob(data) {
    const rImageType = /data:(image\/.+);base64,/;
    let mimeString = '';
    let raw; let uInt8Array; let i; let rawLength;

    raw = data.replace(rImageType, (header, imageType) => {
      mimeString = imageType;
      return '';
    });

    raw = atob(raw);
    rawLength = raw.length;
    uInt8Array = new Uint8Array(rawLength);

    for (i = 0; i < rawLength; i += 1) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: mimeString });
  }

  onReady() { }



}
