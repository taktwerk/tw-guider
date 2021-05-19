import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { FeedbackService } from '../../providers/api/feedback-service';
import { FeedbackModel } from '../../models/db/api/feedback-model';
import { AuthService } from '../../services/auth-service';
import { DownloadService } from '../../services/download-service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { VideoService } from '../../services/video-service';
import { PictureService } from '../../services/picture-service';
import { Subscription } from 'rxjs';
import { MiscService } from 'src/services/misc-service';
import { SyncIndexService } from 'src/providers/api/sync-index-service';

@Component({
  selector: 'feedback-page',
  templateUrl: 'feedback.page.html',
  styleUrls: ['feedback.page.scss'],
})
export class FeedbackPage implements OnInit, OnDestroy {
  public backDefaultHref: string;
  public guideId: string;
  public reference_title: string = '';
  public reference_id: number = null;
  public reference_model: string = null;
  public reference_model_alias: string = null;
  public feedbackList: FeedbackModel[] = [];
  public isComponentLikeModal = false;
  public params;
  possibleDatabaseNamespaces = [
    'app',
    'taktwerk\\yiiboilerplate'
  ];
  eventSubscription: Subscription;

  constructor(
    private feedbackService: FeedbackService,
    public authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
    private downloadService: DownloadService,
    private activatedRoute: ActivatedRoute,
    private photoViewer: PhotoViewer,
    private navCtrl: NavController,
    private router: Router,
    private videoService: VideoService,
    private pictureService: PictureService,
    private miscService: MiscService,
    private platform: Platform,
    private syncIndexService: SyncIndexService,

  ) {
    this.authService.checkAccess('feedback');
  }
  ionViewDidLeave() {
    this.reference_id = null
    console.log(this.reference_id, "this.reference_id")
  }

  public async setModels() {
    const user = await this.authService.getLastUser();
    if (!user) {
      return;
    }
    const feedbackSearchCondition = [['user_id', user.userId], 'deleted_at IS NULL', 'local_deleted_at IS NULL'];

    if (this.reference_id && this.reference_model) {
      let referenceModelQuery = '(';
      for (let i = 0; i < this.possibleDatabaseNamespaces.length; i++) {
        const referenceModelName = this.possibleDatabaseNamespaces[i] + this.reference_model;
        referenceModelQuery = referenceModelQuery + this.feedbackService.dbModelApi.secure('reference_model') + '= \'' + referenceModelName + '\'';
        if (this.possibleDatabaseNamespaces.length > 1 && i !== (this.possibleDatabaseNamespaces.length - 1)) {
          referenceModelQuery = referenceModelQuery + ' OR ';
        }
      }
      referenceModelQuery = referenceModelQuery + ')';
      feedbackSearchCondition.push(
        '(' +
        this.feedbackService.dbModelApi.secure('reference_model') +
        '= "' +
        this.reference_model_alias +
        '" OR ' +
        referenceModelQuery +
        ')'
      );
      feedbackSearchCondition.push(['reference_id', this.reference_id]);
    }

    this.feedbackList = await this.feedbackService.dbModelApi.findAllWhere(feedbackSearchCondition, 'local_created_at DESC, created_at DESC, ' + this.feedbackService.dbModelApi.COL_ID + ' DESC');
    const syncedList = await this.syncIndexService.getSyncIndexModel(this.feedbackList, this.feedbackList[0].TABLE_NAME);
    this.feedbackList = syncedList;
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

  itemHeightFn() {
    return 99;
  }

  trackByFn(item) {
    return item;
  }

  openAddEditPage(feedbackId?: number) {
    const feedbackNavigationExtras: NavigationExtras = {
      queryParams: {
        feedbackId,
        referenceModelAlias: this.reference_model_alias,
        referenceId: this.reference_id,
        referenceTitle: this.reference_title,
        guideId: this.guideId
      },
    };
    this.router.navigate(['/feedback/save/' + feedbackId], feedbackNavigationExtras);
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const feedbackData = params;
      this.reference_id = +feedbackData.referenceId;
      this.reference_title = feedbackData.referenceTitle;
      this.reference_model_alias = feedbackData.referenceModelAlias;
      this.reference_model = this.feedbackService.dbModelApi.getReferenceModelByAlias(this.reference_model_alias);
      if (this.reference_model) {
        this.isComponentLikeModal = true;
      }
      this.backDefaultHref = feedbackData.backUrl;
      this.guideId = feedbackData.guideId;

      console.log("this.guideId", this.guideId)

      this.setModels();
      this.detectChanges();
    });

    this.eventSubscription = this.miscService.events.subscribe((event) => {
      console.log('What causing the thingy to flicker? ', event.TAG)
      switch (event.TAG) {
        case this.feedbackService.dbModelApi.TAG + ':create':
        case this.feedbackService.dbModelApi.TAG + ':update':
        case this.feedbackService.dbModelApi.TAG + ':delete':
          this.setModels();
          this.detectChanges();
          break;
        default:
      }
    })
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
