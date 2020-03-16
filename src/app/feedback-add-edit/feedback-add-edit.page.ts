import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import {Events, ModalController, IonSlides, NavController, Platform, AlertController} from '@ionic/angular';
import {AuthService} from '../../services/auth-service';
import {DownloadService} from '../../services/download-service';
import {FeedbackModel, FeedbackModelDownloadMapEnum} from '../../models/db/api/feedback-model';
import {FeedbackService} from '../../providers/api/feedback-service';
import {Network} from '@ionic-native/network/ngx';
import {HttpClient} from '../../services/http-client';
import {ApiPush} from '../../providers/api-push';
import {FilePath} from '@ionic-native/file-path/ngx';
import {TranslateConfigService} from '../../services/translate-config.service';
import {VideoService} from '../../services/video-service';

@Component({
  selector: 'feedback-add-edit-page',
  templateUrl: 'feedback-add-edit.page.html',
  styleUrls: ['feedback-add-edit.page.scss']
})
export class FeedbackAddEditPage implements OnInit {
  public model: FeedbackModel;
  public feedbackId: number = null;
  public slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  };
  public reference_id: number = null;
  public reference_model: string = null;
  public reference_model_alias: string = null;
  public defaultTitle = 'Feedback';

  constructor(
      private activatedRoute: ActivatedRoute,
      private file: File,
      private streamingMedia: StreamingMedia,
      private photoViewer: PhotoViewer,
      public events: Events,
      public http: HttpClient,
      public authService: AuthService,
      public changeDetectorRef: ChangeDetectorRef,
      public modalController: ModalController,
      public downloadService: DownloadService,
      private feedbackService: FeedbackService,
      private navCtrl: NavController,
      private network: Network,
      private apiPush: ApiPush,
      private platform: Platform,
      private filePath: FilePath,
      private ngZone: NgZone,
      public alertController: AlertController,
      private translateConfigService: TranslateConfigService,
      private router: Router,
      private videoService: VideoService
  ) {
    this.authService.checkAccess();
    if (!this.model) {
      this.model = feedbackService.newModel();
    }
  }

  dismiss() {
    this.model.deleteAttachedFilesForDelete();

    this.ngZone.run(() => {
      const feedbackNavigationExtras: NavigationExtras = {
        queryParams: {
          referenceModelAlias: this.reference_model_alias,
          referenceId: this.reference_id
        }
      };
      this.router.navigate(['feedback'], feedbackNavigationExtras);
    });
  }

  public openFile(basePath: string, modelName: string, title?: string) {
    const filePath = basePath;
    let fileTitle = 'Feedback';
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

  public async save() {
    const user = await this.authService.getLastUser();
    if (!user) {
      return;
    }
    this.model.user_id = user.userId;
    this.model.client_id = user.client_id;
    if (this.reference_id) {
      this.model.reference_id = this.reference_id;
    }
    if (this.reference_model) {
      this.model.reference_model = this.reference_model;
    }
    if (!(await this.isValidFeedback())) {
      return;
    }
    if (!this.model.title) {
      this.model.title = this.defaultTitle;
    }
    this.feedbackService.save(this.model).then(res => {
      if (this.network.type === 'none') {
        this.apiPush.setIsPushAvailableData(true);
        this.http.showToast('feedback.Feedback will be sent as soon as the Internet appears');
        this.dismiss();
      } else {
        this.apiPush.pushOneAtTime().then(() => {
          this.http.showToast('feedback.Feedback was sent');
          this.dismiss();
        });
      }
    });
  }

  private async isValidFeedback() {
    let errorMessage = '';
    if (!(this.model.title || this.model.description || this.model.attached_file)) {
      errorMessage = await this.translateConfigService.translate('validation.nothing_to_save');
    }
    if (this.model.title && this.model.title.length > 255) {
      errorMessage = await this.translateConfigService.translate(
          'validation.max_characters',
          {property_name: 'title', max: 255}
      );
    }
    if (errorMessage) {
      const headerMessage = await this.translateConfigService.translate('validation.Validation error');
      this.http.showToast(errorMessage, headerMessage, 'danger', false);

      return false;
    }

    return true;
  }

  public delete() {
    this.feedbackService.remove(this.model).then(res => {
      if (this.network.type === 'none') {
        this.apiPush.setIsPushAvailableData(true);
        this.dismiss();
      } else {
        this.apiPush.pushOneAtTime().then(() => {
          this.dismiss();
        });
      }
      this.http.showToast('feedback.Feedback was deleted');
    });
  }

  async showDeleteAlert() {
    const alert = await this.alertController.create({
      message: this.translateConfigService.translateWord('feedback.Are you sure you want to delete this feedback?'),
      buttons: [
        {
          text: 'Yes',
          cssClass: 'primary',
          handler: (blah) => this.delete()
        }, {
          text: 'No'
        }
      ]
    });

    await alert.present();
  }

  addFile() {
    this.downloadService.chooseFile(true)
        .then(recordedFile => this.model.setFile(recordedFile))
        .catch(e => console.log('FeedbackModal', 'addFile', e));
  }

  async addVideoUsingCamera() {
    this.downloadService.recordVideo(true)
        .then(recordedFile => this.model.setFile(recordedFile))
        .catch(e => console.log('FeedbackModal', 'addVideoUsingCamera', e));
  }

  addPhotoUsingCamera() {
    this.downloadService.makePhoto(1000, 1000)
        .then(recordedFile => this.model.setFile(recordedFile))
        .catch(e => console.log('FeedbackModal', 'addPhotoUsingCamera', e));
  }

  async getDefaultTitle() {
    if (this.model.id && this.model.reference_model && this.model.reference_id) {
      return `${this.model.reference_model}:${this.model.reference_id}`;
    }
    if (this.model.idApi) {
      return `Feedback:${this.model.idApi}`;
    }
    if (this.reference_model_alias && this.reference_id) {
      return `${this.reference_model_alias}:${this.reference_id}`;
    }
    if (this.model.id) {
      return `Feedback:${this.model.id}`;
    }

    const lastRecordLocalId = await this.model.getLastRecordLocalId();

    return `Feedback:${lastRecordLocalId}`;
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async params => {
      const feedbackData = params;
      console.log('feedbackData', feedbackData);
      this.reference_id = +feedbackData.referenceId;
      this.reference_model_alias = feedbackData.referenceModelAlias;
      this.reference_model = this.reference_model_alias;
      this.feedbackId = +feedbackData.feedbackId;
      if (this.feedbackId) {
        const result = await this.feedbackService.dbModelApi.findFirst([this.model.COL_ID, this.feedbackId]);
        this.model = result[0];
      }
      this.defaultTitle = await this.getDefaultTitle();
    });
  }
}
