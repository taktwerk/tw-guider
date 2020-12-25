import { GuiderModel } from './../../models/db/api/guider-model';
import { GuiderService } from './../../providers/api/guider-service';
import { ActivatedRoute, Router } from '@angular/router';
import { GuideStepModel } from './../../models/db/api/guide-step-model';
import { Component, OnInit } from '@angular/core';
import { GuideStepService } from 'src/providers/api/guide-step-service';
import { DownloadService } from '../../services/download-service';
import { VideoService } from 'src/services/video-service';
import { PictureService } from 'src/services/picture-service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AuthService } from 'src/services/auth-service';
import { TranslateConfigService } from 'src/services/translate-config.service';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ApiSync } from 'src/providers/api-sync';
import { HttpClient } from '../../services/http-client';
import { CKEditorComponent } from './../../components/ckeditor/ckeditor.page';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UserService } from 'src/services/user-service';

@Component({
  selector: 'app-guidestep-add-edit',
  templateUrl: './guidestep-add-edit.page.html',
  styleUrls: ['./guidestep-add-edit.page.scss'],
})
export class GuidestepAddEditPage implements OnInit {
  public Editor = ClassicEditor;

  public params;
  public model: GuideStepModel;

  public guide: GuiderModel;
  public previousDescription;
  public previousTitle;
  public previousOrderNumber;
  public stepId: any;
  public guideId: any;
  public defaultTitle = 'Guide Step';
  public guideSteps: GuideStepModel[];

  action: string;

  shouldUpdate = false;
  shouldSave = false;

  ckeConfig

  title = ""

