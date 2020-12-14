import { GuiderModel } from './../../models/db/api/guider-model';
import { GuiderService } from './../../providers/api/guider-service';

import { CKEditorComponent } from './../../components/ckeditor/ckeditor.page';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GuideAssetService } from 'src/providers/api/guide-asset-service';
import { GuideStepService } from 'src/providers/api/guide-step-service';
import { DownloadService } from '../../services/download-service';
import { VideoService } from 'src/services/video-service';
import { PictureService } from 'src/services/picture-service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AuthService } from 'src/services/auth-service';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { ApiSync } from 'src/providers/api-sync';
import { GuideStepModel } from 'src/models/db/api/guide-step-model';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UserService } from 'src/services/user-service';

@Component({
  selector: 'app-addstep',
  templateUrl: './addstep.page.html',
  styleUrls: ['./addstep.page.scss'],
})
export class AddstepPage implements OnInit {
  public Editor = ClassicEditor;

  public model: GuideStepModel;
  public guide: GuiderModel;
  public params;
  guideId;

  ckeConfig

  public guideSteps: GuideStepModel[] = [];

  constructor(
    private guideStepService: GuideStepService,
    private guiderService: GuiderService,
    private userService: UserService,
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
    private modalController: ModalController,
  ) {
    this.model = this.guideStepService.newModel();
    this.model.description_html = ""
  }

  ngOnInit() {
    this.ckeConfig = {
      toolbar: ["heading", "bold", "italic", "blockQuote", "numberedList", "bulletedList", "insertTable"],
      toolbarLocation: 'bottom',
      isReadOnly: true
    };

    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.has('id')) {
        this.guideId = paramMap.get("id");
        this.model.guide_id = this.guideId;
        this.setGuideSteps(this.guideId);
        this.setGuide(this.guideId);
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
    /* this.fileChooser.open().then(async (resp) => {
      const res = await this.downloadService.getResolvedNativeFilePath(resp);

      const recordedFile = new RecordedFile();
      recordedFile.uri = res;
      this.model.setFile(recordedFile);
    }) */
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
        console.log(">>>>>>>>>>>>>>>> recordedFile><>>>>>>>>>>>>>>>>>")
        console.log(recordedFile)
        console.log(">>>>>>>>>>>>>>>> recordedFile ><>>>>>>>>>>>>>>>>>")

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

  public async setGuide(id) {
    const guiderById = await this.guiderService.getById(this.guideId);
    if (guiderById.length) {
      this.guide = guiderById[0];
    }
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
    if (!this.model.guide_id) { return; }
    if (!this.model.order_number) { this.model.order_number = this.guideSteps.length + 1; }
    this.guideSteps.splice(this.model.order_number - 1, 0, this.model)
    this.guideSteps.map((step, index) => {
      step.order_number = index + 1;
      this.setGuideSteps(this.guideId).then(() => {
        this.guideStepService.save(step).then(() => {
          this.updateGuide();
          this.apiSync.setIsPushAvailableData(true);
          this.showToast(`${this.model.title} saved`);
          this.router.navigate(["/", "editguide", this.guideId]);
        }).catch((e) => console.log(e))
      })
    })
  }

  onCancel() { this.router.navigate(["/", "editguide", this.guideId]); }

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
}
