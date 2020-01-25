import {Injectable} from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class AppSetting {
    static API_URL: string = environment.apiUrl;
    static API_SYNC_URL: string = environment.apiSyncUrl;
    static DB_NAME: string = environment.dbName;
}

