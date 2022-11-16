/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @angular-eslint/component-selector */

import { AfterViewChecked, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { DownloadService } from 'app/library/services/download-service';
import { MiscService } from 'app/library/services/misc-service';
import { TranslateConfigService } from 'app/library/services/translate-config.service';

@Component({
  selector: 'draw-image-modal-component',
  templateUrl: 'draw-image-modal-component.html',
  styleUrls: ['draw-image-modal-component.scss']
})

export class DrawImageModalComponent implements AfterViewChecked {

  @Input() fileUrl: any;
  @Input() fileTitle: any;
  @Input() modelName: any;
  @Input() saveName: any;

  consoleLog: any;

  @ViewChild('imageCanvas') canvas: any;
  @ViewChild('mainCanvas') mainCanvas: any;
  canvasElement: any;
  mainCanvasElement: any;
  saveX: any;
  saveY: any;

  context: any;
  mainContext: any;
  scale: any;

  modelElement: any;

  isInit = false;

  @ViewChild('domObj') domObj: ElementRef | any;

  selectedColor = '#9e2956';
  colors = ['#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3'];

  drawing = false;
  lineWidth = 5;

  saveTranslatdWord = 'Save';

  constructor(
    private plt: Platform,
    private modalController: ModalController,
    private downloadService: DownloadService,
    private translateConfigService: TranslateConfigService,
    private miscService: MiscService
  ) {
    this.saveTranslatdWord = this.translateConfigService.translateWord('save');
  }

  init() {
    if (this.isInit) {
      return;
    }
    if (!this.domObj.nativeElement) {
      return;
    }
    this.modelElement = this.domObj.nativeElement;
    if (!this.modelElement.clientWidth || !this.modelElement.clientHeight) {
      return;
    }
    this.isInit = true;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.plt.width() + '';
    this.canvasElement.height = this.modelElement.clientHeight;

    this.mainCanvasElement = this.mainCanvas.nativeElement;
    this.mainCanvasElement.width = this.plt.width() + '';
    this.mainCanvasElement.height = this.modelElement.clientHeight;
    this.setBackground(this.fileUrl, true);

    window.onresize = () => {
      console.log('onresize now');
      const dataUrl = this.mainCanvasElement.toDataURL();
      this.canvasElement.width = this.plt.width() + '';
      this.canvasElement.height = this.modelElement.clientHeight;

      this.setBackground(dataUrl);
    };
  }

  ngAfterViewChecked() {
    if (!this.isInit) {
      this.init();
    }
  }

  startDrawing(ev: any) {
    let pageX = 0;
    let pageY = 0;
    if (ev instanceof TouchEvent) {
      pageX = ev.changedTouches[0].pageX;
      pageY = ev.changedTouches[0].pageY;
    } else {
      pageX = ev.pageX;
      pageY = ev.pageY;
    }
    this.drawing = true;
    const canvasPosition = this.canvasElement.getBoundingClientRect();

    this.saveX = pageX - canvasPosition.x;
    this.saveY = pageY - canvasPosition.y;
  }

  endDrawing() {
    this.drawing = false;
  }

  selectColor(color: any) {
    this.selectedColor = color;
  }

  setBackground(fileUrl: any, shouldCreateMainCanvas = false) {
    const background = new Image();
    background.src = fileUrl;
    // background.crossOrigin = '*';
    this.context = this.canvasElement.getContext('2d');
    if (shouldCreateMainCanvas) {
      this.mainContext = this.mainCanvasElement.getContext('2d');
    }

    background.onload = () => {
      // this.context.drawImage(background, 0, 0, 100, this.canvasElement.height);
      let imgWidth = background.naturalWidth;
      const screenWidth = this.canvasElement.width;
      let scaleX = 1;
      if (imgWidth > screenWidth) { scaleX = screenWidth / imgWidth; }
      let imgHeight = background.naturalHeight;
      const screenHeight = this.canvasElement.height;
      let scaleY = 1;
      if (imgHeight > screenHeight) { scaleY = screenHeight / imgHeight; }
      let scale = scaleY;
      if (scaleX < scaleY) { scale = scaleX; }
      if (scale < 1) {
        imgHeight = imgHeight * scale;
        imgWidth = imgWidth * scale;
      }

      this.scale = scale;

      this.canvasElement.height = imgHeight;
      this.canvasElement.width = imgWidth;

      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      this.context.drawImage(background, 0, 0, background.naturalWidth, background.naturalHeight, 0, 0, imgWidth, imgHeight);

      console.log('background', background);

      if (shouldCreateMainCanvas) {
        this.mainCanvasElement.height = background.naturalHeight;
        this.mainCanvasElement.width = background.naturalWidth;

        this.mainContext.drawImage(background, 0, 0, background.naturalWidth, background.naturalHeight);
      }

    };
  }

  moved(ev: any) {
    if (!this.drawing) { return; }

    const canvasPosition = this.canvasElement.getBoundingClientRect();
    // let ctx = this.canvasElement.getContext('2d');

    let pageX = 0;
    let pageY = 0;
    if (ev instanceof TouchEvent) {
      pageX = ev.changedTouches[0].pageX;
      pageY = ev.changedTouches[0].pageY;
    } else {
      pageX = ev.pageX;
      pageY = ev.pageY;
    }

    const currentX = pageX - canvasPosition.x;
    const currentY = pageY - canvasPosition.y;

    this.context.lineJoin = 'round';
    this.context.strokeStyle = this.selectedColor;
    this.context.lineWidth = this.lineWidth;
    this.context.beginPath();
    this.context.moveTo(this.saveX, this.saveY);
    this.context.lineTo(currentX, currentY);
    this.context.closePath();
    this.context.stroke();

    this.mainContext.lineJoin = 'round';
    this.mainContext.strokeStyle = this.selectedColor;
    this.mainContext.lineWidth = this.lineWidth / this.scale;
    this.mainContext.beginPath();
    this.mainContext.moveTo(this.saveX / this.scale, this.saveY / this.scale);
    this.mainContext.lineTo(currentX / this.scale, currentY / this.scale);
    this.mainContext.closePath();
    this.mainContext.stroke();

    this.saveX = currentX;
    this.saveY = currentY;
  }

  exportCanvasImage() {
    this.mainCanvasElement.toBlob((blobFile: any) => {
      this.downloadService.file
        .writeFile(
          this.downloadService.file.dataDirectory + this.modelName,
          this.saveName,
          blobFile,
          { replace: true }
        )
        .then(fe => {
          this.consoleLog = this.modelName + ' ' + this.saveName;
          //  this.events.publish('pdfWasSaved');
          this.miscService.events.next({ TAG: 'pdfWasSaved' });
          this.dismiss();
          // resolve(finalPath);
          return;
        }).catch(writeFileErr => {

        });
    });
  }

  b64toBlob(b64Data: any, contentType: any) {
    contentType = contentType || '';
    const sliceSize = 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
