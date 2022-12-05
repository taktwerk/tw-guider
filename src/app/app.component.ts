import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LoggerService } from 'src/controller/services/logger.service';
import { TranslateConfigService } from 'src/controller/services/translate-config.service';
import { ConnectionService } from 'src/localServer/services/connection.service';
import { Network } from '@capacitor/network';
import { AppSettingService } from 'src/controller/services/app-setting.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  isWeb: boolean = true;
  appReady = false;

  constructor(private platform: Platform, private connection: ConnectionService,
    private translateConfigService: TranslateConfigService, private loggerService: LoggerService,
    private appSettingService: AppSettingService
  ) {
      this.initialize();
  }

  async initialize() {
    this.platform.ready().then(() => {

      this.loggerService.createLogFile();

      if (!this.platform.is('capacitor')) {
        this.isWeb == true;
      }

      this.connection.init().then(() => {
        this.appReady = true;
        this.translateConfigService.setLanguage(this.translateConfigService.getDeviceLanguage());
      });
    });

    this.initNetworkListener();
  }

  async initNetworkListener() {
    const status = await Network.getStatus();
    this.appSettingService.network.next(status);
    Network.addListener('networkStatusChange', status => {
      this.appSettingService.network.next(status);
    });
  }

  ngOnDestroy() {
    Network.removeAllListeners();
  }

}
