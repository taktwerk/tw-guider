import {ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {AlertController, Events, ModalController, Platform} from '@ionic/angular';

import {ApiSync} from '../../providers/api-sync';
import {DownloadService} from '../../services/download-service';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {UserDb} from '../../models/db/user-db';
import {DbProvider} from '../../providers/db-provider';
import {SyncService} from '../../services/sync-service';
import {DatePipe} from '@angular/common';
import {ApiPush} from '../../providers/api-push';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'html-description-component',
  templateUrl: 'html-description-component.html',
  styleUrls: ['html-description-component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HtmlDescriptionComponent {

    @Input() html: string;

    constructor() {
    }
}
