import { Component, Input, OnInit } from '@angular/core';
import { DownloadService } from 'src/services/download-service';
import { PictureService } from 'src/services/picture-service';
import { VideoService } from 'src/services/video-service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Viewer3dService } from 'src/services/viewer-3d-service';
import { GuideAssetModelFileMapIndexEnum } from '../../models/db/api/guide-asset-model';
import { faExpand, faQuestion, faCubes, faFilePdf, faVideo } from '@fortawesome/free-solid-svg-icons';
import { ModalController } from '@ionic/angular';
import { GuideAssetTextModalComponent } from '../../components/guide-asset-text-modal-component/guide-asset-text-modal-component';

@Component({
  selector: 'model-assetcomponent',
  templateUrl: './assetview.page.html',
  styleUrls: ['./assetview.page.scss'],
})

export class AssetviewComponent implements OnInit {
  @Input() model: any;
  @Input() isthumbnail: boolean = false;
  @Input() showIcon: boolean = true;
  @Input() largeIcon: boolean;

  @Input() floatingIcon: boolean = false;
  /**Set to true to make image small */
  @Input() mini: boolean = false;

  /** set to true to prevent default open function */
  @Input() preventDefaultClickFunction: boolean = false;
  @Input() solid_icon_color: boolean;

  filePath3d

  faExpand = faExpand;
  faQuestion = faQuestion;
  faCubes = faCubes;
  faFilePdf = faFilePdf;
  faVideo = faVideo;
  guideAssetModelFileMapIndexEnum: typeof GuideAssetModelFileMapIndexEnum = GuideAssetModelFileMapIndexEnum;

  isPdf;

  constructor(private downloadService: DownloadService,
    private videoService: VideoService,
    private pictureService: PictureService,
    private photoViewer: PhotoViewer,
    private viewer3dService: Viewer3dService,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    if (this.model.isVideoFile()) {
      console.log("Model ", this.model)
      console.log(this.model.de_getFileImagePath(this.guideAssetModelFileMapIndexEnum.PDF_FILE_IMAGE))
    }
  }

  public openFile(basePath: string, fileApiUrl: string, modelName: string, title?: string) {
    if (!this.preventDefaultClickFunction) {
      const filePath = basePath;
      let fileTitle = this.model.title; // change later
      if (title) {
        fileTitle = title;
      }
      const fileUrl = this.downloadService.getNativeFilePath(basePath, modelName);

      if (this.downloadService.checkFileTypeByExtension(filePath, 'video') ||
        this.downloadService.checkFileTypeByExtension(filePath, 'audio')) {
        if (!fileApiUrl) {
          return false;
        }
        this.videoService.playVideo(fileUrl, fileTitle);
      }
      else if (this.downloadService.checkFileTypeByExtension(filePath, 'image')) {
        this.photoViewer.show(fileUrl, fileTitle);
      }
      else if (this.downloadService.checkFileTypeByExtension(filePath, 'pdf')) {
        this.pictureService.openFile(fileUrl, fileTitle);
      }
      else if (this.downloadService.checkFileTypeByExtension(filePath, '3d')) {
        this.viewer3dService.openPopupWithRenderedFile(fileUrl, fileTitle);
      }
    }
  }

  async openAssetTextModal() {
    if (!this.preventDefaultClickFunction) {
      const modal = await this.modalController.create({
        component: GuideAssetTextModalComponent,
        componentProps: {
          asset: this.model
        },
        cssClass: "modal-fullscreen"
      });
      return await modal.present();
    }
  }

}
