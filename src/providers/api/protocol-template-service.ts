import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform, Events} from '@ionic/angular';
import {ApiService} from './base/api-service';
import {DbProvider} from '../db-provider';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {DownloadService} from '../../services/download-service';
import {AppSetting} from '../../services/app-setting';
import {ProtocolTemplateModel} from '../../models/db/api/protocol-template-model';

@Injectable()
export class ProtocolTemplateService extends ApiService {
    data: ProtocolTemplateModel[] = [];
    loadUrl: string = '/protocol_template';
    dbModelApi: ProtocolTemplateModel = new ProtocolTemplateModel(this.p, this.db, this.events, this.downloadService);

    /**
     * Constructor
     * @param http
     * @param p
     * @param db
     * @param authService
     * @param events
     * @param downloadService
     * @param appSetting
     */
    constructor(http: HttpClient,
                private p: Platform, private db: DbProvider,
                public authService: AuthService,
                public events: Events,
                public downloadService: DownloadService,
                public appSetting: AppSetting) {
        super(http, events, appSetting);
    }

    /**
     * Create a new instance of the service model
     * @returns {ProtocolTemplateModel}
     */
    public newModel() {
        return new ProtocolTemplateModel(this.p, this.db, this.events, this.downloadService);
    }
}
