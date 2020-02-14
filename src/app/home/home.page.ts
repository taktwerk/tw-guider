import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlertController, LoadingController, NavController, Platform} from '@ionic/angular';
import {AuthService} from '../../services/auth-service';
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner/ngx';
import {HttpClient} from '../../services/http-client';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import {AppConfigurationModeEnum, AppSetting} from '../../services/app-setting';
import {UserService} from '../../services/user-service';
import { Device } from '@ionic-native/device/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

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
  public client_id: string | number;
  public hostId: string;
  public host_id: string;
  public devMode;
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
      private device: Device,
      private appVersion: AppVersion,
      public changeDetectorRef: ChangeDetectorRef
  ) {}

  public scanQrcode() {
    if (this.isScanning) {
      this.closeScanner();
      return false;
    }
    this.qrScanner.prepare()
        .then((status: QRScannerStatus) => {
          if (status.denied) {
            // this.http.showToast('login.You are logged in.');
            // camera permission was permanently denied
            // you must use QRScanner.openSettings() method to guide the user to the settings page
            return false;
          }
          if (!status.authorized) {
            // permission was denied, but not permanently. You can ask for permission again at a later time.
            return false;
          }
          this.isScanning = true;
          this.qrScanner.show().then(res => {
            this.detectChanges();
          });

          // start scanning
          const scanSub = this.qrScanner.scan().subscribe(async (text: string) => {
            const config = JSON.parse(text);
            const isSaved = this.appSetting.save(config);
            if (!isSaved) {
              this.http.showToast('validation.QR-scanner has wrong information');
            }
            const user = this.userService.getUser();
            if (config.mode === AppConfigurationModeEnum.CONFIGURE_AND_DEVICE_LOGIN &&
                config.clientIdentifier
            ) {
              await this.loginByDevice(config.clientIdentifier, user);
            } else if (config.mode === AppConfigurationModeEnum.CONFIGURE_AND_USER_LOGIN) {
              // this.navCtrl.navigateRoot('login');
            }
            console.log('close scanner now please');
            this.closeScanner(); // hide camera preview
            // scanSub.unsubscribe(); // stop scanning;
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

  loginByDevice(clientIdentifire, currentUser) {
    return new Promise(async (resolve) => {
      const version = await this.appVersion.getVersionNumber();
      if (!version) {
        resolve(false);
        return false;
      }
      let appConfirmUrl = this.appSetting.apiUrl + '/login/by-client-identifier?client=' + clientIdentifire;
      appConfirmUrl += '&device_key=' + this.device.uuid + '&device_name=' + this.device.model + '&version=' + version;
      this.http.get(appConfirmUrl)
          .subscribe(data => {
            if (data && currentUser) {
              this.authServ.logout().then((isLogouted) => {
                if (!isLogouted) {
                  resolve(false);
                  return false;
                }
                this.authServ.saveAuthenticatedUser(data).then(() => {
                  resolve(data);
                  return true;
                });
              });
            }
          }, error => {
            console.log(error);
            // loader.dismiss();
            this.presentAlert(
                'Config Error',
                null,
                'There was an error setting up the application. Please try again.<br><br>Error: ' + error + '<br>',
                ['OK']
            );
          });
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
