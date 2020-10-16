import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {Events, LoadingController, ModalController, NavController} from '@ionic/angular';

import {AuthService} from '../../services/auth-service';
import {DownloadService} from '../../services/download-service';
import {GuiderModel} from "../../models/db/api/guider-model";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {GuideCategoryService} from "../../providers/api/guide-category-service";
import {GuideCategoryBindingService} from "../../providers/api/guide-category-binding-service";
import {GuiderService} from "../../providers/api/guider-service";
import {GuideStepService} from "../../providers/api/guide-step-service";
import {GuideAssetService} from "../../providers/api/guide-asset-service";
import {GuideAssetPivotService} from "../../providers/api/guide-asset-pivot-service";
import {File} from "@ionic-native/file/ngx";
import {PhotoViewer} from "@ionic-native/photo-viewer/ngx";
import {VideoService} from "../../services/video-service";
import {Viewer3dService} from "../../services/viewer-3d-service";
import {PictureService} from "../../services/picture-service";
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import {GuideStepModel} from "../../models/db/api/guide-step-model";

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'guide-step-content-component',
  templateUrl: 'guide-step-content-component.html',
    styleUrls: ['guide-step-content-component.scss']
})
export class GuideStepContentComponent implements OnInit, OnDestroy {
    ngOnDestroy(): void {
        console.log('destroy GuideStepContentComponent');
    }
    public faFilePdf = faFilePdf;
    @Input() step: GuideStepModel;
    @Input() portraitOriginal: boolean;
    @Input() guide: GuiderModel;
    @Input() haveFeedbackPermissions: boolean;
    @Input() haveAssets: boolean;
    @Input() guideStepsLength: number;
    @Input() stepNumber: number;

    @Output() loaded: EventEmitter<void> = new EventEmitter<void>();

    public params;

    constructor(
        private guideCategoryService: GuideCategoryService,
        private guideCategoryBindingService: GuideCategoryBindingService,
        private guiderService: GuiderService,
        private guideStepService: GuideStepService,
        private guideAssetService: GuideAssetService,
        private guideAssetPivotService: GuideAssetPivotService,
        private activatedRoute: ActivatedRoute,
        private file: File,
        private photoViewer: PhotoViewer,
        public events: Events,
        public authService: AuthService,
        public changeDetectorRef: ChangeDetectorRef,
        public modalController: ModalController,
        public downloadService: DownloadService,
        private router: Router,
        private videoService: VideoService,
        private viewer3dService: Viewer3dService,
        public navCtrl: NavController,
        private ngZone: NgZone,
        private pictureService: PictureService,
        private loader: LoadingController,
        private elementRef: ElementRef
    ) {}

    public openFile(basePath: string, fileApiUrl: string, modelName: string, title?: string) {
        const filePath = basePath;
        let fileTitle = 'Guide';
        if (title) {
            fileTitle = title;
        }
        console.log('basePath', basePath);
        const fileUrl = this.downloadService.getNativeFilePath(basePath, modelName);
        console.log('fileUrl', fileUrl);
        if (this.downloadService.checkFileTypeByExtension(filePath, 'video') ||
            this.downloadService.checkFileTypeByExtension(filePath, 'audio')
        ) {
            if (!fileApiUrl) {
                return false;
            }
            this.videoService.playVideo(fileUrl, fileTitle);
        } else if (this.downloadService.checkFileTypeByExtension(filePath, 'image')) {
            this.photoViewer.show(fileUrl, fileTitle);
        } else if (this.downloadService.checkFileTypeByExtension(filePath, 'pdf')) {
            this.pictureService.openFile(fileUrl, fileTitle);
        } else if (this.downloadService.checkFileTypeByExtension(filePath, '3d')) {
            this.viewer3dService.openPopupWithRenderedFile(fileUrl, fileTitle);
        }
    }

    openFeedback(referenceModelAlias, referenceId) {
        const feedbackNavigationExtras: NavigationExtras = {
            queryParams: {
                backUrl: this.router.url,
                referenceModelAlias: referenceModelAlias,
                referenceId: referenceId
            }
        };
        this.router.navigate(['feedback'], feedbackNavigationExtras);
    }

    ngOnInit() {
        this.loaded.emit();

        }
}
