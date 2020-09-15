import {ChangeDetectorRef, Component, NgZone} from '@angular/core';
import {AlertController, Events, LoadingController, NavController} from '@ionic/angular';
import {AuthService} from '../../services/auth-service';
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner/ngx';
import {HttpClient} from '../../services/http-client';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import {AppConfigurationModeEnum, AppSetting} from '../../services/app-setting';
import {UserService} from '../../services/user-service';
import {environment} from '../../environments/environment';
import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public isScanning: boolean;
  public params;
  private scanSub: Subscription;

  constructor(
      private loadingCtrl: LoadingController,
      private authService: AuthService,
      private alertController: AlertController,
      private qrScanner: QRScanner,
      private http: HttpClient,
      private barcodeScanner: BarcodeScanner,
      public appSetting: AppSetting,
      private userService: UserService,
      public navCtrl: NavController,
      public changeDetectorRef: ChangeDetectorRef,
      private ngZone: NgZone,
      private events: Events
  ) {}

  b: any;

  public scanQrcode() {
    if (this.isScanning) {
      this.closeScanner();
      return false;
    }
    this.qrScanner.prepare()
        .then((status: QRScannerStatus) => {
          if (status.denied) {
            return false;
          }
          if (!status.authorized) {
            return false;
          }
          this.isScanning = true;
          this.qrScanner.show().then(res => {
            this.detectChanges();
          });
          // start scanning
          this.scanSub = this.qrScanner.scan().subscribe(async (text: string) => {
            const config = JSON.parse(text);
            const scanErrors = this.appSetting.validateData(config);
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
                const host = this.appSetting.isEnabledUsb ? this.appSetting.usbHost : config.host;
                const appConfirmUrl =  host + environment.apiUrlPath + '/login/';
                if (config.mode === AppConfigurationModeEnum.CONFIGURE_AND_DEVICE_LOGIN && config.clientIdentifier) {
                  await this.authService.loginByIdentifier(appConfirmUrl, 'client', config.clientIdentifier);
                } else if (config.mode === AppConfigurationModeEnum.CONFIGURE_AND_DEFAULT_LOGIN_BY_CLIENT && config.client) {
                  await this.authService.loginByIdentifier(appConfirmUrl, 'client-default-user', config.client);
                } else if (config.mode === AppConfigurationModeEnum.CONFIGURE_AND_USER_LOGIN && config.userIdentifier) {
                  await this.authService.loginByIdentifier(appConfirmUrl, 'user', config.userIdentifier);
                }

                config.isWasQrCodeSetup = true;
                this.appSetting.save(config).then(() => {
                  this.appSetting.isWasQrCodeSetupSubscribtion.next(true);
                  this.userService.getUser().then(loggedUser => {
                    const isUserLoggedIn = !!loggedUser;
                    if (!isUserLoggedIn) {
                      this.ngZone.run(() => {
                        this.navCtrl.navigateRoot('/login');
                      });
                    } else {
                      this.events.publish('qr-code:setup');
                      this.ngZone.run(() => {
                        this.navCtrl.navigateRoot('/guide-categories');
                      });
                    }
                  });

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
        .catch((err: any) => {
            // ---- iOS Simulator
            if((<any>window).device.isVirtual) {
              this.presentAlert(
                'Config Error',
                null,
                'Running on Simulator',
                ['OK']
              );
              const text = '{"mode":2,"taktwerk":"guider","host":"http:\/\/tw-app-dev.devhost.taktwerk.ch"}';
              const config = JSON.parse(text);
              const appConfirmUrl =  config.host + environment.apiUrlPath + '/login/';
              if (config.mode === AppConfigurationModeEnum.CONFIGURE_AND_DEVICE_LOGIN && config.clientIdentifier) {
                 this.authService.loginByIdentifier(appConfirmUrl, 'client', config.clientIdentifier);
              } else if (config.mode === AppConfigurationModeEnum.CONFIGURE_AND_USER_LOGIN && config.userIdentifier) {
                 this.authService.loginByIdentifier(appConfirmUrl, 'user', config.userIdentifier);
              }
              config.isWasQrCodeSetup = true;
              this.appSetting.save(config).then(() => {
                this.appSetting.isWasQrCodeSetupSubscribtion.next(true);
                this.userService.getUser().then(loggedUser => {
                  const isUserLoggedIn = !!loggedUser;
                  if (!isUserLoggedIn) {
                    this.ngZone.run(() => {
                      this.navCtrl.navigateRoot('/login');
                    });
                  } else {
                    this.events.publish('qr-code:setup');
                    this.ngZone.run(() => {
                      this.navCtrl.navigateRoot('/guide-categories');
                    });
                  }
                });

                this.http.showToast('qr.Application was successfully configured');
                this.closeScanner();
              });
            }
            // ----
            else {
              this.presentAlert(
                'Config Error',
                null,
                'There was an error using the camera. Please try again.',
                ['OK']
              );
              this.closeScanner();
            }  
        });
  }

  closeScanner() {
    if (this.isScanning) {
      this.isScanning = false;
      this.qrScanner.hide().then(res => {
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
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  async presentAlert(header: string, subHeader: string, message: string, buttons: Array<string> ) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons
    });
    await alert.present();
  }

  changeUsbMode() {
    this.appSetting.appSetting.find().then(async (result) => {
      console.log('app setting result', result);
      if (result) {
        result.settings.isEnabledUsb = !this.appSetting.isEnabledUsb;
        await result.save();
        this.appSetting.isEnabledUsb = !this.appSetting.isEnabledUsb;
      }
    });
  }
}
