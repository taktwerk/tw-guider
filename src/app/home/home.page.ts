import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController, Platform} from '@ionic/angular';
import {AuthService} from '../../services/auth-service';
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner/ngx';
import {HttpClient} from '../../services/http-client';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import {AppConfigurationModeEnum, AppSetting} from '../../services/app-setting';
import {UserService} from '../../services/user-service';
import { Device } from '@ionic-native/device/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import {environment} from '../../environments/environment';

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
  public clientId: string | number;
  public hostId: string;
  public isScanning: boolean;

  constructor(
      private loadingCtrl: LoadingController,
      private authServ: AuthService,
      private alertController: AlertController,
      private qrScanner: QRScanner,
      private http: HttpClient,
      private barcodeScanner: BarcodeScanner,
      private appSetting: AppSetting,
      private userService: UserService,
      public navCtrl: NavController,
      public changeDetectorRef: ChangeDetectorRef,
      private ngZone: NgZone
  ) {}

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
          const scanSub = this.qrScanner.scan().subscribe(async (text: string) => {
            const config = JSON.parse(text);
            if (!this.appSetting.validateData(config)) {
              this.http.showToast('validation.QR-scanner has wrong information');
            }
            const user = await this.userService.getUser();
            if (user) {
              await this.authServ.logout();
            }
            const appConfirmUrl =  config.host + environment.apiUrlPath + '/login/';
            if (config.mode === AppConfigurationModeEnum.CONFIGURE_AND_DEVICE_LOGIN && config.clientIdentifier) {
              await this.authServ.loginByIdentifier(appConfirmUrl, 'client', config.clientIdentifier);
            } else if (config.mode === AppConfigurationModeEnum.CONFIGURE_AND_USER_LOGIN && config.userIdentifier) {
              await this.authServ.loginByIdentifier(appConfirmUrl, 'user', config.userIdentifier);
            }
            this.appSetting.save(config).then(() => {
              this.userService.getUser().then(loggedUser => {
                console.log('userService.getUser()', loggedUser, !!loggedUser);
                const isUserLoggedIn = !!loggedUser;
                if (!isUserLoggedIn) {
                  this.ngZone.run(() => {
                    this.navCtrl.navigateRoot('/login');
                  });
                }
              });

              this.http.showToast('qr.Application was successfully configured');
            });
            this.closeScanner();
            scanSub.unsubscribe();
            this.detectChanges();
          });
        })
        .catch((e: any) => {
          this.presentAlert(
              'Config Error',
              null,
              'There was an error using the camera. Please try again.<br><br>Error: ' + e,
              ['OK']
          );
        });
  }

  closeScanner() {
    if (this.isScanning) {
      this.isScanning = false;
      this.qrScanner.hide().then(res => {
        this.qrScanner.destroy();
      });
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
}
