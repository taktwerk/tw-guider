import { LoggerService } from './../../services/logger-service';
import { Injectable } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { ApiService } from './base/api-service';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { DownloadService } from '../../services/download-service';
import { AppSetting } from '../../services/app-setting';
import { DrawImageService } from '../../services/draw-image-service';
import { ProtocolTemplateService } from './protocol-template-service';
import { TranslateConfigService } from '../../services/translate-config.service';
const Md5 = require('ts-md5/dist/md5');
import { MiscService } from '../../services/misc-service';
import { ProtocolDefaultModel } from 'app/database/models/db/api/protocol-default-model';
import { ProtocolModel } from 'app/database/models/db/api/protocol-model';
import { ProtocolTemplateModel } from 'app/database/models/db/api/protocol-template-model';

@Injectable()
export class ProtocolDefaultService extends ApiService {
    override data: ProtocolDefaultModel[] = [];
    loadUrl: string = '/protocol-default';
    dbModelApi: ProtocolDefaultModel = new ProtocolDefaultModel();
    saveInformation: {
      clientId: number;
      protocol: ProtocolModel | any;
      protocolFormModel: any;
      protocolTemplate: ProtocolTemplateModel;
      referenceModel: string;
      referenceId: number;
      protocol_file?: any;
      fileMapIndex: any;
    } | undefined;

    /**
     * Constructor
     * @param http
     * @param platform
     * @param db
     * @param alertController
     * @param translateConfigService
     * @param authService
     * @param events
     * @param downloadService
     * @param appSetting
     * @param pictureService
     * @param protocolTemplateService
     */
    constructor(http: HttpClient,

        public alertController: AlertController,
        private translateConfigService: TranslateConfigService,
        public authService: AuthService,

        public downloadService: DownloadService,
        public loggerService: LoggerService,
        public override appSetting: AppSetting,
        private drawImageService: DrawImageService,
        private protocolTemplateService: ProtocolTemplateService,
        public miscService: MiscService,
    ) {
        super(http, appSetting);
    }

    async saveProtocol(saveInformation: any) {
        let protocol:any = null;
        if (!saveInformation.protocol) {
            const protocolTemplate = saveInformation.protocolTemplate;
            const templateWorkflow = await protocolTemplate.getWorkflow();
            if (!templateWorkflow) {
                return;
            }
            const workflowFirstStep = await templateWorkflow.getFirstStep();
            if (!workflowFirstStep) {
                return;
            }
            protocol = new ProtocolModel();
            const md5 = new Md5();
            const protocolName = ('' + md5.appendStr('' + (new Date()).getTime()).end()).substr(0, 5).toUpperCase();
            protocol.client_id = saveInformation.clientId;
            protocol.protocol_template_id = protocolTemplate.idApi;
            protocol.workflow_step_id = workflowFirstStep.idApi;
            protocol.protocol_form_number = 0;
            protocol.protocol_form_table = this.dbModelApi.TABLE_NAME;
            protocol.reference_model = saveInformation.referenceModel;
            protocol.reference_id = saveInformation.referenceId;
            protocol.name = protocolName;
            await protocol.save();
        } else {
            protocol = saveInformation.protocol;
        }
        const protocolDefault = this.newModel();
        this.downloadService.copy(saveInformation.protocol_file, protocolDefault.TABLE_NAME).then(async (savedFilePath) => {
            const modelFileMap = protocolDefault.downloadMapping[saveInformation.fileMapIndex];
            (protocolDefault as any) [modelFileMap.url] = '';
            (protocolDefault as any)[modelFileMap.localPath] = savedFilePath;
            (protocolDefault as any)[modelFileMap.name] = savedFilePath.substring(savedFilePath.lastIndexOf('/') + 1, savedFilePath.length);
            if (protocol[protocol.COL_ID_API]) {
                protocolDefault.protocol_id = protocol[protocol.COL_ID_API];
            }
            protocolDefault.local_protocol_id = protocol[protocol.COL_ID];
            const isSaved = await protocolDefault.save();
            if (isSaved) {
                if (!(protocolDefault as any)[protocol.COL_ID_API]) {
                    protocol.local_protocol_form_number = (protocolDefault as any)[protocol.COL_ID];
                }
                await protocol.save();
                // this.events.publish('setIsPushAvailableData');
                this.miscService.events.next({ TAG: 'setIsPushAvailableData' });
            }
        });
    }

