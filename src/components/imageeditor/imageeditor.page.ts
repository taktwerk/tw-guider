import { ModalController } from '@ionic/angular';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import ImageEditor from 'tui-image-editor';
import { RecordedFile, DownloadService } from 'src/services/download-service';
import { Filesystem, FilesystemDirectory } from '@capacitor/core';
import { File } from '@ionic-native/file/ngx';

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
  constructor(private modalController: ModalController, private downloadService: DownloadService, private file: File) { }

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
    var dataURL = this.ImageEditor.toDataURL();
    var blob = this.base64ToBlob(dataURL);

    const fileName = new Date().getTime() + '.png';
    const recordedFile = new RecordedFile();

    // const savedFile = await Filesystem.writeFile({
    //   path: fileName,
    //   data: dataURL,
    //   directory: Filesystem.DEFAULT_DIRECTORY
    // }).then(async (res) => {
    //   console.log(res)
    //   // recordedFile.uri = "file:///storage/emulated/0/Android/data/com.taktwerk.twguider2/cache/" + fileName;
    //   recordedFile.uri = await this.downloadService.getResolvedNativeFilePath('file:///storage/emulated/0/Android/data/com.taktwerk.twguider2/cache/' + fileName);
    //   console.log(recordedFile)
    //   this.model.setFile(recordedFile);
    //   await this.modalController.dismiss();
    // }).catch((e) => {
    //   console.log(e)
    // })
    this.downloadService.checkTempDir().then((e) => {
      this.file.writeFile(this.file.dataDirectory + '/_temp', fileName, blob, { replace: true }).then(async (res) => {
        console.log(res)
        recordedFile.uri = await this.downloadService.getResolvedNativeFilePath(res.nativeURL);
        this.model.setFile(recordedFile);
        await this.modalController.dismiss();
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

  onReady(e) {

  }
}
