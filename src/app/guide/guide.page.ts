import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {GuiderService} from '../../providers/api/guider-service';
import {GuiderModel} from '../../models/db/api/guider-model';
import {ActivatedRoute} from '@angular/router';
import {GuideStepService} from '../../providers/api/guide-step-service';
import {GuideStepModel} from '../../models/db/api/guide-step-model';
import { File } from '@ionic-native/file/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import {Events, ModalController} from '@ionic/angular';
import {AuthService} from '../../services/auth-service';
import {GuideAssetService} from '../../providers/api/guide-asset-service';
import {GuideAssetPivotService} from '../../providers/api/guide-asset-pivot-service';
import {GuideAssetTextModalComponent} from '../../components/guide-asset-text-modal-component/guide-asset-text-modal-component';
import {GuideAssetModel} from '../../models/db/api/guide-asset-model';

@Component({
  selector: 'app-guide',
  templateUrl: 'guide.page.html',
  styleUrls: ['guide.page.scss']
})
export class GuidePage implements OnInit {

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
      private guiderService: GuiderService,
      private guideStepService: GuideStepService,
      private guideAssetService: GuideAssetService,
      private guideAssetPivotService: GuideAssetPivotService,
      private activatedRoute: ActivatedRoute,
      private file: File,
      private streamingMedia: StreamingMedia,
      private photoViewer: PhotoViewer,
      public events: Events,
      public authService: AuthService,
      public changeDetectorRef: ChangeDetectorRef,
      public modalController: ModalController
  ) {
    this.authService.checkAccess();
  }

  public openFile(filePath, nativeUrl, title?: string) {
    console.log('open file');
    if (!nativeUrl) {
      return null;
    }
    if (filePath.indexOf('.MOV') > -1 || filePath.indexOf('.mp4') > -1) {
      // E.g: Use the Streaming Media plugin to play a video
      this.streamingMedia.playVideo(nativeUrl);
    } else if (filePath.indexOf('.jpg') > -1 || filePath.indexOf('.png') > -1) {
      let photoTitle = 'Guide image';
      if (title) {
        photoTitle = title;
      }
      console.log('nativeUrl', nativeUrl)
      this.photoViewer.show(nativeUrl, photoTitle);
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
        return !model[model.COL_DELETED_AT];
      });
    });
  }

  public setAssets(id) {
    return this.guiderService.dbModelApi.setAssets(id).then(results => {
      this.guideAssets = results.filter(model => {
        return !model[model.COL_DELETED_AT];
      });
    });
  }

  ngOnInit() {
    this.guideId = +this.activatedRoute.snapshot.paramMap.get('guideId');
    if (this.guideId) {
      this.guiderService.getById(this.guideId).then((result) => {
        console.log('result for get by id', result);
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
  }
}