    async showSavePopup(saveInformation: any) {
        const alert = await this.alertController.create({
            message: this.translateConfigService.translateWord('synchronization-component.Are you sure you want to overwrite the data?'),
            buttons: [
                {
                    text: 'Yes',
                    cssClass: 'primary',
                    handler: () => this.saveProtocol(saveInformation)
                }, {
                    text: 'No',
                }
            ]
        });
        await alert.present();
    }

    public getProtocolTemplate(templateId: number): Promise<ProtocolTemplateModel | null> {
        return new Promise((resolve) => {
            this.protocolTemplateService.dbModelApi.findFirst(
                [this.protocolTemplateService.dbModelApi.COL_ID_API, templateId]
            ).then((res) => {
                if (res && res[0]) {
                    resolve(res[0]);
                } else {
                    resolve(null);
                }
            });
        });
    }

    public async openEditPage(protocolDefault: any, protocol: ProtocolModel) {
        console.log('protocolDefault[ProtocolDefaultModel.COL_PROTOCOL_FILE]', protocolDefault.local_pdf_image);
        const protocolTemplate: any = await this.getProtocolTemplate(protocol.protocol_template_id);
        if (!protocolDefault.local_pdf_image) {
            return;
        }
        this.saveInformation = {
            clientId: protocol.client_id,
            protocol,
            protocolFormModel: protocolDefault,
            protocolTemplate,
            referenceModel: protocol.reference_model,
            referenceId: protocol.reference_id,
            fileMapIndex: 1
        };
        const originalFilePath = protocolDefault.local_pdf_image;
        const editFilePath = await this.getEditFilePath(originalFilePath);
        if (!editFilePath) {
            return false;
        }
        const convertFileSrc = this.downloadService.getWebviewFileSrc(editFilePath);
        const editFilePathNew = this.downloadService.getSafeUrl(convertFileSrc, 'trustStyle');
        var n = editFilePath.lastIndexOf('/');
        var saveFileName = editFilePath.substring(n + 1);
        this.drawImageService.open(editFilePathNew, protocolTemplate.name, this.dbModelApi.TABLE_NAME, saveFileName);

        this.saveInformation.protocol_file = editFilePath;
        return;
    }

    public async openCreatePage(templateId: number, clientId?:any, referenceModel?: any, referenceId?: any) {

        const protocolTemplate = await this.getProtocolTemplate(templateId);
        // const editFilePath = 'http://localhost/_app_file_/data/user/0/com.taktwerk.twguider2/files/guide_step/1592303527_7B5B4B0E-B92B-497C-8305-5CD629D6A223.jpeg';

        if (!protocolTemplate || !(protocolTemplate as any)[ProtocolTemplateModel.COL_LOCAL_PDF_IMAGE]) {
            return;
        }
        this.saveInformation = { clientId, protocol: null, protocolFormModel: null, protocolTemplate, referenceModel, referenceId, fileMapIndex: 1 };
        // const editFilePath = '';
        // this.drawImageService.open(editFilePath, protocolTemplate.name);
        // this.pictureService.editFile(editFilePath, protocolTemplate.name);
        this.downloadService.copy(
            (protocolTemplate as any)[ProtocolTemplateModel.COL_LOCAL_PDF_IMAGE],
            this.dbModelApi.TABLE_NAME
        ).then(async (savedFilePath) => {
            const editFilePath = await this.getEditFilePath(savedFilePath);
            if (!editFilePath) {
                return false;
            }
            (this.saveInformation as any).protocol_file = editFilePath;
            console.log("openCreatePage");
            const convertFileSrc = this.downloadService.getWebviewFileSrc(editFilePath);
            const editFilePathNew = this.downloadService.getSafeUrl(convertFileSrc, 'trustStyle');
            var n = editFilePath.lastIndexOf('/');
            var saveFileName = editFilePath.substring(n + 1);
            this.drawImageService.open(editFilePathNew, protocolTemplate.name, this.dbModelApi.TABLE_NAME, saveFileName);
            // this.pictureService.editFile(editFilePath, protocolTemplate.name);
            return;
        });
    }

    async getEditFilePath(fullPath: string) {
        return await this.downloadService.copy(fullPath, this.dbModelApi.TABLE_NAME, true);
    }

    /**
     * Create a new instance of the service model
     * @returns {ProtocolDefaultModel}
     */
    public override newModel() {
        return new ProtocolDefaultModel();
    }
}
