import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Events, ModalController, NavController} from '@ionic/angular';
import {FeedbackService} from '../../providers/api/feedback-service';
import {FeedbackModel} from '../../models/db/api/feedback-model';
import {AuthService} from '../../services/auth-service';
import {DownloadService} from '../../services/download-service';
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
  styleUrls: ['feedback.page.scss']
})
export class FeedbackPage implements OnInit {

    public model: FeedbackModel;
    public reference_id: number = null;
    public reference_model: string = null;
    public reference_model_alias: string = null;
    public feedbackList: FeedbackModel[] = [];
    public isComponentLikeModal = false;

    constructor(private feedbackService: FeedbackService,
                private modalController: ModalController,
                public events: Events,
                public authService: AuthService,
                public changeDetectorRef: ChangeDetectorRef,
                private downloadService: DownloadService,
                private activatedRoute: ActivatedRoute,
                private streamingMedia: StreamingMedia,
                private photoViewer: PhotoViewer,
                private navCtrl: NavController) {
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
        const feedbackSearchCondition = [['user_id', user.userId], 'deleted_at IS NULL', 'local_deleted_at IS NULL'];
        if (this.reference_id && this.reference_model) {
            feedbackSearchCondition.push(['reference_id', this.reference_id]);
        }
        this.feedbackService.dbModelApi.findAllWhere(
            feedbackSearchCondition,
            'local_created_at DESC, created_at DESC, ' + this.feedbackService.dbModelApi.COL_ID + ' DESC'
        )
            .then(data => {
                this.feedbackList = data;
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

    itemHeightFn(item, index) {
        return 79;
    }

    trackByFn(index, item) {
        return item.id;
    }

    ionViewDidLoad() {
        this.setModels();
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
