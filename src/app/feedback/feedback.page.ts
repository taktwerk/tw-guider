import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Events, ModalController, NavController } from '@ionic/angular';
import { FeedbackService } from '../../providers/api/feedback-service';
import { FeedbackModel } from '../../models/db/api/feedback-model';
import { AuthService } from '../../services/auth-service';
import { DownloadService } from '../../services/download-service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { VideoService } from '../../services/video-service';
import { PictureService } from '../../services/picture-service';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { AudioService } from '../../services/audio-service';

@Component({
  selector: 'feedback-page',
  templateUrl: 'feedback.page.html',
  styleUrls: ['feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  public backDefaultHref: string;
  public reference_id: number = null;
  public reference_model: string = null;
  public reference_model_alias: string = null;
  public feedbackList: FeedbackModel[] = [];
  public isComponentLikeModal = false;
  public params;

  constructor(
    private feedbackService: FeedbackService,
    private modalController: ModalController,
    public events: Events,
    public authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
    private downloadService: DownloadService,
    private activatedRoute: ActivatedRoute,
    private photoViewer: PhotoViewer,
    private navCtrl: NavController,
    private router: Router,
    private videoService: VideoService,
    private pictureService: PictureService,
    private nativeAudio: NativeAudio,
    private media: Media,
    private audio: AudioService
  ) {
    this.authService.checkAccess('feedback');
  }

  public async setModels() {
    const user = await this.authService.getLastUser();
    if (!user) {
      return;
    }
    const feedbackSearchCondition = [['user_id', user.userId], 'deleted_at IS NULL', 'local_deleted_at IS NULL'];

    if (this.reference_id && this.reference_model) {
      feedbackSearchCondition.push(
        '(' +
          this.feedbackService.dbModelApi.secure('reference_model') +
          '= "' +
          this.reference_model_alias +
          '" OR ' +
          this.feedbackService.dbModelApi.secure('reference_model') +
          '="' +
          this.reference_model +
          '")'
      );
      feedbackSearchCondition.push(['reference_id', this.reference_id]);
    }
    this.feedbackList = await this.feedbackService.dbModelApi.findAllWhere(
      feedbackSearchCondition,
      'local_created_at DESC, created_at DESC, ' + this.feedbackService.dbModelApi.COL_ID + ' DESC'
    );
  }

  public openFile(basePath: string, modelName: string, title?: string) {
    const filePath = basePath;
    let fileTitle = 'Feedback';
    if (title) {
      fileTitle = title;
    }
    const fileUrl = this.downloadService.getNativeFilePath(basePath, modelName);
    if (this.downloadService.checkFileTypeByExtension(filePath, 'video') || this.downloadService.checkFileTypeByExtension(filePath, 'audio')) {
      this.videoService.playVideo(fileUrl, fileTitle);
    } else if (this.downloadService.checkFileTypeByExtension(filePath, 'image')) {
      this.photoViewer.show(fileUrl, fileTitle);
    } else if (this.downloadService.checkFileTypeByExtension(filePath, 'pdf')) {
      // this.photoViewer.show(this.downloadService.getNativeFilePath(basePath, modelName), fileTitle);
      this.pictureService.openFile(fileUrl, fileTitle);
    }
  }

  dismiss() {
    if (this.reference_model_alias && this.reference_id) {
      this.navCtrl.navigateRoot(this.reference_model_alias + '/' + this.reference_id);
    }
  }

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  itemHeightFn(item, index) {
    return 99;
  }

  trackByFn(index, item) {
    return item[item.COL_ID];
  }

  openAddEditPage(feedbackId?: number) {
    const feedbackNavigationExtras: NavigationExtras = {
      queryParams: {
        feedbackId,
        referenceModelAlias: this.reference_model_alias,
        referenceId: this.reference_id,
      },
    };
    this.router.navigate(['/feedback/save/' + feedbackId], feedbackNavigationExtras);
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const feedbackData = params;
      this.reference_id = +feedbackData.referenceId;
      this.reference_model_alias = feedbackData.referenceModelAlias;
      this.reference_model = this.feedbackService.dbModelApi.getReferenceModelByAlias(this.reference_model_alias);
      if (this.reference_model) {
        this.isComponentLikeModal = true;
      }
      this.backDefaultHref = feedbackData.backUrl;
      this.setModels();
      this.detectChanges();
    });

    this.events.subscribe(this.feedbackService.dbModelApi.TAG + ':create', (model) => {
      this.setModels();
      this.detectChanges();
    });
    this.events.subscribe(this.feedbackService.dbModelApi.TAG + ':update', (model) => {
      this.setModels();
      this.detectChanges();
    });
    this.events.subscribe(this.feedbackService.dbModelApi.TAG + ':delete', (model) => {
      this.setModels();
      this.detectChanges();
    });
  }
}
