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
import {FeedbackService} from '../../providers/api/feedback-service';
import {FeedbackModel} from '../../models/db/api/feedback-model';

@Component({
  selector: 'app-feedback',
  templateUrl: 'feedback.page.html',
  styleUrls: ['feedback.page.scss']
})
export class FeedbackPage implements OnInit {

  public model: FeedbackModel;

  constructor(
      private feedbackService: FeedbackService,
      public events: Events,
      public authService: AuthService,
      public changeDetectorRef: ChangeDetectorRef,
      public modalController: ModalController
  ) {
    this.authService.checkAccess();
    if (!this.model) {
      this.model = feedbackService.newModel();
    }
  }

  ngOnInit(): void {
    //
  }

  public async save() {
    const user = await this.authService.getLastUser();
    if (!user) {
      return;
    }
    this.model.user_id = user.userId;
    this.feedbackService.save(this.model).then(res => {
      // this.viewCtrl.dismiss();
    });
  }
}
