import { AuthService } from './auth-service';
import { TranslateConfigService } from './translate-config.service';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';

/**
 * Service has no dependants nor does it depend on any class 
 * service
 */
@Injectable()
export class MiscService {
    onSlideRestart = new Subject<boolean>();
}