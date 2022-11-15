/* eslint-disable max-len */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, PLATFORM_ID, Inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { AlertController, IonBackButtonDelegate, NavController, Platform } from '@ionic/angular';
import { FeedbackModel } from 'app/database/models/db/api/feedback-model';
import { ApiSync } from 'app/library/providers/api-sync';
import { FeedbackService } from 'app/library/providers/api/feedback-service';
import { AppSetting } from 'app/library/services/app-setting';
import { AuthService } from 'app/library/services/auth-service';
import { DownloadService } from 'app/library/services/download-service';
import { HttpClient } from 'app/library/services/http-client';
import { PictureService } from 'app/library/services/picture-service';
import { TranslateConfigService } from 'app/library/services/translate-config.service';
import { VideoService } from 'app/library/services/video-service';

@Component({
  selector: 'feedback-add-edit-page',
  templateUrl: 'feedback-add-edit.page.html',
  styleUrls: ['feedback-add-edit.page.scss'],
})
export class FeedbackAddEditPage implements OnInit {
  public model: FeedbackModel;
  public originalModel: FeedbackModel;
  public feedbackId: number = null;
  public slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true,
  };

  public reference_title: string;
  public reference_id: number = null;
  public reference_model: string = null;
  public reference_model_alias: string = null;
  public defaultTitle = 'Feedback';

  public guideId: string;
  public imgURL;
  testBrowser: boolean;
  public params;

  shouldUpdate = false;
  isImageChange = false;
  isVideoChange = false;
  @Input() localurl: any = null;
  @ViewChild(IonBackButtonDelegate) backButton: IonBackButtonDelegate;

  constructor(
    private activatedRoute: ActivatedRoute,
    private photoViewer: PhotoViewer,
    public http: HttpClient,
    public authService: AuthService,
    public appSetting: AppSetting,
    public changeDetectorRef: ChangeDetectorRef,
    public downloadService: DownloadService,
    private feedbackService: FeedbackService,
    public alertController: AlertController,
    private translateConfigService: TranslateConfigService,
    private videoService: VideoService,
    private pictureService: PictureService,
    private apiSync: ApiSync,
    private navCtrl: NavController,
    public platform: Platform,
    private ele: ElementRef,
    @Inject(PLATFORM_ID) platformId: string
  ) {
    this.authService.checkAccess('feedback');
    if (!this.model) {
      this.model = feedbackService.newModel();
      this.originalModel = this.model;
    }

    // this.testBrowser = isPlatformBrowser(platformId);

    // this.imgURL = sessionStorage.getItem('base64');

    // this.platform.backButton.subscribe((res) => {
    //   console.log(this.router.url)
    //   if (this.router.url.includes('/feedback/save/') && this.router.url.includes('guideId=' + this.guideId)) {
    //     this.dismiss();
    //   }
    // })
  }

  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;

  dismiss() {
    this.model.deleteAttachedFilesForDelete();

    // this.ngZone.run(() => {
    //   const feedbackNavigationExtras: NavigationExtras = {
    //     queryParams: {
    //       referenceModelAlias: this.reference_model_alias,
    //       referenceId: this.reference_id,
    //       referenceTitle: this.reference_title,
    //       guideId: this.guideId
    //     },
    //   };
    //   this.router.navigate(['feedback'], feedbackNavigationExtras);
    //
    // });

    this.navCtrl.back();
  }

  async backToFeedbackList() {
    let wasChanges = false;
    if (!this.model[this.model.COL_ID]) {
      if (this.model.title || this.model.description || this.model.attached_file) {
        wasChanges = true;
      }
    } else {
      const modelById = await this.feedbackService.dbModelApi.findFirst([this.model.COL_ID, this.model[this.model.COL_ID]]);
      if (modelById && modelById.length) {
        const originalModel = modelById[0];
        if (
          originalModel.title !== this.model.title ||
          originalModel.description !== this.model.description ||
          originalModel.attached_file !== this.model.attached_file
        ) {
          wasChanges = true;
        }
      }
    }

    if (wasChanges) {
      const alert = await this.alertController.create({
        message: this.translateConfigService.translateWord('save_before_close_warning'),
        cssClass: 'save-changes-alert',
        buttons: [
          {
            text: this.translateConfigService.translateWord('save'),
            cssClass: 'primary',
            handler: () => this.save(),
          },
          {
            text: this.translateConfigService.translateWord('dont_save'),
            handler: () => this.dismiss(),
          },
          {
            text: this.translateConfigService.translateWord('cancel'),
            cssClass: 'last-button',
          },
        ],
      });
      await alert.present();
    } else {
      this.dismiss();
    }
  }

  public async save() {
    const user = await this.authService.getLastUser();
    if (!user) {
      return;
    }
    this.model.user_id = user.userId;
    this.model.created_by = user.userId;
    this.model.client_id = user.client_id;

    if (this.reference_id) {
      this.model.reference_id = this.reference_id;
    }
    if (this.reference_model) {
      this.model.reference_model = 'taktwerk\\yiiboilerplate' + this.reference_model;
    }
    if (!(await this.isValidFeedback())) {
      return;
    }
    if (!this.model.title) {
      this.model.title = this.defaultTitle;
    }
    this.feedbackService.save(this.model).then(async () => {
      this.apiSync.setIsPushAvailableData(true);
      const alertMessage = await this.translateConfigService.translate('alert.model_was_saved', { model: 'Entry' });
      this.http.showToast(alertMessage);
      this.dismiss();
    });
  }

  public openFile(basePath: string, modelName: string, title?: string) {
    const filePath = basePath;
    let fileTitle = 'Feedback';
    if (title) {
      fileTitle = title;
    }
    if (this.downloadService.checkFileTypeByExtension(filePath, 'video') || this.downloadService.checkFileTypeByExtension(filePath, 'audio')) {
      const fileUrl = this.downloadService.getNativeFilePath(basePath, modelName);
      this.videoService.playVideo(fileUrl, fileTitle);
    } else if (this.downloadService.checkFileTypeByExtension(filePath, 'image')) {
      this.photoViewer.show(this.downloadService.getNativeFilePath(basePath, modelName), fileTitle);
    } else if (this.downloadService.checkFileTypeByExtension(filePath, 'pdf')) {
      const fileUrl = this.downloadService.getNativeFilePath(basePath, modelName);
      this.pictureService.openFile(fileUrl, fileTitle);
    }
  }

  detectChanges() {
    this.changeDetectorRef.detectChanges();
  }

  private async isValidFeedback() {
    let errorMessage = '';
    if (!(this.model.title || this.model.description || this.model.local_attached_file)) {
      errorMessage = await this.translateConfigService.translate('validation.nothing_to_save');
    }
    if (this.model.title && this.model.title.length > 255) {
      errorMessage = await this.translateConfigService.translate('validation.max_characters', { property_name: 'title', max: 255 });
    }
    if (errorMessage) {
      const headerMessage = await this.translateConfigService.translate('validation.Validation error');
      this.http.showToast(errorMessage, headerMessage, 'danger', false);
      return false;
    }
    return true;
  }

  public delete() {
    this.feedbackService.remove(this.model).then(async () => {
      this.apiSync.setIsPushAvailableData(true);
      this.dismiss();
      const alertMessage = await this.translateConfigService.translate('alert.model_was_deleted', { model: 'Entry' });
      this.http.showToast(alertMessage);
    });
  }

  async showDeleteAlert() {
    const alertMessage = await this.translateConfigService.translate('alert.are_you_sure_delete_model', { model: 'Entry' });
    const alert = await this.alertController.create({
      message: alertMessage,
      buttons: [
        {
          text: 'Yes',
          cssClass: 'primary',
          handler: () => this.delete(),
        },
        {
          text: 'No',
        },
      ],
    });

    await alert.present();
  }

  async addFileCapacitor() {
    console.log('addFileCapacitor');
    this.downloadService.chooseFile(true).then((recordedFile) => {
      console.log('recordedFile file', recordedFile);
      // this.model.setFile(recordedFile);

      if (this.platform.is('capacitor')) {

        this.model.local_attached_file = 'data:application/pdf;base64,' + recordedFile.uri;


      } else {
        this.model.local_attached_file = recordedFile.uri;

      }
      // this.model.setFile(recordedFile);
      this.shouldUpdate = true;
    }).catch((e) => console.log(e));
  }

  async addVideoUsingCamera() {
    console.log('addVideoUsingCamera');
    this.downloadService.recordVideo(true)
      .then((recordedFile) => {
        this.isImageChange = false;
        console.log('recordedFile video', recordedFile);
        // this.model.setFile(recordedFile);
        if (this.platform.is('capacitor')) {

          this.model.local_attached_file = 'data:video/mp4;base64,' + recordedFile.uri;
          // this.model.local_attached_file =  recordedFile.uri;


        } else {
          this.model.local_attached_file = recordedFile.uri;

        }
        this.shouldUpdate = true;

      }

      )
      .catch((e) => console.log('FeedbackModal', 'addVideoUsingCamera', e));
  }

  addPhotoUsingCamera() {
    console.log('addPhotoUsingCamera');
    this.downloadService.makePhoto(1000, 1000)
      .then((recordedFile) => {
        console.log('recordedFile image', recordedFile);
        // this.model.setFile(recordedFile);

        if (this.platform.is('capacitor')) {

          this.model.local_attached_file = 'data:image/png;base64,' + recordedFile.uri;


        } else {
          this.model.local_attached_file = recordedFile.uri;

        }


        this.shouldUpdate = true;

      }

      )
      .catch((e) => console.log('FeedbackModal', 'addPhotoUsingCamera', e));
  }

  async getDefaultTitle() {
    if (this.model[this.model.COL_ID] && this.model.reference_model && this.model.reference_id) {
      return `${this.model.reference_model}:${this.model.reference_id}`;
    }
    if (this.model.idApi) {
      return `Feedback:${this.model.idApi}`;
    }
    if (this.reference_model_alias && this.reference_id) {
      // return `${this.reference_model_alias}:${this.reference_id}`;
      return this.reference_title;
    }
    if (this.model[this.model.COL_ID]) {
      return `Feedback:${this.model[this.model.COL_ID]}`;
    }
    return 'Feedback';
  }

  get getImage() {

    if (this.appSetting.isImage(this.localurl)) {
      this.ele.nativeElement.src = this.localurl;
      return;
    }

    if (this.model.attached_file_path && this.appSetting.isImage(this.model.attached_file_path)) {
      if (this.appSetting?.isValidHttpUrl(this.model.attached_file_path) === false) {
        return this.model.attached_file_path;

      }
    }
    if (this.model.local_attached_file) {
      return this.model.local_attached_file;
    }


    return false;
  }


  get getVideo() {


    if (this.appSetting.isVideo(this.localurl)) {
      console.log(this.localurl);

      this.ele.nativeElement.src = this.localurl;
      console.log(this.ele.nativeElement.src);

      return;
    }
    if (this.model.attached_file_path && this.appSetting.isVideo(this.model.attached_file_path)) {
      if (this.appSetting?.isValidHttpUrl(this.model.attached_file_path) === false) {
        return this.model.attached_file_path;
      }

    }
    if (this.model.attached_file_path) {
      return this.model.local_attached_file;
    }
    return false;

  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async (params) => {
      const feedbackData = params;
      this.reference_id = +feedbackData.referenceId;
      this.reference_title = feedbackData.referenceTitle;
      this.reference_model_alias = feedbackData.referenceModelAlias;
      this.reference_model = this.feedbackService.dbModelApi.getReferenceModelByAlias(this.reference_model_alias);
      this.guideId = feedbackData.guideId;

      // console.log("guideId at feedback-add-edit", this.guideId)

      // console.log('feedback add edit this.reference_model_alias', this.reference_model_alias);
      this.feedbackId = +feedbackData.feedbackId;
      if (this.feedbackId) {
        const result = await this.feedbackService.dbModelApi.findFirst([this.model.COL_ID, this.feedbackId]);
        this.model = result[0];
        console.log(this.model);
      }
      this.defaultTitle = await this.getDefaultTitle();
    });
  }

  ionViewDidEnter() {
    this.backButton.onClick = () => {
      this.backToFeedbackList();
    };
  }
}
