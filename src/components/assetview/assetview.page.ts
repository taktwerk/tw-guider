import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { DownloadService, RecordedFile } from '../../services/download-service';
import { PictureService } from '../../services/picture-service';
import { VideoService } from '../../services/video-service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Viewer3dService } from '../../services/viewer-3d-service';
import { GuideAssetModelFileMapIndexEnum } from '../../models/db/api/guide-asset-model';
import { faExpand, faQuestion, faCubes, faFilePdf, faVideo } from '@fortawesome/free-solid-svg-icons';
import { ModalController, Platform } from '@ionic/angular';
import { GuideAssetTextModalComponent } from '../../components/guide-asset-text-modal-component/guide-asset-text-modal-component';
import { ImageEditorComponent } from '../../components/imageeditor/imageeditor.page';
import { CreateThumbnailOptions, VideoEditor } from '@ionic-native/video-editor/ngx';
import { Capacitor, Plugins } from '@capacitor/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ApiSync } from '../../providers/api-sync';
import { File } from '@ionic-native/file/ngx';
import { HttpClient as CustomHttpClient } from 'services/http-client';
import { HttpClient, HttpHeaders as Headers } from '@angular/common/http';
import { ViewerService } from 'services/viewer.service';
import { DomSanitizer, SafeResourceUrl, ɵDomSanitizerImpl } from '@angular/platform-browser';

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
    public file: File,
    private platform: Platform,
    private httpCustom: CustomHttpClient, 
    private http: HttpClient,
    public viewer: ViewerService,
    private domSanitizer: DomSanitizer,
    protected sanitizerImpl: ɵDomSanitizerImpl,
  ) { }

  async ngOnInit() {
    // check image preview for video error
    if (this.model.isVideoFile()) {
      // this.videoPreview = this.model.getFileImagePath().changingThisBreaksApplicationSecurity;
      // console.log(this.videoPreview)
      // console.log(this.model)
      // 
      // if (this.model.TABLE_NAME !== 'guide_asset') {
      //   this.defaultVideoPreview = this.model.getFileImagePath();

      //   if (this.defaultVideoPreview) {
      //     const image = new Image();
      //     image.src = this.defaultVideoPreview;
      //     console.log(this.model.title, this.defaultVideoPreview);

      //     image.onload = () => {
      //       this.videoPreview = this.defaultVideoPreview;
      //     }

      //     image.onerror = async (e) => {
      //       console.log('Error loading image for ', this.model.title, e)
      //     }
      //   }
      //   else {
      //     // console.log(this.model.title, 'defaultPreview is', this.defaultVideoPreview)
      //     // check there is video file to be played
      //     if (this.model.attached_file_path && this.model.attached_file) {
      //       // console.log(this.model.title, 'has attachment path at', this.model.attached_file_path);
      //       const videoFileUri = this.downloadService.getNativeFilePath(this.model.getFileName(), this.model.TABLE_NAME);
      //       // console.log(videoFileUri)
      //       // make temporarily thumbnail
      //       const option: CreateThumbnailOptions = {
      //         fileUri: videoFileUri,
      //         width: 160,
      //         height: 206,
      //         atTime: 1,
      //         outputFileName: 'sample' + Date.now(),
      //       };

      //       // create thumbnail
      //       let videoThumbnailPath = await this.videoEditor.createThumbnail(option);
      //       console.log(this.model.title, 'videoEditor createThumbnail', videoThumbnailPath);
      //       if (videoThumbnailPath) {
      //         videoThumbnailPath = 'file://' + videoThumbnailPath;
      //       }
      //       const resolvedPath = await this.downloadService.getResolvedNativeFilePath(videoThumbnailPath);
      //       console.log(resolvedPath)

      //       // generate base64 data
      //       Filesystem.readFile({ path: resolvedPath }).then((filebBase64) => {
      //         this.videoPreview = 'data:image/jpeg;base64,' + filebBase64.data;
      //         console.log(this.videoPreview)
      //       })


      //     }
      //     else {
      //       this.videoPreview = '/assets/videooverlay.png';
      //     }
      //   }
      // }
    }
  }

  generateVideoPreview(e?) {
    // if (this.model.isExistThumbOfFile()) {
    // console.log(e)
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

  public openFile(basePath: string, fileApiUrl: string, modelName: string, title?: string, fileType = 'image') {
    if (!this.preventDefaultClickFunction) {
      const filePath = basePath;
      let fileTitle = this.model.title; // change later
      if (title) {
        fileTitle = title;
      }

      let fileUrl = '';

      if(this.platform.is('capacitor')) {
        fileUrl = this.downloadService.getNativeFilePath(basePath, modelName);
      } else {
        this.getSecureFile(fileApiUrl, fileType === 'video').then( (url: any) => {
          
          if(url === false) {
            return;
          }

          if(fileType === 'image') {
            this.viewer.photoframe = {
              url: url,
              title: title,
              show: true
            };
          } else if(fileType === 'video') {   
            this.viewer.videoframe = {
              url: url,
              title: title,
              show: true
            };
          }
        })
        return;
      }

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

  async onImageError(event) {
    console.log("Image has error")
    console.log(event.target.src)
    console.log(this.model)

    console.log(this.model.local_thumb_attached_file)
    // resolve path
    const resolvedPath = await this.downloadService.getResolvedNativeFilePath(this.model.local_thumb_attached_file);
    console.log(resolvedPath)

    // check directory
    const checkDirExist = await Filesystem.readdir({ path: this.file.dataDirectory + this.model.TABLE_NAME });
    console.log("Is checking directory with Capacitor");
    console.log("checkDirExist", checkDirExist);
  }

  getSecureFile(url, blob = false) {
    return new Promise((resolve, reject) => {
      if(typeof url != 'string' ) {
        resolve(false);
      }
  
      if (url.includes('/api/api/')) {
        url = url.replace('/api/api/', '/api/');
      }
  
      const headerObject: any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      };
      if (this.httpCustom.getAuthorizationToken()) {
        headerObject['X-Auth-Token'] = this.httpCustom.getAuthorizationToken();
      }
  
      console.log('headerObject', headerObject);
  
      const headers = new Headers(headerObject);
  
      this.http.get(url, { headers: headers, observe: 'response', responseType: 'blob' }).toPromise()
        .then((response) => {
          console.log(response);

          if(blob === false) {
             resolve(response.url);
          } else {
            var urlCreator = window.URL || window.webkitURL; 
            resolve(this.getSafeUrl(urlCreator.createObjectURL(response.body))); 
          }
        })
        .catch((downloadErr) => {
          console.log('downloadErr', downloadErr);
          resolve(false);
        });
    });
  }

  public getSafeUrl(convertFileSrc, sanitizeType = 'trustResourceUrl'): SafeResourceUrl {
    const safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(convertFileSrc);

    if (sanitizeType === 'trustStyle') {
      return this.sanitizerImpl.sanitize(SecurityContext.RESOURCE_URL, safeUrl);
    }

    return safeUrl;
  }
}
