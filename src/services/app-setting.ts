import {Injectable} from '@angular/core';

@Injectable()
export class AppSetting {
    static API_URL: string = 'http://tw-app-dev.devhost.taktwerk.ch/api/v1'; //'http://cstei-cqvd.localhost.run/api/v1'; // erp.devhost.taktwerk.ch
    static API_SYNC_URL: string = 'http://tw-app-dev.devhost.taktwerk.ch/api/v1/sync'; //'http://cstei-cqvd.localhost.run/api/v1/sync'; // erp.devhost.taktwerk.ch

    // static API_URL: string = 'http://twerp.loc/api/v1';
    // static API_SYNC_URL: string = 'http://twerp.loc/api/v1/sync';

    static DB_NAME: string = 'guider';
}

