import {Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild, AfterViewChecked} from '@angular/core';
import {ModalController, ToastController, Platform, Events} from '@ionic/angular';
import {ToastService} from '../../../services/toast-service';
import {StreamingMedia, StreamingVideoOptions} from '@ionic-native/streaming-media/ngx';
import {DownloadService} from '../../../services/download-service';
import { Base64ToGallery, Base64ToGalleryOptions } from '@ionic-native/base64-to-gallery/ngx';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'draw-image-modal-component',
  templateUrl: 'draw-image-modal-component.html',
  styleUrls: ['draw-image-modal-component.scss']
})

export class DrawImageModalComponent implements AfterViewChecked {

      @Input() fileUrl: string;
      @Input() fileTitle: string;
      @Input() modelName: string;
      @Input() saveName: string;

      consoleLog: any;

      @ViewChild('imageCanvas', { static: false }) canvas: any;
      canvasElement: any;
      saveX: number;
      saveY: number;

      modelElement: any;

      isInit = false;

      @ViewChild('domObj', {static: false}) domObj: ElementRef;
     
      selectedColor = '#9e2956';
      colors = [ '#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3' ];
     
      drawing = false;
      lineWidth = 5;
     
      constructor(
        private plt: Platform,
        private base64ToGallery: Base64ToGallery,
        private toastCtrl: ToastController,
        private modalController: ModalController,
        private downloadService: DownloadService,
        private events: Events
      ) {}

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
        this.setBackground();
      }

      ngAfterViewChecked()
      {
          if (!this.isInit) {
            this.init();
          }
      }
     
      startDrawing(ev) {
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
        var canvasPosition = this.canvasElement.getBoundingClientRect();
     
        this.saveX = pageX - canvasPosition.x;
        this.saveY = pageY - canvasPosition.y;
      }
     
      endDrawing() {
        this.drawing = false;
      }
     
      selectColor(color) {
        this.selectedColor = color;
      }
     
      setBackground() {
        var background = new Image();
        background.src = this.fileUrl;
        background.crossOrigin = '*';
        let ctx = this.canvasElement.getContext('2d');
     
        background.onload = () => {
          ctx.drawImage(background, 0, 0, this.canvasElement.width, this.canvasElement.height);   
        }
      }

    moved(ev) {
      if (!this.drawing) return;
     
      var canvasPosition = this.canvasElement.getBoundingClientRect();
      let ctx = this.canvasElement.getContext('2d');

        let pageX = 0;
        let pageY = 0;
        if (ev instanceof TouchEvent) {
            pageX = ev.changedTouches[0].pageX;
            pageY = ev.changedTouches[0].pageY;
        } else {
            pageX = ev.pageX;
            pageY = ev.pageY;
        }
     
      let currentX = pageX - canvasPosition.x;
      let currentY = pageY - canvasPosition.y;
     
      ctx.lineJoin = 'round';
      ctx.strokeStyle = this.selectedColor;
      ctx.lineWidth = this.lineWidth;
     
      ctx.beginPath();
      ctx.moveTo(this.saveX, this.saveY);
      ctx.lineTo(currentX, currentY);
      ctx.closePath();
     
      ctx.stroke();
     
      this.saveX = currentX;
      this.saveY = currentY;
    }
     
    exportCanvasImage() {
      var dataUrl = this.canvasElement.toDataURL();
     
      // Clear the current canvas
      let ctx = this.canvasElement.getContext('2d');
      // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
     
     const data = dataUrl.split(',')[1];
     let blob = this.b64toBlob(data, 'image/png');

     this.downloadService.file
        .writeFile(
            this.downloadService.file.dataDirectory + this.modelName,
            this.saveName,
            blob,
            { replace: true }
        )
        .then(fe => {
            this.consoleLog = this.modelName + ' ' + this.saveName;
            this.events.publish('pdfWasSaved');
            this.dismiss();
            // resolve(finalPath);
            return;
        }).catch(writeFileErr => {
            // resolve(false);
            return;
        });
    }

    b64toBlob(b64Data, contentType) {
      contentType = contentType || '';
      var sliceSize = 512;
      var byteCharacters = atob(b64Data);
      var byteArrays = [];
     
      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
     
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
     
        var byteArray = new Uint8Array(byteNumbers);
     
        byteArrays.push(byteArray);
      }
     
      var blob = new Blob(byteArrays, { type: contentType });
      return blob;
    }

      dismiss() {
          this.modalController.dismiss();
      }
}
