import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {GuiderService} from '../../providers/api/guider-service';
import {GuiderModel} from '../../models/db/api/guider-model';
import {ActivatedRoute} from '@angular/router';
import {GuideStepService} from '../../providers/api/guide-step-service';
import {GuideStepModel} from '../../models/db/api/guide-step-model';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import {Events, NavController} from '@ionic/angular';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-guide',
  templateUrl: 'guide.page.html',
  styleUrls: ['guide.page.scss']
})
export class GuidePage implements OnInit {

  public guide: GuiderModel = this.guiderService.newModel();
  public guideId: number = null;
  public guideSteps: GuideStepModel[] = [];
  public slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(
      private guiderService: GuiderService,
      private guideStepService: GuideStepService,
      private activatedRoute: ActivatedRoute,
      private file: File,
      private streamingMedia: StreamingMedia,
      private photoViewer: PhotoViewer,
      public events: Events,
      public authService: AuthService,
      public changeDetectorRef: ChangeDetectorRef
  ) {
    this.authService.checkAccess();
  }

  public setGuideSteps(id) {
    return this.guideStepService.dbModelApi.findAllWhere(['guide_id', id], 'order_number ASC').then(results => {
      this.guideSteps = results.filter(model => {
        return !model[model.COL_DELETED_AT];
      });
    });
  }

  public openFile(filePath, nativeUrl) {
    console.log('filePath', filePath);
    if (!nativeUrl) {
      return null;
    }
    if (filePath.indexOf('.MOV') > -1 || filePath.indexOf('.mp4') > -1) {
      // E.g: Use the Streaming Media plugin to play a video
      this.streamingMedia.playVideo(nativeUrl);
    } else if (filePath.indexOf('.jpg') > -1) {
      let guidePhotoTitle = 'Guide image';
      if (this.guide) {
        guidePhotoTitle = this.guide.title;
      }
      this.photoViewer.show(nativeUrl, guidePhotoTitle);
    }
  }

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnInit() {
    this.guideId = +this.activatedRoute.snapshot.paramMap.get('guideId');
    if (this.guideId) {
      this.guiderService.getById(this.guideId).then((result) => {
        if (result.length) {
          this.guide = result[0];
        }
        this.setGuideSteps(this.guideId).then(() => this.detectChanges());
      });
    }
    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':create', (model) => {
      this.setGuideSteps(this.guideId).then(() => this.detectChanges());
    });
    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':update', (model) => {
      this.setGuideSteps(this.guideId).then(() => this.detectChanges());
    });
  }
}
