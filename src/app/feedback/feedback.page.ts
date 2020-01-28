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
  selector: 'app-feedback',
  templateUrl: 'feedback.page.html',
  styleUrls: ['feedback.page.scss']
})
export class FeedbackPage implements OnInit {

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
      public events: Events,
      public authService: AuthService,
      public changeDetectorRef: ChangeDetectorRef,
      public modalController: ModalController
  ) {
    this.authService.checkAccess();
  }

  ngOnInit(): void {
    //
  }
}
