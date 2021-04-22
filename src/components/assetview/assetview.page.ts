import { Component, Input, OnInit } from '@angular/core';
import { DownloadService, RecordedFile } from 'src/services/download-service';
import { PictureService } from 'src/services/picture-service';
import { VideoService } from 'src/services/video-service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Viewer3dService } from 'src/services/viewer-3d-service';
import { GuideAssetModelFileMapIndexEnum } from '../../models/db/api/guide-asset-model';
import { faExpand, faQuestion, faCubes, faFilePdf, faVideo } from '@fortawesome/free-solid-svg-icons';
import { ModalController } from '@ionic/angular';
import { GuideAssetTextModalComponent } from '../../components/guide-asset-text-modal-component/guide-asset-text-modal-component';
import { ImageEditorComponent } from 'src/components/imageeditor/imageeditor.page';
import { CreateThumbnailOptions, VideoEditor } from '@ionic-native/video-editor/ngx';
import { Capacitor, Plugins, CameraResultType, FilesystemDirectory } from '@capacitor/core';
import { ApiSync } from 'src/providers/api-sync';

const { Filesystem } = Plugins;

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

  @Input() mayEditImage: boolean = false;
  @Input() imageby50: boolean = false;

  filePath3d

  faExpand = faExpand;
  faQuestion = faQuestion;
  faCubes = faCubes;
  faFilePdf = faFilePdf;
  faVideo = faVideo;
  guideAssetModelFileMapIndexEnum: typeof GuideAssetModelFileMapIndexEnum = GuideAssetModelFileMapIndexEnum;

  isPdf;

  videoPreview;
  defaultVideoPreview;

  constructor(private downloadService: DownloadService,
    private videoService: VideoService,
    private pictureService: PictureService,
    private photoViewer: PhotoViewer,
    private viewer3dService: Viewer3dService,
    public modalController: ModalController,
    private videoEditor: VideoEditor,
    private apiSync: ApiSync,
  ) { }

  async ngOnInit() {
    // check image preview for video error
    if (this.model.isVideoFile()) {
      if (this.model.TABLE_NAME !== 'guide_asset') {
        this.defaultVideoPreview = this.model.getFileImagePath();

        if (this.defaultVideoPreview) {
          const image = new Image();
          image.src = this.defaultVideoPreview;
          console.log(this.model.title, this.defaultVideoPreview);

          image.onload = () => {
            this.videoPreview = this.defaultVideoPreview;
          }

          image.onerror = async (e) => {
            console.log('Error loading image for ', this.model.title, e)
          }
        }
        else {
          // console.log(this.model.title, 'defaultPreview is', this.defaultVideoPreview)
          // check there is video file to be played
          if (this.model.attached_file_path && this.model.attached_file) {
            // console.log(this.model.title, 'has attachment path at', this.model.attached_file_path);
            const videoFileUri = this.downloadService.getNativeFilePath(this.model.getFileName(), this.model.TABLE_NAME);
            // console.log(videoFileUri)
            // make temporarily thumbnail
            const option: CreateThumbnailOptions = {
              fileUri: videoFileUri,
              width: 160,
              height: 206,
              atTime: 1,
              outputFileName: 'sample' + Date.now(),
            };

            // create thumbnail
            let _videoEditor = new VideoEditor()
            let videoThumbnailPath = await _videoEditor.createThumbnail(option);
            console.log(this.model.title, 'videoEditor createThumbnail', videoThumbnailPath);
            if (videoThumbnailPath) {
              videoThumbnailPath = 'file://' + videoThumbnailPath;
            }
            const resolvedPath = await this.downloadService.getResolvedNativeFilePath(videoThumbnailPath);
            console.log(resolvedPath)

            // generate base64 data
            Filesystem.readFile({ path: resolvedPath }).then((filebBase64) => {
              this.videoPreview = 'data:image/jpeg;base64,' + filebBase64.data;
              console.log(this.videoPreview)
            })
          }
          else {
            this.videoPreview = '/assets/videooverlay.png';
          }
        }
      }
    }
  }

  generateVideoPreview(e?) {
    // if (this.model.isExistThumbOfFile()) {
    // console.log(e)
    const videoFileUri = this.downloadService.getNativeFilePath(this.model.getFileName(), this.model.TABLE_NAME);
    console.log(videoFileUri)

    // make temporarily thumbnail
    const option: CreateThumbnailOptions = {
      fileUri: videoFileUri,
      width: 160,
      height: 206,
      atTime: 1,
      outputFileName: 'sample' + Date.now(),
    };


    this.videoEditor.createThumbnail(option).then(async (videoThumbnailPath) => {
      console.log(this.model.title, 'videoEditor createThumbnail', videoThumbnailPath)
      if (videoThumbnailPath) {
        videoThumbnailPath = 'file://' + videoThumbnailPath;
      }

      const resolvedPath = await this.downloadService.getResolvedNativeFilePath(videoThumbnailPath);
      console.log(resolvedPath)

      // generate base64 data
      Filesystem.readFile({ path: resolvedPath }).then((filebBase64) => {
        this.videoPreview = 'data:image/jpeg;base64,' + filebBase64.data;
        console.log(this.videoPreview)
      })

    })
      .catch((error) => {
        const _error = JSON.stringify(error);
        if (_error.includes('java.io.FileNotFoundException')) {
          this.videoPreview = '/assets/videooverlay.png';
        }
        else {
          console.log(error)
        }
      })
    // }
    // else {
    //   console.log("model does have preview", this.model.isExistThumbOfFile())
    //   this.videoPreview = '/assets/videooverlay.png'
    // }

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


  async openImageEditor() {
    const modal = await this.modalController.create({
      component: ImageEditorComponent,
      componentProps: {
        model: this.model
      },
      cssClass: "modal-fullscreen",
    });
    // modal.onDidDismiss()
    //   .then((res: any) => {
    //     if (res != null) {
    //       this.model.description_html = res.data.data
    //     }
    //});
    return await modal.present();
  }


  onImageError(event) {
    // console.log("Image has error")
    // console.log(event)
    // this.generateVideoPreview(event);
  }
}
