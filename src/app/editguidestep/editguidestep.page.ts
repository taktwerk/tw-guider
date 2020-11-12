import { ActivatedRoute, Router } from '@angular/router';
import { GuideStepModel } from './../../models/db/api/guide-step-model';
import { Component, OnInit } from '@angular/core';
import { GuideAssetService } from 'src/providers/api/guide-asset-service';
import { GuideStepService } from 'src/providers/api/guide-step-service';
import { DownloadService, RecordedFile } from '../../services/download-service';
import { VideoService } from 'src/services/video-service';
import { PictureService } from 'src/services/picture-service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { CameraResultType, CameraSource, Capacitor } from '@capacitor/core';
import { AuthService } from 'src/services/auth-service';
import { TranslateConfigService } from 'src/services/translate-config.service';
import { AlertController, ToastController } from '@ionic/angular';
import { ApiSync } from 'src/providers/api-sync';
import { HttpClient } from '../../services/http-client';

const { Filesystem } = Plugins;

@Component({
  selector: 'app-editguidestep',
  templateUrl: './editguidestep.page.html',
  styleUrls: ['./editguidestep.page.scss'],
})
export class EditguidestepPage implements OnInit {
  public params;
  public model: GuideStepModel;
  public previousModel: GuideStepModel
  public stepId: any;
  public guideId: any;
  public defaultTitle = 'Guide Step';
  public guideSteps: GuideStepModel[];

  shouldUpdate = false;

  constructor(
    private translateConfigService: TranslateConfigService,
    private activatedRoute: ActivatedRoute,
    private guideStepService: GuideStepService,
    private guideAssetService: GuideAssetService,
    public downloadService: DownloadService,
    private videoService: VideoService,
    private photoViewer: PhotoViewer,
    private pictureService: PictureService,
    public authService: AuthService,
    public alertController: AlertController,
    private toastController: ToastController,
    private apiSync: ApiSync,
    private router: Router,
    public http: HttpClient,
  ) {
    // this.authService.checkAccess('guider');

    this.activatedRoute.queryParams.subscribe((param) => {
      this.guideId = param.guideId;
      this.stepId = param.stepId;
      this.guideStepService.dbModelApi.findAllWhere(['guide_id', this.guideId], 'order_number ASC').then(results => {
        this.model = results.filter(model => {
          return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT] && model.idApi == this.stepId
        })[0];
        this.previousModel = this.model;
        this.setGuideSteps(this.guideId)
      });
    })
  }

  ngOnInit() { }

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
    console.log('before get file');
    const image = await Plugins.Camera.getPhoto({
      allowEditing: false,
      source: CameraSource.Photos,
      resultType: CameraResultType.Uri,
      saveToGallery: false
    });

    console.log('after get file', image);

    const photoInTempStorage = await Filesystem.readFile({ path: image.path });

    console.log('after readFile', photoInTempStorage);

    let date = new Date(),
      time = date.getTime(),
      fileName = time + ".jpeg";

    await Filesystem.writeFile({
      data: photoInTempStorage.data,
      path: 'guidestep/' + fileName,
      directory: FilesystemDirectory.Data
    });

    const finalPhotoUri = await Filesystem.getUri({
      directory: FilesystemDirectory.Data,
      path: 'guidestep/' + fileName,
    });

    let photoPath = Capacitor.convertFileSrc(finalPhotoUri.uri);

    const recordedFile = new RecordedFile();
    recordedFile.uri = photoPath;
    this.model.setFileProperty(recordedFile);

    this.shouldUpdate = true;
  }

  async addVideoUsingCamera() {
    this.downloadService
      .recordVideo(true)
      .then((recordedFile) => {
        this.model.setFile(recordedFile)
        this.shouldUpdate = true;
      })
      .catch((e) => console.log('model', 'addVideoUsingCamera', e));
  }

  addPhotoUsingCamera() {
    this.downloadService
      .makePhoto(1000, 1000)
      .then((recordedFile) => {
        this.model.setFile(recordedFile)
        this.shouldUpdate = true;
      })
      .catch((e) => console.log('model', 'addPhotoUsingCamera', e));
  }

  onChanges(event) {
    if (event.target.value != this.previousModel.title || event.target.value != this.previousModel.description_html) {
      this.shouldUpdate = true;
    }
    else { this.shouldUpdate = false }
  }

  public setGuideSteps(id) {
    return this.guideStepService.dbModelApi.findAllWhere(['guide_id', id], 'order_number ASC').then(results => {
      this.guideSteps = results.filter(model => {
        return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT];
      });
    });
  }

  async save() {
    const user = await this.authService.getLastUser();
    if (!user) {
      return;
    }
    this.guideStepService.save(this.model).then(async () => {
      this.apiSync.setIsPushAvailableData(true);
      const alertMessage = await this.translateConfigService.translate('alert.model_was_saved', { model: 'GuideStep' });
      this.http.showToast(alertMessage);
      this.shouldUpdate = false;
    }).catch((e) => console.log(e))
  }

  async showDeleteAlert() {
    console.log("Delete button")
    const alertMessage = await this.translateConfigService.translate('alert.are_you_sure_delete_model', { model: 'Step' });
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
      const alertMessage = await this.translateConfigService.translate('alert.model_was_deleted', { model: 'GuideStep' });
      this.http.showToast(alertMessage);

      this.setGuideSteps(this.guideId).then(() => {
        this.guideSteps.map((step, index) => {
          step.order_number = index + 1;
          this.guideStepService.save(step).then((res) => {
            this.apiSync.setIsPushAvailableData(true);
          })
        })
      })
      this.router.navigate(["/", "editguide", this.guideId]);
    })
  }
}
