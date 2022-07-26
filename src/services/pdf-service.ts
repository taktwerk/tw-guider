/* eslint-disable @typescript-eslint/member-ordering */

import {AlertController, Platform} from '@ionic/angular';

import {ApiSync} from '../providers/api-sync';
import {AuthService} from './auth-service';
import {DownloadService} from './download-service';
import {Injectable} from '@angular/core';
import {TranslateConfigService} from './translate-config.service';
import {environment} from '../environments/environment';

/**
 * Download file class
 */

// declare var PSPDFKit: any;

@Injectable()
export class PdfService {

    wasAddedEditEventListenner = false;
    originalFilePath: string;
    editFilePath: string;
    model: any;
    fileMapIndex;

    constructor(public platform: Platform,
                private downloadService: DownloadService,
                public alertController: AlertController,
                private translateConfigService: TranslateConfigService,
                private apiSync: ApiSync,
                private authService: AuthService) {}

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

    async initializePspdfkit(fileUrl, fileTitle, isEdit = false) {
        // if (this.platform.is('ios')) {
        //     PSPDFKit.setLicenseKey(environment.pspdfkitIosLicenseKey);
        // }
        // const config = await this.getPspdfkitConfig(isEdit);
        // config['title'] = fileTitle;

        // PSPDFKit.present(fileUrl, config);
        // if (isEdit && !this.wasAddedEditEventListenner) {
        //     PSPDFKit.addEventListener('onDocumentSaved', () => {
        //         this.showSavePopup();
        //     });
        //     this.wasAddedEditEventListenner = true;
        // }
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
            const modelFileMap = this.model.downloadMapping[this.fileMapIndex];
            this.model[modelFileMap.url] = '';
            this.model[modelFileMap.localPath] = savedFilePath;
            this.model.save().then(res => {
                if (res) {
                    this.apiSync.setIsPushAvailableData(true);
                }
            });
        });
    }

    async getPspdfkitConfig(isEdit = false) {
        // if (isEdit) {
        //     const user = await this.authService.getLastUser();

        //     return {
        //         scrollDirection: PSPDFKit.PageScrollDirection.VERTICAL,
        //         scrollMode: PSPDFKit.ScrollMode.CONTINUOUS,
        //         autosaveEnabled: true,
        //         useImmersiveMode: true,
        //         shareFeatures: [],
        //         annotationEditing: {
        //             enabled: true,
        //             creatorName: user.username
        //         }
        //     };
        // }

        // return {
        //     scrollDirection: PSPDFKit.PageScrollDirection.VERTICAL,
        //     scrollMode: PSPDFKit.ScrollMode.CONTINUOUS,
        //     disableSearch: true,
        //     disableDocumentEditor: true,
        //     disableAnnotationNoteHinting: true,
        //     useImmersiveMode: true,
        //     shareFeatures: [],
        //     annotationEditing: {
        //         enabled: false, // activate annotation editing (default: true)
        //         creatorName: null
        //     }
        // };
    }
}
