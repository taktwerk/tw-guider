import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
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
      private translateConfigService: TranslateConfigService
  ) {
    this.authService.checkAccess();
    if (!this.model) {
      this.model = feedbackService.newModel();
    }
  }

  dismiss() {
    this.model.deleteAttachedFilesForDelete();

    this.ngZone.run(() => {
      if (this.reference_model_alias && this.reference_id) {
        this.navCtrl.navigateRoot(this.reference_model_alias + '/' + this.reference_id + '/feedback');
      } else {
        this.navCtrl.navigateRoot('/feedback');
      }
    });
  }

  public openFile(basePath: string, modelName: string, title?: string) {
    const filePath = basePath;
    if (filePath.indexOf('.MOV') > -1 || filePath.indexOf('.mp4') > -1) {
      this.streamingMedia.playVideo(
          this.downloadService.getNativeFilePath(basePath, modelName),
      );
    } else if (filePath.indexOf('.jpg') > -1 || filePath.indexOf('.png') > -1) {
      let photoTitle = 'Feedback';
      if (title) {
        photoTitle = title;
      }
      this.photoViewer.show(
          this.downloadService.getNativeFilePath(basePath, modelName),
          photoTitle
      );
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
    if (this.reference_id) {
      this.model.reference_id = this.reference_id;
    }
    if (this.reference_model) {
      this.model.reference_model = this.reference_model;
    }
    if (!(await this.isValidFeedback())) {
      return;
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
    if (!this.model.description) {
      errorMessage = await this.translateConfigService.translate('validation.Description is required');
    }
    if (!this.model.title) {
      errorMessage = await this.translateConfigService.translate('validation.Title is required');
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
    this.downloadService.chooseFile()
        .then(uri => this.copyFeedbackFileToLocalStorage(uri))
        .catch(e => console.log('FeedbackModal', 'addFile', e));
  }

  async addVideoUsingCamera() {
    try {
      const videoFileUri = await this.downloadService.recordVideo();
      const videoThumbnailPath = await this.downloadService.makeVideoThumbnail(videoFileUri);
      this.copyFeedbackFileToLocalStorage(videoFileUri, videoThumbnailPath);
    } catch (error) {
      console.log('FeedbackModal', 'addVideoUsingCamera', error);
    }
  }

  addPhotoUsingCamera() {
    this.downloadService.makePhoto(1000, 1000)
        .then(uri => this.copyFeedbackFileToLocalStorage(uri))
        .catch(e => console.log('FeedbackModal', 'addPhotoUsingCamera', e));
  }

  async copyFeedbackFileToLocalStorage(uri, thumbnailUri?: any) {
    const fileName = await this.downloadService.copy(uri, this.model.TABLE_NAME);
    let thumbnailFileName = '';
    if (thumbnailUri) {
      thumbnailFileName = await this.downloadService.copy(thumbnailUri, this.model.TABLE_NAME);
    }
    console.log('fileName copyFeedbackFileToLocalStorage', fileName);
    console.log('thumbnailFileName copyFeedbackFileToLocalStorage', thumbnailFileName);
    if (typeof fileName === 'string') {
      this.model.setFileProperty(FeedbackModelDownloadMapEnum.ATTACHED_FILE, fileName, thumbnailFileName, true);
    }
  }

  getReferenceModel(referenceModelAlias) {
    switch (referenceModelAlias) {
      case 'guide':
        return 'app\\modules\\guide\\models\\Guide';
      default:
        return null;
    }
  }

  ngOnInit() {
    this.feedbackId = +this.activatedRoute.snapshot.paramMap.get('feedbackId');
    this.reference_id = +this.activatedRoute.snapshot.paramMap.get('reference_id');
    this.reference_model_alias = this.activatedRoute.snapshot.paramMap.get('reference_model_alias');
    this.reference_model = this.getReferenceModel(this.reference_model_alias);
    if (this.feedbackId) {
      this.feedbackService.dbModelApi.findFirst(['id', this.feedbackId]).then((result) => {
        this.model = result[0];
      });
    }
  }
}
