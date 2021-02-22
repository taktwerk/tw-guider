import { ModalController, Platform } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import ImageEditor from 'tui-image-editor';
import { RecordedFile, DownloadService } from 'src/services/download-service';
import { File as nFile } from '@ionic-native/file/ngx';
import { ApiSync } from 'src/providers/api-sync';
import { GuideStepService } from 'src/providers/api/guide-step-service';
import { Location } from '@angular/common';


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
  constructor(
    private guideStepService: GuideStepService,
    private modalController: ModalController,
    private downloadService: DownloadService,
    private file: nFile,
    private apiSync: ApiSync,
    private location: Location,
    private platform: Platform
  ) {
    this.backButtonEvent();
  }

  ngOnInit() {
    this.ImageEditor = new ImageEditor(document.querySelector('#tui-image-editor'), {
      cssMaxWidth: document.documentElement.clientWidth,
      cssMaxHeight: document.documentElement.clientHeight,
    });

    // this.ImageEditor.loadImageFromURL(this.model.getFileImagePath().changingThisBreaksApplicationSecurity, 'Editor Test').then(() => {
    // this.ImageEditor.clearUndoStack();
    //  console.log("this.model.design_canvas_meta", this.model.design_canvas_meta)
    // load metadata
    var canvasMeta = JSON.parse(this.model.design_canvas_meta);
    // console.log("this.model.design_canvas_meta", canvasMeta);

    this.iCanvas = this.ImageEditor._graphics.getCanvas();
    // console.log("this.iCanvas", this.iCanvas)

    var selectionStyle = this.ImageEditor._graphics.cropSelectionStyle;
    // console.log("selectionStyle", selectionStyle)

    setTimeout(() => {
      this.iCanvas.lowerCanvasEl.style.border = "double #2d2d2b";
      this.ImageEditor.loadImageFromURL(this.model.getFileImagePath().changingThisBreaksApplicationSecurity, 'Editor Test')

      this.iCanvas.loadFromJSON(canvasMeta, () => {
        var list = this.iCanvas.getObjects();
        list.forEach(function (obj) {
          obj.set(selectionStyle);
        });
      });
    }, 200);
    // })

    this.ImageEditor.on('objectAdded', (props) => {
      console.log("objectAdded");
      console.log(props);
    });

    this.ImageEditor.on('mousedown', () => {
      console.log("mousedown");
      console.log(this.ImageEditor._graphics._objects[0]);
    });

    this.ImageEditor.on('objectActivated', (props) => {
      console.log("objectActivated");
      console.log(props);
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
    var dataURL = this.ImageEditor.toDataURL({ format: 'png' });
    var blob = this.base64ToBlob(dataURL);

    const fileName = new Date().getTime() + '.png';
    const recordedFile = new RecordedFile();

    this.downloadService.checkTempDir('_temp').then(() => {
      this.file.writeFile(this.file.dataDirectory + '/_temp', fileName, blob, { replace: true }).then(async (res) => {
        //  console.log(res)
        recordedFile.uri = await this.downloadService.getResolvedNativeFilePath(res.nativeURL);
        this.model.setFile(recordedFile);
        this.model.design_canvas_meta = JSON.stringify(this.iCanvas);
        // console.log("onSave this.model.design_canvas_meta", this.model.design_canvas_meta)
        this.guideStepService.save(this.model).then(async () => {
          this.apiSync.setIsPushAvailableData(true);
          await this.modalController.dismiss();
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


  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(1, (processNextHandler) => {
      // this.platform.backButton.subscribeWithPriority(10, () => {
      // this.routerOutlets.forEach(async (r) => {
      // console.log(this.location.path)
      console.log(this.location)
      if (this.location.isCurrentPathEqualTo('/guide-categories')) {
        processNextHandler();
        console.log("no back")
      }
      else {
        this.location.back();
        processNextHandler();
        console.log("is back")
      }
    });
  }
}
