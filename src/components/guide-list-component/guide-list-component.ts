import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Events, ModalController, Platform } from '@ionic/angular';

import { ApiSync } from '../../providers/api-sync';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { Network } from '@ionic-native/network/ngx';
import { SyncModalComponent } from '../sync-modal-component/sync-modal-component';
import { debounceTime } from 'rxjs/operators';
import { UserDb } from '../../models/db/user-db';
import { DownloadService } from '../../services/download-service';
import { DbProvider } from '../../providers/db-provider';
import { UserService } from '../../services/user-service';
import { AppSetting } from '../../services/app-setting';
import { GuiderModel } from '../../models/db/api/guider-model';
import { NavigationExtras, Router } from '@angular/router';
import {TranslateConfigService} from '../../services/translate-config.service';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'guide-list-component',
  templateUrl: 'guide-list-component.html',
  styleUrls: ['guide-list-component.scss'],
})
export class GuideListComponent {
  public haveProtocolPermissions = false;
  public params;
  @Input() guides: GuiderModel[];

  testGuideStepSave = false;

  constructor(
    private platform: Platform,
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
    public appSetting: AppSetting,
    private translateConfigService: TranslateConfigService
  ) {
    this.authService.checkAccess('guide');
    if (this.authService.auth && this.authService.auth.additionalInfo && this.authService.auth.additionalInfo.roles) {
      if (this.authService.auth.additionalInfo.roles.includes('ProtocolViewer') || this.authService.auth.isAuthority) {
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
        backUrl: this.router.url,
      },
    };
    this.router.navigate(['/guider_protocol_template/' + guide.protocol_template_id], feedbackNavigationExtras);
  }

  addGuideStep(guide: GuiderModel) {
    const model = this.apiSync.apiPushServices.guide_step.newModel();
    model.local_guide_id = guide[guide.COL_ID];
    model.guide_id = guide.idApi;
    model.order_number = 1;
    model.title = this.makeid(10);
    model.description_html = this.makeid(30);
    this.apiSync.apiPushServices.guide_step.save(model).then(async (res) => {
       this.apiSync.setIsPushAvailableData(true);
       const alertMessage = await this.translateConfigService.translate('alert.model_was_saved', { model: 'GuideStep' });
       this.http.showToast(alertMessage);
    });
  }

  makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

  openCollection(guide: GuiderModel) {
    const feedbackNavigationExtras: NavigationExtras = {
      queryParams: {
        guideId: guide.idApi,
      },
    };
    this.router.navigate(['/guide-collection/' + guide.idApi], feedbackNavigationExtras);
  }

  openGuide(guide: GuiderModel) {
    if (guide.guide_collection.length) {
      this.openCollection(guide);
      return;
    }
    this.router.navigate(['/guide/' + guide.idApi]);
  }
}
