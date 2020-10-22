import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { Events, LoadingController, ModalController, NavController, Platform } from '@ionic/angular';

import { AuthService } from '../../services/auth-service';
import { DownloadService } from '../../services/download-service';
import { GuiderModel } from '../../models/db/api/guider-model';
import { NavigationExtras, Router } from '@angular/router';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { VideoService } from '../../services/video-service';
import { Viewer3dService } from '../../services/viewer-3d-service';
import { PictureService } from '../../services/picture-service';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { GuideStepModel } from '../../models/db/api/guide-step-model';
import { GuideAssetModel } from '../../models/db/api/guide-asset-model';
import { GuideAssetTextModalComponent } from '../guide-asset-text-modal-component/guide-asset-text-modal-component';
import { DbProvider } from '../../providers/db-provider';
import { SafeResourceUrl } from '@angular/platform-browser';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

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
  @Input() portraitOriginal: boolean = false;
  @Input() guide: GuiderModel = null;
  @Input() haveFeedbackPermissions: boolean = false;
  @Input() haveAssets: boolean = false;
  @Input() guideStepsLength: number = 0;
  @Input() stepNumber: number = 0;

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

  @Output() loaded: EventEmitter<void> = new EventEmitter<void>();

  public params;

  constructor(
    public platform: Platform,
    public db: DbProvider,
    private photoViewer: PhotoViewer,
    public events: Events,
    public authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
    public modalController: ModalController,
    public downloadService: DownloadService,
    private router: Router,
    private videoService: VideoService,
    private viewer3dService: Viewer3dService,
    public navCtrl: NavController,
    private pictureService: PictureService
  ) {}

  public openFile(basePath: string, fileApiUrl: string, modelName: string, title?: string) {
    const filePath = basePath;
    let fileTitle = 'Guide';
    if (title) {
      fileTitle = title;
    }

    const fileUrl = this.downloadService.getNativeFilePath(basePath, modelName);
    if (this.downloadService.checkFileTypeByExtension(filePath, 'video') || this.downloadService.checkFileTypeByExtension(filePath, 'audio')) {
      if (!fileApiUrl) {
        return false;
      }
      this.videoService.playVideo(fileUrl, fileTitle);
    } else if (this.downloadService.checkFileTypeByExtension(filePath, 'image')) {
      this.photoViewer.show(fileUrl, fileTitle);
    } else if (this.downloadService.checkFileTypeByExtension(filePath, 'pdf')) {
      this.pictureService.openFile(fileUrl, fileTitle);
    } else if (this.downloadService.checkFileTypeByExtension(filePath, '3d')) {
      this.viewer3dService.openPopupWithRenderedFile(fileUrl, fileTitle);
    }
  }

  openFeedback(referenceModelAlias, referenceId) {
    const feedbackNavigationExtras: NavigationExtras = {
      queryParams: {
        backUrl: this.router.url,
        referenceModelAlias: referenceModelAlias,
        referenceId: referenceId,
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
    const guideAsset: GuideAssetModel = new GuideAssetModel(this.platform, this.db, this.events, this.downloadService);
    guideAsset.asset_html = this.step.description_html;
    guideAsset.name = this.step.title;

    const modal = await this.modalController.create({
      component: GuideAssetTextModalComponent,
      componentProps: {
        asset: guideAsset
      },
      cssClass: "modal-fullscreen"
    });

    return await modal.present();
  }
}
