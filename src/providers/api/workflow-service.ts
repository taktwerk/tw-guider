import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Platform } from '@ionic/angular';
import { ApiService } from './base/api-service';
import { DbProvider } from '../db-provider';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { DownloadService } from '../../services/download-service';
import { AppSetting } from '../../services/app-setting';
import { WorkflowModel } from '../../models/db/api/workflow-model';
import { LoggerService } from 'src/services/logger-service';
import { MiscService } from 'src/services/misc-service';

@Injectable()
export class WorkflowService extends ApiService {
    data: WorkflowModel[] = [];
    loadUrl: string = '/workflow';
    dbModelApi: WorkflowModel = new WorkflowModel(this.p, this.db, this.downloadService, this.loggerService, this.miscService);

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
        public downloadService: DownloadService,
        public loggerService: LoggerService,
        private miscService: MiscService,

        public appSetting: AppSetting) {
        super(http, appSetting);
    }

    /**
     * Create a new instance of the service model
     * @returns {WorkflowModel}
     */
    public newModel() {
        return new WorkflowModel(this.p, this.db, this.downloadService, this.loggerService, this.miscService);
    }
}
