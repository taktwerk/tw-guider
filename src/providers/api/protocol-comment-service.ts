import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform, Events} from '@ionic/angular';
import {ApiService} from './base/api-service';
import {DbProvider} from '../db-provider';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {DownloadService} from '../../services/download-service';
import {AppSetting} from '../../services/app-setting';
import {ProtocolCommentModel} from '../../models/db/api/protocol-comment-model';

@Injectable()
export class ProtocolCommentService extends ApiService {
    data: ProtocolCommentModel[] = [];
    loadUrl: string = '/protocol-comment';
    dbModelApi: ProtocolCommentModel = new ProtocolCommentModel(this.p, this.db, this.events, this.downloadService);

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
     * @returns {ProtocolCommentModel}
     */
    public newModel() {
        return new ProtocolCommentModel(this.p, this.db, this.events, this.downloadService);
    }
}
