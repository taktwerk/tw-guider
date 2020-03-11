import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {GuiderService} from '../../providers/api/guider-service';
import {GuiderModel} from '../../models/db/api/guider-model';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {GuideStepService} from '../../providers/api/guide-step-service';
import {GuideStepModel} from '../../models/db/api/guide-step-model';
import { File } from '@ionic-native/file/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import {Events, ModalController} from '@ionic/angular';
import {AuthService} from '../../services/auth-service';
import {GuideAssetService} from '../../providers/api/guide-asset-service';
import {GuideAssetPivotService} from '../../providers/api/guide-asset-pivot-service';
import {GuideAssetTextModalComponent} from '../../components/guide-asset-text-modal-component/guide-asset-text-modal-component';
import {GuideAssetModel, GuideAssetModelFileMapIndexEnum} from '../../models/db/api/guide-asset-model';
import {DownloadService} from '../../services/download-service';
import {VideoService} from '../../services/video-service';

@Component({
  selector: 'app-guide',
  templateUrl: 'guide.page.html',
  styleUrls: ['guide.page.scss']
})
export class GuidePage implements OnInit {
  guideAssetModelFileMapIndexEnum: typeof GuideAssetModelFileMapIndexEnum = GuideAssetModelFileMapIndexEnum;

  public guide: GuiderModel = this.guiderService.newModel();
  public guideId: number = null;
  public currentStepNumber: number = 1;
  public guideSteps: GuideStepModel[] = [];
  public guideAssets: GuideAssetModel[] = [];
  public slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  };

  constructor(
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
      private videoService: VideoService
  ) {
    this.authService.checkAccess();
  }

  public openFile(basePath: string, modelName: string, title?: string) {
    const filePath = basePath;
    let fileTitle = 'Guide';
    if (title) {
      fileTitle = title;
    }
    if (this.downloadService.checkFileTypeByExtension(filePath, 'video')) {
      const fileUrl = this.downloadService.getNativeFilePath(basePath, modelName);
      this.videoService.playVideo(fileUrl, fileTitle);
    } else if (this.downloadService.checkFileTypeByExtension(filePath, 'image')) {
      this.photoViewer.show(this.downloadService.getNativeFilePath(basePath, modelName), fileTitle);
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

  ngOnInit() {
    this.guideId = +this.activatedRoute.snapshot.paramMap.get('guideId');
    if (this.guideId) {
      this.guiderService.getById(this.guideId).then((result) => {
        if (result.length) {
          this.guide = result[0];
          this.setGuideSteps(this.guide.idApi).then(() => this.detectChanges());
          this.setAssets(this.guide.idApi).then(() => this.detectChanges());
        }
      });
    }
    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':create', async (model) => {
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
    this.events.subscribe('network:online', (isNetwork) => {
      this.authService.checkAccess();
    });
  }
}
