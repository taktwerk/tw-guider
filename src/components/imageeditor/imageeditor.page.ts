import { MiscService } from './../../services/misc-service';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import ImageEditor from 'tui-image-editor';
import { RecordedFile, DownloadService } from 'src/services/download-service';
import { File as nFile } from '@ionic-native/file/ngx';
import { ApiSync } from 'src/providers/api-sync';
import { GuideStepService } from 'src/providers/api/guide-step-service';
import { Location } from '@angular/common';
import { Storage } from '@ionic/storage';
import { GuideStepModel } from 'src/models/db/api/guide-step-model';
import { AuthService } from 'src/services/auth-service';

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

  ImageEditor;
  iCanvas
  loading = (message?) => this.loadingController.create({ duration: 2000, message: message || 'Please wait' });
  canvasFile

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
  ]
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
    this.ImageEditor = new ImageEditor(document.querySelector('#tui-image-editor'), {
      cssMaxWidth: document.documentElement.clientWidth,
      cssMaxHeight: document.documentElement.clientHeight,
    });

    // load metadata
    try {
      this.canvasFile = JSON.parse(this.model.design_canvas_file)
    } catch (error) {
      console.log(error)
      console.log("this.model.design_canvas_file", this.model.design_canvas_file)
      console.log("design_canvas_file is probably not an object", this.model.design_canvas_file)
      this.canvasFile = null;
    }

    this.iCanvas = this.ImageEditor._graphics.getCanvas();
    var selectionStyle = this.ImageEditor._graphics.cropSelectionStyle;

    console.log("this.model.local_attached_file", this.model.local_attached_file)
    console.log("this.model.getFileImagePath(1)", this.model.getFileImagePath(1))
    console.log("this.model.getFileImagePath()", this.model.getFileImagePath())

    var originalImageFile = encodeURI(this.model.local_attached_file);
    const convertFileSrc = this.downloadService.getWebviewFileSrc(originalImageFile);
    const SafeImageUrl = this.downloadService.getSafeUrl(convertFileSrc);

    console.log("SafeUrl", SafeImageUrl);
    console.log("this.canvasFile", this.canvasFile);

    setTimeout(async () => {
      this.iCanvas.lowerCanvasEl.style.border = "double #2d2d2b";
      if (this.canvasFile != null) {
        this.ImageEditor.loadImageFromURL(this.canvasFile.backgroundImage.src, 'Editor Test');
      }
      else {
        this.ImageEditor.loadImageFromURL(this.model.getFileImagePath().changingThisBreaksApplicationSecurity, 'Editor Test');
      }
      this.iCanvas.loadFromJSON(this.canvasFile, async () => {
        var list = this.iCanvas.getObjects();
        list.forEach(function (obj) {
          obj.set(selectionStyle);
        });


      });
      (await this.loading()).dismiss();
    }, 200);

    if (this.ImageEditor._invoker._undoStack.length > 1) {
      this.willUndo = true;
    }
    if (!this.ImageEditor.isEmptyRedoStack()) {
      this.willRedo = true;
    }

    this.ImageEditor.on('objectAdded', (props) => { });

    this.ImageEditor.on('mousedown', (e) => { });

    this.ImageEditor.on('objectActivated', (props) => {
      this.selectedAnnotation = props;
    });

    this.ImageEditor.on('redoStackChanged', (length) => {
      console.log("redoStackChanged", length);
      if (this.ImageEditor.isEmptyRedoStack()) {
        this.willRedo = false;
      } else {
        this.willRedo = true;
      }
    });

    this.ImageEditor.on('undoStackChanged', (length) => {
      console.log("undoStackChanged", length);
      if (this.ImageEditor._invoker._undoStack.length === 1 || length === 1) {
        this.willUndo = false;
      } else {
        this.willUndo = true;
      }
    });
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

  onRedo() {
    this.ImageEditor.redo().then(() => {
      if (this.ImageEditor.isEmptyRedoStack()) {
        this.willRedo = false;
      }
    })
  }

  onUndo() {
    if (this.ImageEditor._invoker._undoStack.length > 1) {
      this.ImageEditor.undo().then(() => {
        if (this.ImageEditor._invoker._undoStack.length == 1) {
          this.willUndo = false;
        }
      })
    }
  }

  deleteSelected() {
    this.ImageEditor.removeObject(this.selectedAnnotation.id)
      .then(() => {
        this.selectedAnnotation = null
      })
      .catch((e) => console.log("delete error", e))
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
    const user = await this.authService.getLastUser();
    if (!user) {
      return;
    }
    this.model.user_id = user.userId;
    this.model.created_by = user.userId;
    this.model.client_id = user.client_id;


    this.model.design_canvas_file = JSON.stringify(this.iCanvas);
    (await this.loading('Saving Changes')).present();
    var renderedImageUrl = this.ImageEditor.toDataURL({ format: 'png' });
    var blob = this.base64ToBlob(renderedImageUrl);

    const fileName = new Date().getTime() + '.png';
    const recordedFile = new RecordedFile();

    var xhr = new XMLHttpRequest();
    var originalImageDataUrl;
    var originalImageDataUrlBlob;
    xhr.onload = () => {
      var reader = new FileReader();
      reader.onloadend = () => {
        originalImageDataUrl = reader.result;
        originalImageDataUrlBlob = this.base64ToBlob(originalImageDataUrl);
      }
      reader.readAsDataURL(xhr.response);
    };

    if (JSON.parse(this.model.design_canvas_file).backgroundImage.src) {
      xhr.open('GET', JSON.parse(this.model.design_canvas_file).backgroundImage.src);
    }

    xhr.responseType = 'blob';
    xhr.send();

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
              this.miscService.events.next({ TAG: this.guideStepService.dbModelApi.TAG + ':update' })

              await this.modalController.dismiss();
            }).catch((e) => console.log(e))
          }, 300)
        }).catch((e) => console.log(e))
      }).catch((e) => console.log(e))
    })
  }

  base64ToBlob(data) {
    var rImageType = /data:(image\/.+);base64,/;
    var mimeString = '';
    var raw, uInt8Array, i, rawLength;

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
