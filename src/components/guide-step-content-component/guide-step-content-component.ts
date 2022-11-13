/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';

import { AuthService } from '../../services/auth-service';
import { DownloadService } from '../../services/download-service';
import { GuiderModel } from '../../models/db/api/guider-model';
import { NavigationExtras, Router } from '@angular/router';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { VideoService } from '../../services/video-service';
import { Viewer3dService } from '../../services/viewer-3d-service';
import { PictureService } from '../../services/picture-service';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { GuideStepModel } from '../../models/db/api/guide-step-model';
import { GuideAssetModel } from '../../models/db/api/guide-asset-model';
import { GuideAssetTextModalComponent } from '../guide-asset-text-modal-component/guide-asset-text-modal-component';
import { SafeResourceUrl } from '@angular/platform-browser';
import { LoggerService } from '../../services/logger-service';
import { MiscService } from '../../services/misc-service';
import { AppSetting } from 'src/services/app-setting';
import { isPlatformBrowser } from '@angular/common';
import { ViewerService } from 'src/services/viewer.service';
import { HelpingService } from 'controller/app/service/helping.service';

@Component({
  selector: 'guide-step-content-component',
  templateUrl: 'guide-step-content-component.html',
  styleUrls: ['guide-step-content-component.scss'],
})
export class GuideStepContentComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    console.log('destroy GuideStepContentComponent');
  }

  public faFilePdf = faFilePdf;
  @Input() step: GuideStepModel = null;
  @Input() portraitOriginal = false;
  @Input() guide: GuiderModel = null;
  @Input() haveFeedbackPermissions = false;
  @Input() haveAssets = false;
  @Input() guideStepsLength = 0;
  @Input() stepNumber = 0;

  fileName: string;
  fileImagePath: SafeResourceUrl;
  fileUrl: string;
  isVideoFile: boolean;
  filePath3d: any;
  existThumbOfFile: boolean;
  isImageFile: boolean;
  is3dFile: boolean;
  isExistFormatFile: boolean;
  isAudioFile: boolean;
  isPdf: boolean;
  testBrowser: boolean;

  @Output() loaded: EventEmitter<void> = new EventEmitter<void>();

  public params;

  constructor(

    private photoViewer: PhotoViewer,
    public authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
    public modalController: ModalController,
    public downloadService: DownloadService,
    public loggerService: LoggerService,
    private appSetting: AppSetting,
    private router: Router,
    public helper: HelpingService,
    public viewer: ViewerService,
    public platform: Platform,
    private videoService: VideoService,
    private viewer3dService: Viewer3dService,
    public navCtrl: NavController,
    private pictureService: PictureService,
    public miscService: MiscService,
    @Inject(PLATFORM_ID) platformId: string
  ) {
    this.testBrowser = isPlatformBrowser(platformId);
  }
  public openFile(basePath: string, fileApiUrl: string, modelName: string, title?: string, fileType = 'image') {
    const filePath = basePath;
    let fileTitle = 'Guide';
    if (title) {
      fileTitle = title;
    }

    let fileUrl = '';
    //  console.log('basePath', basePath);
    if (this.platform.is('capacitor')) {
      fileUrl = this.downloadService.getNativeFilePath(basePath, modelName);
    } else {
      this.helper.getSecureFile(fileApiUrl, fileType === 'video' || fileType === 'pdf').then((url: any) => {

        if (url === false) {
          return;
        }

        if (fileType === 'image') {
          this.viewer.photoframe = {
            url,
            title,
            show: true
          };
        } else if (fileType === 'video') {
          this.viewer.videoframe = {
            url,
            title,
            show: true
          };
        } else if (fileType === 'pdf') {
          this.viewer.pdfframe = {
            url,
            title,
            show: true
          };
        }
      });
      return;
    }
    //  console.log('fileUrl', fileUrl);
    if (this.downloadService.checkFileTypeByExtension(filePath, 'video') || this.downloadService.checkFileTypeByExtension(filePath, 'audio')) {
      if (!fileApiUrl) {
        return false;
      }
      this.videoService.playVideo(fileUrl, fileTitle);
    } else if (this.downloadService.checkFileTypeByExtension(filePath, 'image')) {
      this.photoViewer.show(fileUrl, fileTitle);
    } else if (this.downloadService.checkFileTypeByExtension(filePath, 'pdf')) {
      this.viewer.videoframe = {
        url: fileUrl,
        title,
        show: true
      };
    } else if (this.downloadService.checkFileTypeByExtension(filePath, '3d')) {
      this.viewer3dService.openPopupWithRenderedFile(fileUrl, fileTitle);
    }
  }

  // public openFile(basePath: string, fileApiUrl: string, modelName: string, title?: string) {
  //   const filePath = basePath;
  //   let fileTitle = 'Guide';
  //   if (title) {
  //     fileTitle = title;
  //   }

  //   const fileUrl = this.downloadService.getNativeFilePath(basePath, modelName);

  //   if (this.downloadService.checkFileTypeByExtension(filePath, 'video') ||
  //     this.downloadService.checkFileTypeByExtension(filePath, 'audio')) {
  //     if (!fileApiUrl) {
  //       return false;
  //     }

  //     this.videoService.playVideo(fileUrl, fileTitle);

  //   } else if (this.downloadService.checkFileTypeByExtension(filePath, 'image')) {
  //     this.photoViewer.show(fileUrl, fileTitle);
  //   } else if (this.downloadService.checkFileTypeByExtension(filePath, 'pdf')) {
  //     this.pictureService.openFile(fileUrl, fileTitle);
  //   } else if (this.downloadService.checkFileTypeByExtension(filePath, '3d')) {
  //     this.viewer3dService.openPopupWithRenderedFile(fileUrl, fileTitle);
  //   }
  // }

  openFeedback(referenceModelAlias, referenceId, referenceTitle) {
    const feedbackNavigationExtras: NavigationExtras = {
      queryParams: {
        backUrl: this.router.url,
        referenceModelAlias,
        referenceId,
        referenceTitle,
        guideId: this.guide.idApi
      },
    };
    this.router.navigate(['feedback'], feedbackNavigationExtras);
  }

  ngOnInit() {
    this.loaded.emit();
    this.fileName = this.step.getFileName();
    this.fileUrl = this.step.getFileUrl();
    this.filePath3d = this.step.getFilePath();
    this.fileImagePath = this.step.getFileImagePath();
    this.isVideoFile = this.step.isVideoFile();
    this.existThumbOfFile = this.step.isExistThumbOfFile();
    this.isImageFile = this.step.isImageFile();
    this.is3dFile = this.step.is3dFile();
    this.isExistFormatFile = this.step.isExistFormatFile();
    this.isAudioFile = this.step.isAudioFile();
    this.isPdf = this.step.isPdf();
  }

  async openAssetTextModal() {
    const guideAsset: GuideAssetModel = new GuideAssetModel();
    guideAsset.asset_html = this.step.description_html;
    guideAsset.name = this.step.title;

    const modal = await this.modalController.create({
      component: GuideAssetTextModalComponent,
      componentProps: {
        asset: guideAsset
      },
      cssClass: 'modal-fullscreen'
    });

    return await modal.present();
  }
}
