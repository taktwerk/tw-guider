import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/controller/auth/auth.service';
import { AppSettingService } from 'src/controller/services/app-setting.service';
import { AppConfigurationModeEnum } from 'src/controller/state/interface';
import { StateService } from 'src/controller/state/state.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnInit {

  isScanning: boolean = false;

  constructor(public appSettingService: AppSettingService, private stateService: StateService, private authService: AuthService) { }

  ngOnInit() { }


  // Scaning
  public scanQrcode() {

    if (environment.production === false) {
      return this.scanQrcodeDev();
    }

    if (this.isScanning) {
      this.closeScanner();
      return false;
    }

    return;
    // this.qrScanner.prepare().then((status: QRScannerStatus) => {
    //     if (status.denied) {
    //       return false;
    //     }
    //     if (!status.authorized) {
    //       return false;
    //     }
    //     this.isScanning = true;
    //     this.qrScanner.show().then((res) => {
    //       this.detectChanges();
    //     });

    //     // start scanning
    //     this.scanSub = this.qrScanner.scan().subscribe(async (text: string) => {
    //       environment.setupConfig = JSON.parse(text);
    //       const scanErrors = this.appSetting.validateData(environment.setupConfig);
    //       if (scanErrors.length) {
    //         this.http.showToast('validation.QR-code has wrong information', '', 'danger');
    //         this.closeScanner();
    //         return;
    //       } else {
    //         try {
    //           const user = await this.userService.getUser();
    //           if (user) {
    //             await this.authService.logout();
    //           }
    //           // console.log('Calll -123', this.appSetting, environment.setupConfig);
    //           const host = this.appSetting.isEnabledUsb ? this.appSetting.usbHost : environment.setupConfig.host;
    //           this.appConfirmUrl = host + environment.apiUrlPath + '/login/';
    //           if (environment.setupConfig.mode === AppConfigurationModeEnum.CONFIGURE_AND_DEVICE_LOGIN && environment.setupConfig.clientIdentifier) {
    //             await this.authService.loginByIdentifier(this.appConfirmUrl, 'client', environment.setupConfig.clientIdentifier);
    //           } else if (environment.setupConfig.mode === AppConfigurationModeEnum.CONFIGURE_AND_DEFAULT_LOGIN_BY_CLIENT && environment.setupConfig.client) {
    //             await this.authService.loginByIdentifier(this.appConfirmUrl, 'client-default-user', environment.setupConfig.client);
    //           } else if (environment.setupConfig.mode === AppConfigurationModeEnum.CONFIGURE_AND_USER_LOGIN && environment.setupConfig.userIdentifier) {
    //             await this.authService.loginByIdentifier(this.appConfirmUrl, 'user', environment.setupConfig.userIdentifier);
    //           }

    //           // console.log('Calll -456', this.appSetting, environment.setupConfig);
    //           environment.setupConfig.isWasQrCodeSetup = true;
    //           this.appSetting.save(environment.setupConfig, user).then(() => {
    //             this.appSetting.isWasQrCodeSetupSubscribtion.next(true);

    //               const isUserLoggedIn = !!user;
    //               if (!isUserLoggedIn) {
    //                 this.ngZone.run(() => {
    //                   this.navCtrl.navigateRoot('/login');
    //                 });
    //               } else {
    //                 // this.events.publish('qr-code:setup');
    //                 this.miscService.events.next({ TAG: 'qr-code:setup' });
    //                 this.ngZone.run(() => {
    //                   this.navCtrl.navigateRoot('/guide-categories');
    //                 });
    //               }

    //             this.http.showToast('qr.Application was successfully configured');
    //           });
    //           this.closeScanner();
    //         } catch (e) {
    //           console.log('This is error', e);
    //           this.closeScanner();
    //         }
    //       }
    //     });
    //     return;
    //   })
    //   .catch( async (err: any) => {
    //     // ---- iOS Simulator
    //     if ((<any>window).device.isVirtual) {
    //       this.presentAlert('Config Error', '', 'Running on Simulator', ['OK']);
    //       const text = '{"mode":2,"taktwerk":"guider","host":"http://tw-app-dev.devhost.taktwerk.ch"}';
    //       const config = JSON.parse(text);
    //       const appConfirmUrl = config.host + environment.apiUrlPath + '/login/';
    //       if (config.mode === AppConfigurationModeEnum.CONFIGURE_AND_DEVICE_LOGIN && config.clientIdentifier) {
    //         this.authService.loginByIdentifier(appConfirmUrl, 'client', config.clientIdentifier);
    //       } else if (config.mode === AppConfigurationModeEnum.CONFIGURE_AND_USER_LOGIN && config.userIdentifier) {
    //         this.authService.loginByIdentifier(appConfirmUrl, 'user', config.userIdentifier);
    //       }
    //       config.isWasQrCodeSetup = true;

    //       const user = await this.userService.getUser();

    //       this.appSetting.save(config, user).then(() => {
    //         this.appSetting.isWasQrCodeSetupSubscribtion.next(true);

    //           const isUserLoggedIn = !!user;
    //           if (!isUserLoggedIn) {
    //             this.ngZone.run(() => {
    //               this.navCtrl.navigateRoot('/login');
    //             });
    //           } else {
    //             // this.events.publish('qr-code:setup');
    //             this.miscService.events.next({ TAG: 'qr-code:setup' });
    //             this.ngZone.run(() => {
    //               this.navCtrl.navigateRoot('/guide-categories');
    //             });
    //           }

    //         this.http.showToast('qr.Application was successfully configured');
    //         this.closeScanner();
    //       });
    //     }
    //     // ----
    //     else {
    //       this.presentAlert('Config Error', '', 'There was an error using the camera. Please try again.', ['OK']);
    //       this.closeScanner();
    //     }
    //   });
  }

  closeScanner() {
    // if (this.isScanning) {
    //   this.isScanning = false;
    //   this.qrScanner.hide().then((res) => {
    //     this.qrScanner.destroy();
    //   });
    //   this.scanSub.unsubscribe();
    //   this.detectChanges();
    // }
  }

  public async scanQrcodeDev() {

    const host = this.stateService.isEnabledUsb ? this.stateService.usbHost : environment.setupConfig.host;
    const appConfirmUrl = host + environment.apiUrlPath + '/login/';
    let type = 'user';
    let identifier = environment.setupConfig.userIdentifier;

    if (environment.setupConfig.mode === AppConfigurationModeEnum.CONFIGURE_AND_DEVICE_LOGIN && environment.setupConfig.clientIdentifier) {
      type = 'client';
      identifier = environment.setupConfig.clientIdentifier;
    } else if (environment.setupConfig.mode === AppConfigurationModeEnum.CONFIGURE_AND_DEFAULT_LOGIN_BY_CLIENT && environment.setupConfig.client) {
      type = 'client-default-user';
      identifier = environment.setupConfig.client;
    } else if (environment.setupConfig.mode === AppConfigurationModeEnum.CONFIGURE_AND_USER_LOGIN && environment.setupConfig.userIdentifier) {
      type = 'user';
      identifier = environment.setupConfig.userIdentifier;
    }

    this.authService.loginByIdentifier(appConfirmUrl, type, identifier);
  }
}
