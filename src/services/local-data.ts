import { AuthService } from './auth-service';
import { TranslateConfigService } from './translate-config.service';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable()
export class LocalDataService {
    constructor(private platform: Platform,
        private translateConfigService: TranslateConfigService,
        private authService: AuthService) { }


        /**
         * Pass the id of the object.
         * Function stores data to the 
         * @param id 
         */
    storeData(id: any) {

    }
}