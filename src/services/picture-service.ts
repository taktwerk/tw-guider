import {Injectable} from '@angular/core';
import {StreamingMedia, StreamingVideoOptions} from '@ionic-native/streaming-media/ngx';
import {AlertController, ModalController, Platform} from '@ionic/angular';
import {VideoModalComponent} from '../components/modals/video-modal-component/video-modal-component';
import {DownloadService} from './download-service';
import {PdftronModalComponent} from '../components/modals/pdftron-modal-component/pdftron-modal-component';
import {AppSetting} from './app-setting';
import {ProtocolTemplateModel} from '../models/db/api/protocol-template-model';
import {TranslateConfigService} from './translate-config.service';
import {ApiPush} from '../providers/api-push';

/**
 * Download file class
 */

declare var PSPDFKit: any;

@Injectable()
export class PictureService {

    wasAddedEditEventListenner = false;
    originalFilePath: string;
    editFilePath: string;
    model: any;
    fileMapIndex;

    constructor(public platform: Platform,
                private downloadService: DownloadService,
                public alertController: AlertController,
                private translateConfigService: TranslateConfigService,
                private apiPush: ApiPush) {}

    async openFile(fileUrl: string, fileTitle?: string) {
        this.initializePspdfkit(fileUrl, fileTitle);
    }

    async editFile(
        fullPath: string,
        fileTitle: string,
        model: any,
        fileMapIndex
    ) {
        const editFileUrl = await this.downloadService.copy(fullPath, model.TABLE_NAME, true);
        if (!editFileUrl) {
            return false;
        }
        this.model = model;
        this.fileMapIndex = fileMapIndex;
        this.originalFilePath = fullPath;
        this.editFilePath = editFileUrl;
        this.initializePspdfkit(editFileUrl, fileTitle, true);
    }

    initializePspdfkit(fileUrl, fileTitle, isEdit = false) {
        const config = this.getPspdfkitConfig(isEdit);
        config['title'] = fileTitle;

        PSPDFKit.present(fileUrl, config);
        if (isEdit && !this.wasAddedEditEventListenner) {
            PSPDFKit.addEventListener('onDocumentSaved', () => {
                this.showSavePopup();
                // return false;
            });
            this.wasAddedEditEventListenner = true;
        }
    }

    async showSavePopup() {
        const alert = await this.alertController.create({
            message: this.translateConfigService.translateWord('synchronization-component.Are you sure you want to overwrite the data?'),
            buttons: [
                {
                    text: 'Yes',
                    cssClass: 'primary',
                    handler: () => this.saveDocument()
                }, {
                    text: 'No',
                }
            ]
        });
        await alert.present();
    }

    protected saveDocument() {
        if (!this.model || !this.model.TABLE_NAME) {
            return;
        }
        this.downloadService.copy(this.editFilePath, this.model.TABLE_NAME).then((savedFilePath) => {
            console.log('savedFilePath', savedFilePath);
            const modelFileMap = this.model.downloadMapping[this.fileMapIndex];
            this.model[modelFileMap.url] = '';
            this.model[modelFileMap.localPath] = savedFilePath;
            this.model.save().then(res => {
                if (res) {
                    this.apiPush.setIsPushAvailableData(true);
                }
            });
        });
    }

    getPspdfkitConfig(isEdit = false) {
        if (isEdit) {
            return {
                scrollDirection: PSPDFKit.PageScrollDirection.VERTICAL,
                scrollMode: PSPDFKit.ScrollMode.CONTINUOUS,
                autosaveEnabled: true,
                useImmersiveMode: true,
                shareFeatures: [],
            };
        }

        return {
            scrollDirection: PSPDFKit.PageScrollDirection.VERTICAL,
            scrollMode: PSPDFKit.ScrollMode.CONTINUOUS,
            disableSearch: true,
            disableDocumentEditor: true,
            disableAnnotationNoteHinting: true,
            useImmersiveMode: true,
            shareFeatures: [],
            annotationEditing: {
                enabled: false, // activate annotation editing (default: true)
                creatorName: null
            }
        };
    }
}
