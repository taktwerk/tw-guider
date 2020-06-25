import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {GuiderService} from '../../providers/api/guider-service';
import {GuiderModel} from '../../models/db/api/guider-model';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {GuideStepService} from '../../providers/api/guide-step-service';
import {GuideStepModel} from '../../models/db/api/guide-step-model';
import { File } from '@ionic-native/file/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import {Events, LoadingController, ModalController, NavController} from '@ionic/angular';
import {AuthService} from '../../services/auth-service';
import {GuideAssetService} from '../../providers/api/guide-asset-service';
import {GuideAssetPivotService} from '../../providers/api/guide-asset-pivot-service';
import {GuideAssetTextModalComponent} from '../../components/guide-asset-text-modal-component/guide-asset-text-modal-component';
import {GuideAssetModel, GuideAssetModelFileMapIndexEnum} from '../../models/db/api/guide-asset-model';
import {DownloadService} from '../../services/download-service';
import {VideoService} from '../../services/video-service';
import {GuideCategoryService} from '../../providers/api/guide-category-service';
import {GuideCategoryBindingService} from '../../providers/api/guide-category-binding-service';
import {PictureService} from '../../services/picture-service';

import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import {Viewer3dService} from "../../services/viewer-3d-service";

@Component({
  selector: 'app-guide',
  templateUrl: 'guide.page.html',
  styleUrls: ['guide.page.scss']
})
export class GuidePage implements OnInit {
  guideAssetModelFileMapIndexEnum: typeof GuideAssetModelFileMapIndexEnum = GuideAssetModelFileMapIndexEnum;

  haveFeedbackPermissions = false;
  isLoadedContent = false;

  public faFilePdf = faFilePdf;

  public guide: GuiderModel = this.guiderService.newModel();
  public guideId: number = null;
  public guideSteps: GuideStepModel[] = [];
  public guideAssets: GuideAssetModel[] = [];
  public slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  };

  constructor(
      private guideCategoryService: GuideCategoryService,
      private guideCategoryBindingService: GuideCategoryBindingService,
      private guiderService: GuiderService,
      private guideStepService: GuideStepService,
      private guideAssetService: GuideAssetService,
      private guideAssetPivotService: GuideAssetPivotService,
      private activatedRoute: ActivatedRoute,
      private file: File,
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
      private ngZone: NgZone,
      private pictureService: PictureService,
      private loader: LoadingController
  ) {
    this.authService.checkAccess('guide');
    if (this.authService.auth && this.authService.auth.additionalInfo && this.authService.auth.additionalInfo.roles) {
      if (this.authService.auth.additionalInfo.roles.includes('FeedbackViewer') ||
          this.authService.auth.isAuthority) {
        this.haveFeedbackPermissions = true;
      }
    }
  }

  public openFile(basePath: string, fileApiUrl: string, modelName: string, title?: string) {
    const filePath = basePath;
    let fileTitle = 'Guide';
    if (title) {
      fileTitle = title;
    }
    console.log('basePath', basePath);
    const fileUrl = this.downloadService.getNativeFilePath(basePath, modelName);
    console.log('fileUrl', fileUrl);
    if (this.downloadService.checkFileTypeByExtension(filePath, 'video') ||
        this.downloadService.checkFileTypeByExtension(filePath, 'audio')
    ) {
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

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  async openAssetTextModal(asset: GuideAssetModel) {
    const modal = await this.modalController.create({
      component: GuideAssetTextModalComponent,
      componentProps: {
        asset: asset
      },
    });
    return await modal.present();
  }

  trackGuideAsset(index: number, element: GuideAssetModel) {
    return element.idApi;
  }

  public setGuideSteps(id) {
    return this.guideStepService.dbModelApi.findAllWhere(['guide_id', id], 'order_number ASC').then(results => {
      this.guideSteps = results.filter(model => {
        return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT];
      });
    });
  }

  public setAssets(id) {
    return this.guiderService.dbModelApi.setAssets(id).then(results => {
      this.guideAssets = results.filter(model => {
        return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT];
      });
    });
  }

  openFeedback(referenceModelAlias, referenceId) {
    const feedbackNavigationExtras: NavigationExtras = {
      queryParams: {
        backUrl: this.router.url,
        referenceModelAlias: referenceModelAlias,
        referenceId: referenceId
      }
    };
    this.router.navigate(['feedback'], feedbackNavigationExtras);
  }

  async ngOnInit() {
    const loader = await this.loader.create();
    loader.present();
    this.guideId = +this.activatedRoute.snapshot.paramMap.get('guideId');
    if (this.guideId) {
      const guiderById = await this.guiderService.getById(this.guideId)
      if (guiderById.length) {
        this.guide = guiderById[0];
        await this.setGuideSteps(this.guide.idApi);
        await this.setAssets(this.guide.idApi);
        this.detectChanges();
      }
    }
    loader.dismiss();
    this.isLoadedContent = true;

    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':create', async (model) => {
      if (this.guide) {
        this.setGuideSteps(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':delete', async (model) => {
      if (this.guide) {
        this.setGuideSteps(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':update', async (model) => {
      if (this.guide) {
        this.setGuideSteps(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetPivotService.dbModelApi.TAG + ':create', async (model) => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetPivotService.dbModelApi.TAG + ':update', async (model) => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetPivotService.dbModelApi.TAG + ':delete', async (model) => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetService.dbModelApi.TAG + ':create', async (model) => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetService.dbModelApi.TAG + ':update', async (model) => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetService.dbModelApi.TAG + ':delete', async (model) => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetService.dbModelApi.TAG + ':delete', async (model) => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':delete', async (model) => {
      this.ngZone.run(() => {
        this.navCtrl.navigateRoot('/guide-categories');
      });
    });
    this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':delete', async (model) => {
      this.ngZone.run(() => {
        this.navCtrl.navigateRoot('/guide-categories');
      });
    });
    this.events.subscribe(this.guideCategoryBindingService.dbModelApi.TAG + ':delete', (model) => {
      this.ngZone.run(() => {
        this.navCtrl.navigateRoot('/guide-categories');
      });
    });
    this.events.subscribe('network:online', (isNetwork) => {
      this.authService.checkAccess('guide');
    });
  }
}