  constructor(
    private translateConfigService: TranslateConfigService,
    private activatedRoute: ActivatedRoute,
    private guideStepService: GuideStepService,
    private guiderService: GuiderService,
    public downloadService: DownloadService,
    private videoService: VideoService,
    private photoViewer: PhotoViewer,
    private pictureService: PictureService,
    public authService: AuthService,
    public alertController: AlertController,
    private apiSync: ApiSync,
    private router: Router,
    public http: HttpClient,
    private modalController: ModalController,
    private userService: UserService,
    private toastController: ToastController,
  ) {

    this.activatedRoute.queryParams.subscribe((param) => {
      this.guideId = param.guideId;
      this.stepId = param.stepId;
      this.action = param.action;

      if (this.action == 'edit') {
        this.guideStepService.dbModelApi.findAllWhere(['guide_id', this.guideId], 'order_number ASC').then(results => {
          this.model = results.filter(model => {
            return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT] && model.idApi == this.stepId
          })[0];
          this.previousDescription = this.model.description_html;
          this.previousTitle = this.model.title;
          this.previousOrderNumber = this.model.order_number;
        });
      }
      else {
        this.model = this.guideStepService.newModel();
        this.model.description_html = ""
      }

      this.setGuideSteps(this.guideId);
      this.setGuide();
    })
  }

  ngOnInit() {
    this.ckeConfig = {
      toolbar: ["heading", "bold", "italic", "blockQuote", "numberedList", "bulletedList", "insertTable"],
      toolbarLocation: 'bottom',
      isReadOnly: true
    };
  }

  public openFile(basePath: string, modelName: string, title?: string) {
    const filePath = basePath;
    let fileTitle = 'Edit Step';
    if (title) {
      fileTitle = title;
    }
    if (this.downloadService.checkFileTypeByExtension(filePath, 'video') || this.downloadService.checkFileTypeByExtension(filePath, 'audio')) {
      const fileUrl = this.downloadService.getNativeFilePath(basePath, modelName);
      this.videoService.playVideo(fileUrl, fileTitle);
    }
    else if (this.downloadService.checkFileTypeByExtension(filePath, 'image')) {
      this.photoViewer.show(this.downloadService.getNativeFilePath(basePath, modelName), fileTitle);
    }
    else if (this.downloadService.checkFileTypeByExtension(filePath, 'pdf')) {
      const fileUrl = this.downloadService.getNativeFilePath(basePath, modelName);
      this.pictureService.openFile(fileUrl, fileTitle);
    }
  }

  async addFileCapacitor() {
    this.downloadService.chooseFile().then((recordedFile) => {
      this.model.setFile(recordedFile);
    })
  }

  async addVideoUsingCamera() {
    this.downloadService
      .recordVideo(true)
      .then((recordedFile) => {
        this.model.setFile(recordedFile)
      })
      .catch((e) => console.log('model', 'addVideoUsingCamera', e));
  }

  addPhotoUsingCamera() {
    this.downloadService
      .makePhoto(1000, 1000)
      .then((recordedFile) => {
        this.model.setFile(recordedFile)
      })
      .catch((e) => console.log('model', 'addPhotoUsingCamera', e));
  }

  public setGuideSteps(id) {
    return this.guideStepService.dbModelApi.findAllWhere(['guide_id', id], 'order_number ASC').then(results => {
      this.guideSteps = results.filter(model => {
        return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT];
      });
    });
  }

  public async setGuide() {
    const guiderById = await this.guiderService.getById(this.guideId);
    if (guiderById.length) {
      this.guide = guiderById[0];
    }
  }

  onChanges(event) {
    if (event.target != undefined && event.target.value != this.previousTitle) {
      this.shouldUpdate = true;
    }
    else if (this.previousDescription != this.model.description_html) {
      this.shouldUpdate = true;
    }
    else { this.shouldUpdate = false }
  }

  editorChanges() {
    if (this.previousDescription != this.model.description_html) {
      this.shouldUpdate = true;
    }
    else { this.shouldUpdate = false }
  }

  updateGuide() {
    if (this.guide) {
      this.userService.getUser().then((res) => {
        this.guide.created_by = res.userId;
      });
      this.guiderService.save(this.guide);
    }
  }

  async save() {
    const user = await this.authService.getLastUser();
    if (!user) { return; }
    // save new step
    if (this.action == 'add') {
      if (!this.model.order_number) { this.model.order_number = this.guideSteps.length + 1; }
      this.guideSteps.splice(this.model.order_number - 1, 0, this.model);
      console.log(this.model.order_number == this.guideSteps.length);
      // save one
      if (this.model.order_number == this.guideSteps.length) {
        this.guideStepService.save(this.model).then(async () => {
          this.apiSync.setIsPushAvailableData(true);
          this.updateGuide();
          const alertMessage = await this.translateConfigService.translate('alert.model_was_saved', { model: 'Entry' });
          this.http.showToast(alertMessage);
          this.shouldUpdate = false;
          this.shouldSave = false;
          // this.router.navigate(["/", "editguide", this.guideId]);
        }).catch((e) => console.log(e))
      }
      // save all
      else {
        this.guideSteps.map((step, index) => {
          step.order_number = index + 1;
          this.setGuideSteps(this.guideId).then(() => {
            this.guideStepService.save(step).then(async () => {
              this.updateGuide();
              this.apiSync.setIsPushAvailableData(true);
              const alertMessage = await this.translateConfigService.translate('alert.model_was_saved', { model: 'Entry' });
              this.http.showToast(alertMessage);
              // this.router.navigate(["/", "editguide", this.guideId]);
            }).catch((e) => console.log(e))
          })
        })
      }

    }
    // save edited step
    if (this.action == "edit") {
      this.guideStepService.save(this.model).then(async () => {
        this.apiSync.setIsPushAvailableData(true);
        this.updateGuide();
        const alertMessage = await this.translateConfigService.translate('alert.model_was_saved', { model: 'Entry' });
        this.http.showToast(alertMessage);
        this.shouldUpdate = false;
        this.shouldSave = false;
        // this.router.navigate(["/", "editguide", this.guideId]);
      }).catch((e) => console.log(e))
    }
  }

  async showCancelAlert() {
    if (this.shouldUpdate) {
      this.shouldSave = true;
    }

    if (this.shouldSave) {
      const alertMessage = await this.translateConfigService.translate('alert.are_you_sure_go_back');
      const alert = await this.alertController.create({
        message: alertMessage,
        buttons: [
          {
            text: await this.translateConfigService.translate('save'),
            handler: () => this.save(),
          },
          {
            text: await this.translateConfigService.translate('dismiss'),
            cssClass: 'primary',
            handler: () => this.cancel(),
          }
        ],
      });
      await alert.present();
    }
    else {
      this.cancel()
    }
  }

  cancel() { this.router.navigate(["/", "editguide", this.guideId]); }

  async showToast(message) {
    const toast = await this.toastController.create({ message: message, duration: 800 });
    toast.present();
  }

  async openEditor() {
    const modal = await this.modalController.create({
      component: CKEditorComponent,
      componentProps: {
        content: this.model.description_html
      },
      cssClass: "modal-fullscreen",
    });
    modal.onDidDismiss()
      .then((res: any) => {
        if (res != null) {
          this.model.description_html = res.data.data
        }
      });
    return await modal.present();
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

  delete() {
    this.guideStepService.remove(this.model).then(async () => {
      this.apiSync.setIsPushAvailableData(true);
      this.updateGuide();
      const alertMessage = await this.translateConfigService.translate('alert.model_was_deleted', { model: 'Entry' });
      this.http.showToast(alertMessage);

      this.setGuideSteps(this.guideId).then(() => {
        this.guideSteps.map((step, index) => {
          step.order_number = index + 1;
          this.guideStepService.save(step).then(() => {
            this.apiSync.setIsPushAvailableData(true);
          })
        })
      })
      this.router.navigate(["/", "editguide", this.guideId]);
    })
  }
}
