import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Events, ModalController, Platform} from '@ionic/angular';

import {ApiSync} from '../../providers/api-sync';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import {Network} from '@ionic-native/network/ngx';
import {SyncModalComponent} from '../sync-modal-component/sync-modal-component';
import {debounceTime} from 'rxjs/operators';
import {UserDb} from '../../models/db/user-db';
import {DownloadService} from '../../services/download-service';
import {DbProvider} from '../../providers/db-provider';
import {UserService} from '../../services/user-service';
import {AppSetting} from '../../services/app-setting';
import {GuiderModel} from "../../models/db/api/guider-model";
import {NavigationExtras, Router} from "@angular/router";

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'guide-list-component',
  templateUrl: 'guide-list-component.html',
    styleUrls: ['guide-list-component.scss']
})
export class GuideListComponent {
    public haveProtocolPermissions = false;
    @Input() guides: GuiderModel[];

    constructor(private platform: Platform,
                private downloadService: DownloadService,
                private db: DbProvider,
                private apiSync: ApiSync,
                private modalController: ModalController,
                private changeDetectorRef: ChangeDetectorRef,
                private http: HttpClient,
                private authService: AuthService,
                private network: Network,
                private events: Events,
                private userService: UserService,
                private router: Router,
                public appSetting: AppSetting
    ) {
        this.authService.checkAccess('guide');
        if (this.authService.auth && this.authService.auth.additionalInfo && this.authService.auth.additionalInfo.roles) {
            if (this.authService.auth.additionalInfo.roles.includes('ProtocolViewer') ||
                this.authService.auth.isAuthority
            ) {
                this.haveProtocolPermissions = true;
            }
        }
    }

    openProtocol(guide: GuiderModel) {
        const feedbackNavigationExtras: NavigationExtras = {
            queryParams: {
                templateId: guide.protocol_template_id,
                referenceModelAlias: 'guide',
                referenceId: guide.idApi,
                clientId: guide.client_id,
                backUrl: this.router.url
            }
        };
        this.router.navigate(['/guider_protocol_template/' + guide.protocol_template_id], feedbackNavigationExtras);
    }

    openGuide(guide: GuiderModel) {
        this.router.navigate(['/guide/' + guide.idApi]);
    }
}
