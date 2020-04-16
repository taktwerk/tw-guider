import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform, Events, AlertController} from '@ionic/angular';
import {ApiService} from './base/api-service';
import {DbProvider} from '../db-provider';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {DownloadService} from '../../services/download-service';
import {AppSetting} from '../../services/app-setting';
import {ProtocolDefaultModel} from '../../models/db/api/protocol-default-model';
import {ProtocolModel} from '../../models/db/api/protocol-model';
import {PictureService} from '../../services/picture-service';
import {ProtocolTemplateService} from './protocol-template-service';
import {ProtocolTemplateModel} from '../../models/db/api/protocol-template-model';
import {TranslateConfigService} from '../../services/translate-config.service';
import {Md5} from 'ts-md5/dist/md5';

@Injectable()
export class ProtocolDefaultService extends ApiService {
    data: ProtocolDefaultModel[] = [];
    loadUrl: string = '/protocol-default';
    dbModelApi: ProtocolDefaultModel = new ProtocolDefaultModel(this.platform, this.db, this.events, this.downloadService);
    saveInformation: {
        clientId: number,
        protocol: ProtocolModel,
        protocolFormModel: any,
        protocolTemplate: ProtocolTemplateModel,
        referenceModel: string,
        referenceId: number,
        protocol_file?,
        fileMapIndex
    };

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
                private platform: Platform,
                private db: DbProvider,
                public alertController: AlertController,
                private translateConfigService: TranslateConfigService,
                public authService: AuthService,
                public events: Events,
                public downloadService: DownloadService,
                public appSetting: AppSetting,
                private pictureService: PictureService,
                private protocolTemplateService: ProtocolTemplateService) {
        super(http, events, appSetting);
        this.events.subscribe('pdfWasSaved', (saveInformation) => {
            console.log('pdfWasSaved');
            this.showSavePopup(this.saveInformation);
        });
    }

    async saveProtocol(saveInformation) {
        let protocol = null;
        console.log('saveInformation', saveInformation);
        if (!saveInformation.protocol) {
            const protocolTemplate = saveInformation.protocolTemplate;
            const templateWorkflow = await protocolTemplate.getWorkflow();
            console.log('templateWorkflow', templateWorkflow);
            if (!templateWorkflow) {
                return;
            }
            const workflowFirstStep = await templateWorkflow.getFirstStep();
            console.log('workflowFirstStep', workflowFirstStep);
            if (!workflowFirstStep) {
                return;
            }
            protocol = new ProtocolModel(this.platform, this.db, this.events, this.downloadService);
            const md5 = new Md5();
            const protocolName = ('' + md5.appendStr('' + (new Date()).getTime()).end()).substr(0, 5).toUpperCase();
            console.log('protocolName', protocolName)
            protocol.client_id = saveInformation.clientId;
            protocol.protocol_template_id = protocolTemplate.idApi;
            protocol.workflow_step_id = workflowFirstStep.idApi;
            protocol.protocol_form_number = 0;
            protocol.protocol_form_table = this.dbModelApi.TABLE_NAME;
            protocol.reference_model = saveInformation.referenceModel;
            protocol.reference_id = saveInformation.referenceId;
            protocol.name = protocolName;
            console.log('lkfsdgjg;lkjgljksdl;gkjdsgk;ljdk;lgj');
            await protocol.save();
            console.log('protocolprotocolprotocolprotocolprotocol', protocol);
        } else {
            protocol = saveInformation.protocol;
        }
        const protocolDefault = this.newModel();
        this.downloadService.copy(saveInformation.protocol_file, protocolDefault.TABLE_NAME).then(async (savedFilePath) => {
            console.log('copy filesssss');
            const modelFileMap = protocolDefault.downloadMapping[saveInformation.fileMapIndex];
            protocolDefault[modelFileMap.url] = '';
            protocolDefault[modelFileMap.localPath] = savedFilePath;
            protocolDefault[modelFileMap.name] = savedFilePath.substring(savedFilePath.lastIndexOf('/') + 1, savedFilePath.length);
            if (protocol[protocol.COL_ID_API]) {
                protocolDefault.protocol_id = protocol[protocol.COL_ID_API];
            }
            protocolDefault.local_protocol_id = protocol[protocol.COL_ID];
            const isSaved = await protocolDefault.save();
            if (isSaved) {
                if (!protocolDefault[protocol.COL_ID_API]) {
                    protocol.local_protocol_form_number = protocolDefault[protocol.COL_ID];
                }
                await protocol.save();
                this.events.publish('setIsPushAvailableData');
            }
        });
    }

    async showSavePopup(saveInformation) {
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

    public getProtocolTemplate(templateId: number): Promise<ProtocolTemplateModel> {
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

    public async openEditPage(protocolDefault, protocol: ProtocolModel) {
        console.log('protocolDefault[ProtocolDefaultModel.COL_PROTOCOL_FILE]', protocolDefault[ProtocolDefaultModel.COL_PROTOCOL_FILE]);
        const protocolTemplate = await this.getProtocolTemplate(protocol.protocol_template_id);
        if (!protocolDefault[ProtocolDefaultModel.COL_PROTOCOL_FILE]) {
            return;
        }
        this.saveInformation = {
            clientId: protocol.client_id,
            protocol,
            protocolFormModel: protocolDefault,
            protocolTemplate,
            referenceModel: protocol.reference_model,
            referenceId: protocol.reference_id,
            fileMapIndex: 0
        };
        const editFilePath = await this.getEditFilePath(protocolDefault[ProtocolDefaultModel.COL_LOCAL_PROTOCOL_FILE]);
        if (!editFilePath) {
            return false;
        }
        this.saveInformation.protocol_file = editFilePath;
        this.pictureService.editFile(editFilePath, protocol.name);
    }

    public async openCreatePage(templateId: number, clientId?, referenceModel?, referenceId?) {
        const protocolTemplate = await this.getProtocolTemplate(templateId);
        if (!protocolTemplate || !protocolTemplate[ProtocolTemplateModel.COL_PROTOCOL_FILE]) {
            return;
        }
        this.saveInformation = {clientId, protocol: null, protocolFormModel: null, protocolTemplate, referenceModel, referenceId, fileMapIndex: 0};
        this.downloadService.copy(
            protocolTemplate[ProtocolTemplateModel.COL_LOCAL_PROTOCOL_FILE],
            this.dbModelApi.TABLE_NAME
        ).then(async (savedFilePath) => {
            const editFilePath = await this.getEditFilePath(savedFilePath);
            if (!editFilePath) {
                return false;
            }
            this.saveInformation.protocol_file = editFilePath;
            this.pictureService.editFile(editFilePath, protocolTemplate.name);
        });
    }

    async getEditFilePath(fullPath: string) {
        return await this.downloadService.copy(fullPath, this.dbModelApi.TABLE_NAME, true);
    }

    /**
     * Create a new instance of the service model
     * @returns {ProtocolDefaultModel}
     */
    public newModel() {
        return new ProtocolDefaultModel(this.platform, this.db, this.events, this.downloadService);
    }
}
