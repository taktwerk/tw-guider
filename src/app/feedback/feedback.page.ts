import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Events, ModalController, NavController, Platform} from '@ionic/angular';
import {FeedbackService} from '../../providers/api/feedback-service';
import {FeedbackModel} from '../../models/db/api/feedback-model';
import {HttpClient} from '../../services/http-client';
import {AuthService} from '../../services/auth-service';
import {ApiPush} from '../../providers/api-push';
import {DownloadService} from '../../services/download-service';
import {FilePath} from '@ionic-native/file-path/ngx';
import {FileChooser} from '@ionic-native/file-chooser/ngx';
import {StreamingMedia} from '@ionic-native/streaming-media/ngx';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {ActivatedRoute} from '@angular/router';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'feedback-page',
  templateUrl: 'feedback.page.html',
})
export class FeedbackPage implements OnInit {

    public model: FeedbackModel;
    public reference_id: number = null;
    public reference_model: string = null;
    public reference_model_alias: string = null;
    public feedbackList: FeedbackModel[] = [];
    public isComponentLikeModal = false;

    constructor(private feedbackService: FeedbackService,
                private apiPush: ApiPush,
                private modalController: ModalController,
                public http: HttpClient,
                public events: Events,
                public authService: AuthService,
                public changeDetectorRef: ChangeDetectorRef,
                private downloadService: DownloadService,
                private platform: Platform,
                private activatedRoute: ActivatedRoute,
                private filePath: FilePath,
                private streamingMedia: StreamingMedia,
                private photoViewer: PhotoViewer,
                private fileChooser: FileChooser,
                private navCtrl: NavController) {
        if (!this.model) {
            this.model = feedbackService.newModel();
        }
    }

    public async save() {
        if (!this.model.description) {
            this.http.showToast('Description is required', 'Validation error', 'danger');
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
        this.feedbackService.save(this.model).then(res => {
            this.model = this.feedbackService.newModel();
            this.apiPush.pushOneAtTime();
        });
    }

    public addFile() {
        this.fileChooser.open()
            .then(uri => {
                this.model[FeedbackModel.COL_ATTACHED_FILE] = 'File tmp name';

                if (this.platform.is('android')) {
                    this.filePath.resolveNativePath(uri)
                        .then(nativeFilePath => {
                                console.log('this.camera.getPicture in addFile');
                                // Let's copy the file to our local storage
                                this.downloadService.copy(nativeFilePath, this.model.TABLE_NAME).then(success => {
                                    if (typeof success === 'string') {
                                        this.model[FeedbackModel.COL_ATTACHED_FILE] = success.substr(success.lastIndexOf('/') + 1);
                                        this.model[FeedbackModel.COL_ATTACHED_FILE_PATH] = false;
                                        this.model[FeedbackModel.COL_LOCAL_ATTACHED_FILE] = success;
                                    }
                                });
                            }
                        );
                } else {
                    // Let's copy the file to our local storage
                    this.downloadService.copy(uri, this.model.TABLE_NAME).then(success => {
                        if (typeof success === 'string') {
                            this.model[FeedbackModel.COL_ATTACHED_FILE] = success.substr(success.lastIndexOf('/') + 1);
                            this.model[FeedbackModel.COL_ATTACHED_FILE_PATH] = false;
                            this.model[FeedbackModel.COL_LOCAL_ATTACHED_FILE] = success;
                        }
                    });
                }

            })
            .catch(e => console.log('FeedbackModal', 'addFile', e));
    }

    public changeEditModel(model?: FeedbackModel) {
        if (!model) {
            this.model = this.feedbackService.newModel();
        } else {
            this.model = model;
        }
    }

    public async setModels()  {
        const user = await this.authService.getLastUser();
        if (!user) {
            return;
        }
        const feedbackSearchCondition = [['user_id', user.userId], 'deleted_at IS NULL'];
        if (this.reference_id && this.reference_model) {
            feedbackSearchCondition.push(['reference_id', this.reference_id]);
            // feedbackSearchCondition.push(['reference_model', this.reference_model]);
        }
        this.feedbackService.dbModelApi.findAllWhere(feedbackSearchCondition, '_id ASC')
            .then(data => {
                this.feedbackList = data;
            });
    }

    public openFile(filePath, nativeUrl, title?: string) {
        if (!nativeUrl) {
            return null;
        }
        if (filePath.indexOf('.MOV') > -1 || filePath.indexOf('.mp4') > -1) {
            // E.g: Use the Streaming Media plugin to play a video
            this.streamingMedia.playVideo(nativeUrl);
        } else if (filePath.indexOf('.jpg') > -1 || filePath.indexOf('.png') > -1) {
            let photoTitle = 'Guide image';
            if (title) {
                photoTitle = title;
            }
            this.photoViewer.show(nativeUrl, photoTitle);
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

    getReferenceModel(referenceModelAlias) {
        switch (referenceModelAlias) {
            case 'guide':
                this.isComponentLikeModal = true;
                return 'app\\modules\\guide\\models\\Guide';
            default:
                return null;
        }
    }

    ngOnInit() {
        this.reference_id = +this.activatedRoute.snapshot.paramMap.get('reference_id');
        this.reference_model_alias = this.activatedRoute.snapshot.paramMap.get('reference_model_alias');
        this.reference_model = this.getReferenceModel(this.reference_model_alias);
        this.setModels();

        this.events.subscribe(this.feedbackService.dbModelApi.TAG + ':create', (model) => {
            this.setModels();
            this.detectChanges();
        });
        this.events.subscribe(this.feedbackService.dbModelApi.TAG + ':update', (model) => {
            this.setModels();
            this.detectChanges();
        });
    }
}
