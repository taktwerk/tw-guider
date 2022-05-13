/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectorRef, Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { FeedbackService } from '../../providers/api/feedback-service';
import { FeedbackModel } from '../../models/db/api/feedback-model';
import { AuthService } from '../../services/auth-service';
import { DownloadService } from '../../services/download-service';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { VideoService } from '../../services/video-service';
import { PictureService } from '../../services/picture-service';
import { Subscription } from 'rxjs';
import { MiscService } from '../../services/misc-service';
import { SyncIndexService } from '../../providers/api/sync-index-service';
import { isPlatformBrowser } from '@angular/common';
import { AppSetting } from 'src/services/app-setting';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'feedback-page',
  templateUrl: 'feedback.page.html',
  styleUrls: ['feedback.page.scss'],
  providers: [DatePipe]
})
export class FeedbackPage implements OnInit, OnDestroy {
  public backDefaultHref: string;
  public guideId: string;
  public reference_title = '';
  public reference_id: number = null;
  public reference_model: string = null;
  public reference_model_alias: string = null;
  public feedbackList: FeedbackModel[] = [];
  public isComponentLikeModal = false;
  public params;
  public imgURL;
  testBrowser: boolean;

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
    private appSetting: AppSetting,
    private videoService: VideoService,
    private pictureService: PictureService,
    private miscService: MiscService,
    private platform: Platform,
    private syncIndexService: SyncIndexService,
    public datepipe: DatePipe,
    @Inject(PLATFORM_ID) platformId: string

  ) {
    this.authService.checkAccess('feedback');

    this.testBrowser = isPlatformBrowser(platformId);
  }
  ionViewDidLeave() {
    this.reference_id = null;
    // console.log(this.reference_id, "this.reference_id")
  }

  // isValidHttpUrl(string) {
  //   let url;
  //   try {
  //     url = new URL(string);
  //   } catch (_) {
  //     return false;
  //   }
  //   return url.protocol === "http:" || url.protocol === "https:";
  // };

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
    // console.log("this.feedbackList", this.feedbackList)
    if (this.feedbackList) {
      const syncedList = await this.syncIndexService.getSyncIndexModel(this.feedbackList, this.feedbackList[0].TABLE_NAME);
      this.feedbackList = syncedList;
    }
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
    this.changeDetectorRef.detectChanges();
  }

  itemHeightFn() {
    return 99;
  }

  trackByFn(item) {
    return item;
  }

  // isImage(base64Data) {
  //   let mimeType = base64Data.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0].split('/')[0];
  //   if (mimeType == 'image') {
  //     return true
  //   }
  //   return false
  // }

  // isVideo(base64Data) {
  //   let mimeType = base64Data.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0].split('/')[0];
  //   if (mimeType == 'video') {
  //     return true
  //   }
  //   return false
  // }

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
    console.log('check feedbackNavigationExtras', feedbackNavigationExtras);
    this.router.navigate(['/feedback/save/' + feedbackId], feedbackNavigationExtras);
  }
  // get getImage() {

    
  //   if (this.model.attached_file_path && this.appSetting.isImage(this.model.attached_file_path)) {
  //     if (this.appSetting?.isValidHttpUrl(this.model.attached_file_path) === false) {
  //       return this.model.attached_file_path;
  //     }
     
  //   }

  //   if (this.model.local_attached_file) {
  //     return this.model.local_attached_file;
  //   }

  //   return false;
  // }


  // get getVideo() {

  //   if (this.model.attached_file_path && this.appSetting.isVideo(this.model.attached_file_path)) {
  //     if (this.appSetting?.isValidHttpUrl(this.model.attached_file_path) === false) {
  //       return this.model.attached_file_path;
  //     }
  //     if (this.appSetting?.isValidHttpUrl(this.model.attached_file_path) === true) {
  //       return this.model.local_attached_file;
  //     }
  //   }
  //   return false;

  // }

  ngOnInit() {
    setTimeout(() => {
      console.log('feedbackList', this.feedbackList);
    }, 1000);
    


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

      // console.log("this.guideId", this.guideId)

      this.setModels();
      this.detectChanges();
    });

    this.eventSubscription = this.miscService.events.subscribe((event) => {
      // console.log('What causing the thingy to flicker? ', event.TAG)
      switch (event.TAG) {
        case this.feedbackService.dbModelApi.TAG + ':create':
        case this.feedbackService.dbModelApi.TAG + ':update':
        case this.feedbackService.dbModelApi.TAG + ':delete':
          this.setModels();
          this.detectChanges();
          break;
        default:
      }
    });
  }


  
  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
