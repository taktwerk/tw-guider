import {Injectable} from '@angular/core';
import {StreamingMedia, StreamingVideoOptions} from '@ionic-native/streaming-media/ngx';
import {ModalController, Platform} from '@ionic/angular';
import {VideoModalComponent} from '../components/modals/video-modal-component/video-modal-component';
import {DownloadService} from './download-service';
import {PdftronModalComponent} from '../components/modals/pdftron-modal-component/pdftron-modal-component';
import {AppSetting} from './app-setting';

/**
 * Download file class
 */

declare var PSPDFKit: any;

@Injectable()
export class PictureService {
    constructor(public platform: Platform) {}

    async openFile(fileUrl: string, fileTitle?: string) {
        this.initializePspdfkit(fileUrl, fileTitle);
    }

    async editFile(fileUrl: string, fileTitle?: string) {
        this.initializePspdfkit(fileUrl, fileTitle, true);
    }

    initializePspdfkit(fileUrl, fileTitle, isEdit = false) {
        const config = this.getPspdfkitConfig(isEdit);
        config['title'] = fileTitle;

        PSPDFKit.present(fileUrl, config, () => {
            console.log('success');
        }, () => {
            console.log('failed');
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
