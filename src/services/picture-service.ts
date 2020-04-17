import {Injectable} from '@angular/core';
import {Events, Platform} from '@ionic/angular';
import {DownloadService} from './download-service';
import {AuthService} from './auth-service';
import {environment} from '../environments/environment';

/**
 * Download file class
 */

declare var PSPDFKit: any;

@Injectable()
export class PictureService {

    wasAddedEditEventListenner = false;
    fileMapIndex;

    constructor(public platform: Platform,
                private downloadService: DownloadService,
                public authService: AuthService,
                private events: Events) {}

    async openFile(fileUrl: string, fileTitle?: string) {
        this.initializePspdfkit(fileUrl, fileTitle);
    }

    async editFile(editFileUrl: string, fileTitle: string) {
        this.initializePspdfkit(editFileUrl, fileTitle, true);
    }

    async initializePspdfkit(fileUrl, fileTitle, isEdit = false) {
        if (this.platform.is('ios')) {
            PSPDFKit.setLicenseKey(environment.pspdfkitIosLicenseKey);
        }
        const config = await this.getPspdfkitConfig(isEdit);
        config['title'] = fileTitle;
        PSPDFKit.present(fileUrl, config);
        if (isEdit && !this.wasAddedEditEventListenner) {
            console.log('this.wasAddedEditEventListennerthis.wasAddedEditEventListenner');
            PSPDFKit.addEventListener('onDocumentSaved', () => {
                this.events.publish('pdfWasSaved');
            });
            this.wasAddedEditEventListenner = true;
        }
    }

    async getPspdfkitConfig(isEdit = false) {
        if (isEdit) {
            const user = await this.authService.getLastUser();

            return {
                scrollDirection: PSPDFKit.PageScrollDirection.VERTICAL,
                scrollMode: PSPDFKit.ScrollMode.CONTINUOUS,
                autosaveEnabled: true,
                useImmersiveMode: true,
                shareFeatures: [],
                annotationEditing: {
                    enabled: true,
                    creatorName: user.username
                }
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
