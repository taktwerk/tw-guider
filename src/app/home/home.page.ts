/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectorRef, Component, NgZone, } from '@angular/core';
import { AlertController,  NavController } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import { AppSetting, AppConfigurationModeEnum } from '../library/services/app-setting';
import { AuthService } from '../library/services/auth-service';
import { MiscService } from '../library/services/misc-service';
import { UserService } from '../library/services/user-service';
import { HttpClient } from '../library/services/http-client';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public isScanning: boolean;
  public params;
  private scanSub: Subscription;
  private config;
  private appConfirmUrl;

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private qrScanner: QRScanner,
    private http: HttpClient,
    public appSetting: AppSetting,
    private userService: UserService,
    public navCtrl: NavController,
    public changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private miscService: MiscService,
  ) { }

  public async scanQrcodeDev() {
              this.config = environment.setupConfig;
              const scanErrors = this.appSetting.validateData(this.config);

              const host = this.appSetting.isEnabledUsb ? this.appSetting.usbHost : this.config.host;
              this.appConfirmUrl = host + environment.apiUrlPath + '/login/';
              if (this.config.mode === AppConfigurationModeEnum.CONFIGURE_AND_DEVICE_LOGIN && this.config.clientIdentifier) {
                await this.authService.loginByIdentifier(this.appConfirmUrl, 'client', this.config.clientIdentifier);
              } else if (this.config.mode === AppConfigurationModeEnum.CONFIGURE_AND_DEFAULT_LOGIN_BY_CLIENT && this.config.client) {
                await this.authService.loginByIdentifier(this.appConfirmUrl, 'client-default-user', this.config.client);
              } else if (this.config.mode === AppConfigurationModeEnum.CONFIGURE_AND_USER_LOGIN && this.config.userIdentifier) {
                await this.authService.loginByIdentifier(this.appConfirmUrl, 'user', this.config.userIdentifier);
              }

              // console.log('Calll -456', this.appSetting, this.config);
              this.config.isWasQrCodeSetup = true;

              const user = await this.userService.getUser();

              this.appSetting.save(this.config, user).then(() => {
                this.appSetting.isWasQrCodeSetupSubscribtion.next(true);

                  const isUserLoggedIn = !!user;
                  if (!isUserLoggedIn) {
                    this.ngZone.run(() => {
                      this.navCtrl.navigateRoot('/login');
                    });
                  } else {
                    // this.events.publish('qr-code:setup');
                    this.miscService.events.next({ TAG: 'qr-code:setup' });
                    this.ngZone.run(() => {
                      this.navCtrl.navigateRoot('/guide-categories');
                    });
                  }

                this.http.showToast('qr.Application was successfully configured');
              });
  }

  public scanQrcode() {

    if(environment.production === false) {
      return this.scanQrcodeDev();
    }

    if (this.isScanning) {
      this.closeScanner();
      return false;
    }
    this.qrScanner
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.denied) {
          return false;
        }
        if (!status.authorized) {
          return false;
        }
        this.isScanning = true;
        this.qrScanner.show().then((res) => {
          this.detectChanges();
        });

        // start scanning
        this.scanSub = this.qrScanner.scan().subscribe(async (text: string) => {
          this.config = JSON.parse(text);
          const scanErrors = this.appSetting.validateData(this.config);
          if (scanErrors.length) {
            this.http.showToast('validation.QR-code has wrong information', '', 'danger');
            this.closeScanner();
            return;
          } else {
            try {
              const user = await this.userService.getUser();
              if (user) {
                await this.authService.logout();
              }
              // console.log('Calll -123', this.appSetting, this.config);
              const host = this.appSetting.isEnabledUsb ? this.appSetting.usbHost : this.config.host;
              this.appConfirmUrl = host + environment.apiUrlPath + '/login/';
              if (this.config.mode === AppConfigurationModeEnum.CONFIGURE_AND_DEVICE_LOGIN && this.config.clientIdentifier) {
                await this.authService.loginByIdentifier(this.appConfirmUrl, 'client', this.config.clientIdentifier);
              } else if (this.config.mode === AppConfigurationModeEnum.CONFIGURE_AND_DEFAULT_LOGIN_BY_CLIENT && this.config.client) {
                await this.authService.loginByIdentifier(this.appConfirmUrl, 'client-default-user', this.config.client);
              } else if (this.config.mode === AppConfigurationModeEnum.CONFIGURE_AND_USER_LOGIN && this.config.userIdentifier) {
                await this.authService.loginByIdentifier(this.appConfirmUrl, 'user', this.config.userIdentifier);
              }

              // console.log('Calll -456', this.appSetting, this.config);
              this.config.isWasQrCodeSetup = true;
              this.appSetting.save(this.config, user).then(() => {
                this.appSetting.isWasQrCodeSetupSubscribtion.next(true);

                  const isUserLoggedIn = !!user;
                  if (!isUserLoggedIn) {
                    this.ngZone.run(() => {
                      this.navCtrl.navigateRoot('/login');
                    });
                  } else {
                    // this.events.publish('qr-code:setup');
                    this.miscService.events.next({ TAG: 'qr-code:setup' });
                    this.ngZone.run(() => {
                      this.navCtrl.navigateRoot('/guide-categories');
                    });
                  }

                this.http.showToast('qr.Application was successfully configured');
              });
              this.closeScanner();
            } catch (e) {
              console.log('This is error', e);
              this.closeScanner();
            }
          }
        });
      })
      .catch( async (err: any) => {
        // ---- iOS Simulator
        if ((<any>window).device.isVirtual) {
          this.presentAlert('Config Error', null, 'Running on Simulator', ['OK']);
          const text = '{"mode":2,"taktwerk":"guider","host":"http://tw-app-dev.devhost.taktwerk.ch"}';
          const config = JSON.parse(text);
          const appConfirmUrl = config.host + environment.apiUrlPath + '/login/';
          if (config.mode === AppConfigurationModeEnum.CONFIGURE_AND_DEVICE_LOGIN && config.clientIdentifier) {
            this.authService.loginByIdentifier(appConfirmUrl, 'client', config.clientIdentifier);
          } else if (config.mode === AppConfigurationModeEnum.CONFIGURE_AND_USER_LOGIN && config.userIdentifier) {
            this.authService.loginByIdentifier(appConfirmUrl, 'user', config.userIdentifier);
          }
          config.isWasQrCodeSetup = true;

          const user = await this.userService.getUser();

          this.appSetting.save(config, user).then(() => {
            this.appSetting.isWasQrCodeSetupSubscribtion.next(true);

              const isUserLoggedIn = !!user;
              if (!isUserLoggedIn) {
                this.ngZone.run(() => {
                  this.navCtrl.navigateRoot('/login');
                });
              } else {
                // this.events.publish('qr-code:setup');
                this.miscService.events.next({ TAG: 'qr-code:setup' });
                this.ngZone.run(() => {
                  this.navCtrl.navigateRoot('/guide-categories');
                });
              }

            this.http.showToast('qr.Application was successfully configured');
            this.closeScanner();
          });
        }
        // ----
        else {
          this.presentAlert('Config Error', null, 'There was an error using the camera. Please try again.', ['OK']);
          this.closeScanner();
        }
      });
  }

  closeScanner() {
    if (this.isScanning) {
      this.isScanning = false;
      this.qrScanner.hide().then((res) => {
        this.qrScanner.destroy();
      });
      this.scanSub.unsubscribe();
      this.detectChanges();
    }
  }

  ionViewDidLeave() {
    this.isScanning = false;
  }

  detectChanges() {
      this.changeDetectorRef.detectChanges();
  }

  async presentAlert(header: string, subHeader: string, message: string, buttons: Array<string>) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons,
    });
    await alert.present();
  }

  changeUsbMode() {
    this.appSetting.appSetting.find().then(async (result) => {
      // console.log('app setting result', result);
      if (result) {
        result.settings.isEnabledUsb = !this.appSetting.isEnabledUsb;
        await result.save();
        this.appSetting.isEnabledUsb = !this.appSetting.isEnabledUsb;
      }
    });
  }
}
