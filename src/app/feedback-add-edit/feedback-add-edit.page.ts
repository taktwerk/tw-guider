import {ChangeDetectorRef, Component, NgZone, OnInit, ViewEncapsulation} from '@angular/core';
import {GuiderService} from '../../providers/api/guider-service';
import {GuiderModel} from '../../models/db/api/guider-model';
import {ActivatedRoute} from '@angular/router';
import {GuideStepService} from '../../providers/api/guide-step-service';
import {GuideStepModel} from '../../models/db/api/guide-step-model';
import { File } from '@ionic-native/file/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import {Events, ModalController, IonSlides, NavController, Platform, AlertController} from '@ionic/angular';
import {AuthService} from '../../services/auth-service';
import {GuideAssetService} from '../../providers/api/guide-asset-service';
import {GuideAssetPivotService} from '../../providers/api/guide-asset-pivot-service';
import {GuideAssetTextModalComponent} from '../../components/guide-asset-text-modal-component/guide-asset-text-modal-component';
import {GuideAssetModel} from '../../models/db/api/guide-asset-model';
import {DownloadService} from '../../services/download-service';
import {ApiSync} from '../../providers/api-sync';
import {FeedbackModel} from '../../models/db/api/feedback-model';
import {FeedbackService} from '../../providers/api/feedback-service';
import {IOSFilePicker} from '@ionic-native/file-picker/ngx';
import {Network} from '@ionic-native/network/ngx';
import {FileChooser} from '@ionic-native/file-chooser/ngx';
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
  public attachedFileForDelete: string;

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
      private filePicker: IOSFilePicker,
      private network: Network,
      private fileChooser: FileChooser,
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
    if (!this.model.description) {
      this.http.showToast('validation.Description is required', 'validation.Validation error', 'danger');
      return;
    }
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
    console.log('this.model in add edit page', this.model);
    this.feedbackService.save(this.model).then(res => {
      if (this.network.type === 'none') {
        this.apiPush.setIsPushAvailableData(true);
        this.http.showToast('feedback.Feedback will be sent as soon as the Internet appears');
        if (this.attachedFileForDelete) {
          console.log('delete file here');
        }
        this.dismiss();
      } else {
        this.apiPush.pushOneAtTime().then(() => {
          this.http.showToast('feedback.Feedback was sent');
          if (this.attachedFileForDelete) {
            console.log('delete file here');
          }
          this.dismiss();
        });
      }
    });
  }

  public delete() {
    this.feedbackService.remove(this.model).then(res => {
      if (this.network.type === 'none') {
        this.apiPush.setIsPushAvailableData(true);
        // if (this.attachedFileForDelete) {
        //   console.log('delete file here');
        // }
        this.dismiss();
      } else {
        this.apiPush.pushOneAtTime().then(() => {
          // if (this.attachedFileForDelete) {
          //   console.log('delete file here');
          // }
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

  public addFile() {
    if (this.platform.is('ios')) {
      this.filePicker.pickFile()
          .then(uri => {
            this.model[FeedbackModel.COL_ATTACHED_FILE] = 'File tmp name';
            // Let's copy the file to our local storage
            this.downloadService.copy(uri, this.model.TABLE_NAME).then(success => {
              if (typeof success === 'string') {
                if (this.model[FeedbackModel.COL_ATTACHED_FILE_PATH]) {
                  this.attachedFileForDelete = this.model[FeedbackModel.COL_LOCAL_ATTACHED_FILE];
                }
                this.model[FeedbackModel.COL_ATTACHED_FILE] = success.substr(success.lastIndexOf('/') + 1);
                this.model[FeedbackModel.COL_ATTACHED_FILE_PATH] = '';
                this.model[FeedbackModel.COL_LOCAL_ATTACHED_FILE] = success;
              }
            });
          })
          .catch(e => console.log('FeedbackModal', 'addFile', e));

      return;
    }
    this.fileChooser.open()
        .then(uri => {
          this.model[FeedbackModel.COL_ATTACHED_FILE] = 'File tmp name';

          if (this.platform.is('android')) {
            this.filePath.resolveNativePath(uri)
                .then(nativeFilePath => {
                      // Let's copy the file to our local storage
                      this.downloadService.copy(nativeFilePath, this.model.TABLE_NAME).then(success => {
                        if (typeof success === 'string') {
                          if (this.model[FeedbackModel.COL_ATTACHED_FILE_PATH]) {
                            this.attachedFileForDelete = this.model[FeedbackModel.COL_LOCAL_ATTACHED_FILE];
                          }
                          this.model[FeedbackModel.COL_ATTACHED_FILE] = success.substr(success.lastIndexOf('/') + 1);
                          this.model[FeedbackModel.COL_ATTACHED_FILE_PATH] = '';
                          this.model[FeedbackModel.COL_LOCAL_ATTACHED_FILE] = success;
                        }
                      });
                    }
                );
          } else {
            // Let's copy the file to our local storage
            this.downloadService.copy(uri, this.model.TABLE_NAME).then(success => {
              if (typeof success === 'string') {
                if (this.model[FeedbackModel.COL_ATTACHED_FILE_PATH]) {
                  this.attachedFileForDelete = this.model[FeedbackModel.COL_LOCAL_ATTACHED_FILE];
                }
                this.model[FeedbackModel.COL_ATTACHED_FILE] = success.substr(success.lastIndexOf('/') + 1);
                this.model[FeedbackModel.COL_ATTACHED_FILE_PATH] = '';
                this.model[FeedbackModel.COL_LOCAL_ATTACHED_FILE] = success;
              }
            });
          }

        })
        .catch(e => console.log('FeedbackModal', 'addFile', e));
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
