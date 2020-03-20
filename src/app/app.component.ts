import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';

import {Events, NavController, Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {ApiSync} from '../providers/api-sync';
import {AuthService} from '../services/auth-service';
import {AuthDb} from '../models/db/auth-db';
import {Network} from '@ionic-native/network/ngx';
import {HttpClient} from '../services/http-client';
import {SyncService} from '../services/sync-service';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/interval';
import {UserDb} from '../models/db/user-db';
import {DbProvider} from '../providers/db-provider';
import {DownloadService} from '../services/download-service';
import {ApiPush} from '../providers/api-push';
import {TranslateConfigService} from '../services/translate-config.service';
import {AppSetting} from '../services/app-setting';
import {UserService} from '../services/user-service';
import { AppVersion } from '@ionic-native/app-version/ngx';

export enum ConnectionStatusEnum {
  Online,
  Offline,
  BeforeSet
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public appPages = [];
  public versionNumber = '0.0.1';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private events: Events,
    private apiSync: ApiSync,
    private authService: AuthService,
    private network: Network,
    private http: HttpClient,
    private syncService: SyncService,
    private downloadService: DownloadService,
    private db: DbProvider,
    private apiPush: ApiPush,
    private translateConfigService: TranslateConfigService,
    private changeDetectorRef: ChangeDetectorRef,
    private appSetting: AppSetting,
    private userService: UserService,
    private appVersion: AppVersion,
    public navCtrl: NavController,
    private ngZone: NgZone
  ) {
    this.initializeApp();
  }

  public userDb: UserDb;

  previousStatus = ConnectionStatusEnum.BeforeSet;
  periodicSync: any;
  checkAvailableSyncChanges: any;

  //// TODO in future save device info via API in this place
  initializeApp() {
    this.platform.ready().then(() => {
      this.translateConfigService.setLanguage();
      this.login().then(async (result) => {
        let currentLanguage = '';
        if (result) {
          try {
            await this.initUserDB();
            if (!this.userDb) {
              return;
            }
            if (this.userDb.userSetting.language) {
              currentLanguage = this.userDb.userSetting.language;
            }
            this.syncService.syncMode.next(this.userDb.userSetting.syncMode);
            if (this.userDb.userSetting.syncLastElementNumber > 0 &&
                (this.userDb.userSetting.syncStatus === 'resume' || this.userDb.userSetting.syncStatus === 'progress')
            ) {
              this.userDb.userSetting.syncStatus = 'pause';
              this.userDb.save().then(() => {
                this.apiSync.sendSyncProgress();
              });
            }
            this.apiSync.syncProgressStatus.next(this.userDb.userSetting.syncStatus);
          } catch (e) {
          }
        }
        this.translateConfigService.setLanguage(currentLanguage);
        this.setPages();
        this.initNetwork();
        this.registerEvents();
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });
    });
  }

  protected initUserDB() {
    return this.userService.getUser().then(result => {
      this.userDb = result;
    });
  }

  protected registerEvents() {
    this.events.subscribe('user:login', (userId) => {
      this.setPages();
      this.baseProjectSetup();
      this.detectChanges();
    });
    this.events.subscribe('qr-code:setup', () => {
      this.setPages();
      this.baseProjectSetup();
      this.detectChanges();
    });
    this.events.subscribe('user:logout', () => {
      this.setPages();
    });
  }

  protected initNetwork() {
    if (this.network.type === 'none') {
      this.previousStatus = ConnectionStatusEnum.Offline;
    } else {
      this.previousStatus = ConnectionStatusEnum.Online;
    }

    this.initializeNetworkEvents();
  }

  protected initializeNetworkEvents(): void {
    this.network.onDisconnect().subscribe(() => {
      if (this.previousStatus === ConnectionStatusEnum.Online) {
        this.events.publish('network:offline', true);
        this.previousStatus = ConnectionStatusEnum.Offline;
      }
    });
    this.network.onConnect().subscribe(() => {
      if (this.previousStatus === ConnectionStatusEnum.Offline) {
        this.events.publish('network:online', true);
        this.previousStatus = ConnectionStatusEnum.Online;
        if (this.authService.isLoggedin) {
          this.apiPush.pushOneAtTime();
          if (this.syncService.syncMode.getValue() === 1) {
            let syncProcessName = this.apiSync.syncProgressStatus.getValue();
            if (syncProcessName === 'pause') {
              syncProcessName = 'resume';
            }
            this.apiSync.makeSyncProcess(syncProcessName);
          }
        }
      }
    });
  }

  protected async setPages() {
    this.appPages = this.getTopMenuPages();
  }

  protected getTopMenuPages() {
    const appPages = [];
    if (!this.appSetting.isWasQrCodeSetup || !this.authService.isLoggedin) {
      appPages.push({title: this.translateConfigService.translateWord('start.header'), url: '/start', icon: 'home'});
    }
    if (!this.appSetting.isWasQrCodeSetup) {
      return appPages;
    }
    if (!this.authService.isLoggedin) {
      appPages.push({title: this.translateConfigService.translateWord('login.Login'), url: '/login', icon: 'list'});
      return appPages;
    }
    appPages.push(
        {title: this.translateConfigService.translateWord('guides.header'), url: '/guides', icon: 'list'},
        {title: this.translateConfigService.translateWord('profile.Profile'), url: '/profile', icon: 'person'},
        {title: this.translateConfigService.translateWord('feedback.header'), url: '/feedback', icon: 'paper'}
    );

    return appPages;
  }

  private login(): Promise<any> {
    return new Promise((resolve) => {
      this.authService.getLastUser().then((res) => {
        resolve(res);
        let lastUser: AuthDb = null;
        if (res) {
          lastUser = res;
        }
      });
    });
  }

  protected baseProjectSetup() {
    this.initUserDB().then(() => {
      if (!this.userDb) {
        return;
      }
      if (this.userDb.userSetting.language &&
          this.translateConfigService.isLanguageAvailable(this.userDb.userSetting.language)
      ) {
        this.translateConfigService.setLanguage(this.userDb.userSetting.language);
      }
      if (this.userDb.userSetting.syncLastElementNumber > 0 &&
          (this.userDb.userSetting.syncStatus === 'resume' || this.userDb.userSetting.syncStatus === 'progress')
      ) {
        this.userDb.userSetting.syncStatus = 'pause';
        this.userDb.save();
      }
      this.syncService.syncMode.next(this.userDb.userSetting.syncMode);
      this.apiSync.syncProgressStatus.next(this.userDb.userSetting.syncStatus);
      this.apiSync.syncedItemsCount.next(this.userDb.userSetting.syncLastElementNumber);
      this.apiSync.syncAllItemsCount.next(this.userDb.userSetting.syncAllItemsCount);
      this.apiSync.syncedItemsPercent.next(this.userDb.userSetting.syncPercent);
      this.apiSync.isAvailableForSyncData.next(this.userDb.userSetting.isSyncAvailableData);
      this.apiPush.isAvailableForPushData.next(this.userDb.userSetting.isPushAvailableData);
      this.apiSync.checkAvailableChanges().then(() => {
        this.checkAvailableSyncChanges = Observable.interval(30000)
            .subscribe(() => {
              this.apiSync.checkAvailableChanges();
            });
      });
      this.detectChanges();
    });
  }

  protected logoutAction() {
    this.userDb = null;
    this.translateConfigService.setLanguage();
    if (this.periodicSync) {
      this.periodicSync.unsubscribe();
      this.periodicSync = null;
    }
    if (this.checkAvailableSyncChanges) {
      this.checkAvailableSyncChanges.unsubscribe();
      this.periodicSync = null;
    }
  }

  protected changeSyncModeAction(syncMode) {
    if (syncMode !== 2 && this.periodicSync) {
      this.periodicSync.unsubscribe();
      this.periodicSync = null;
    }
    if (syncMode === 2) {
      this.periodicSync = Observable.interval(15000)
          .subscribe(() => {
            let syncProcessStatus = this.apiSync.syncProgressStatus.getValue();
            if (['pause'].includes(syncProcessStatus)) {
              syncProcessStatus = 'resume';
            } else {
              syncProcessStatus = 'progress';
            }
            this.apiSync.makeSyncProcess(syncProcessStatus);
          });
    }
  }

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnInit(): void {
    this.userService.getUser().then(user => {
      if (user) {
        this.ngZone.run(() => {
          this.navCtrl.navigateRoot('/guides');
        });
      } else {
        if (this.appSetting.isWasQrCodeSetup) {
          this.ngZone.run(() => {
            this.navCtrl.navigateRoot('/login');
          });
        }
      }
    });
    this.appSetting.isWasQrCodeSetupSubscribtion.subscribe(isWasQrCodeSetup => {
      console.log('isWasQrCodeSetup', isWasQrCodeSetup);
      if (isWasQrCodeSetup) {
        this.setPages();
      }
    });
    this.platform.ready().then(() => {
      if (this.appVersion) {
        this.appVersion.getVersionNumber().then((versionNumber) => {
          this.versionNumber = versionNumber;
        });
      }
    });
    this.baseProjectSetup();
    this.events.subscribe('user:logout', () => {
      this.logoutAction();
    });
    this.syncService.syncMode.subscribe((syncMode) => {
        this.changeSyncModeAction(syncMode);
    });
    this.translateConfigService.onLangChange().subscribe(() => {
      this.setPages();
    });
  }
}
