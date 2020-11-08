import { ActivatedRoute, Router } from '@angular/router';
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
import { GuideStepModel } from 'src/models/db/api/guide-step-model';

const { Filesystem } = Plugins;

@Component({
  selector: 'app-addstep',
  templateUrl: './addstep.page.html',
  styleUrls: ['./addstep.page.scss'],
})
export class AddstepPage implements OnInit {
  public model: GuideStepModel;
  public params;
  guideId;
  public guideSteps: GuideStepModel[] = [];

  constructor(
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
    private activatedRoute: ActivatedRoute,
  ) {
    this.model = this.guideStepService.newModel();
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.has('id')) {
        this.guideId = paramMap.get("id");
        this.model.guide_id = this.guideId;
        console.log(this.model.guide_id)
      }
    })
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
      path: 'model/' + fileName,
      directory: FilesystemDirectory.Data
    });

    const finalPhotoUri = await Filesystem.getUri({
      directory: FilesystemDirectory.Data,
      path: 'model/' + fileName,
    });

    let photoPath = Capacitor.convertFileSrc(finalPhotoUri.uri);

    const recordedFile = new RecordedFile();
    recordedFile.uri = photoPath;
    this.model.setFileProperty(recordedFile);
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

  async save() {
    const user = await this.authService.getLastUser();
    if (!user) { return; }
    if (!this.model.guide_id) { return; }
    if (!this.model.order_number) { this.model.order_number = this.guideSteps.length + 1; }
    this.setGuideSteps(this.guideId).then(() => {
      this.guideStepService.save(this.model).then((res) => {
        this.apiSync.setIsPushAvailableData(true);
        this.showToast(`${this.model.title} saved`);
        this.router.navigate(["/", "editguide", this.guideId]);
      }).catch((e) => console.log(e))
    })
  }

  onCancel() { this.router.navigate(["/", "editguide", this.guideId]); }

  async showToast(message) {
    const toast = await this.toastController.create({ message: message, duration: 800 });
    toast.present();
  }
}
