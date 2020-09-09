import {Component, NgZone, OnInit} from '@angular/core';
import {LoadingController, AlertController, NavController} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Storage } from '@ionic/storage';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

export enum LoginMode {
    Client,
    User = 2
}

@Component({
  selector: 'app-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})

export class SetupPage {
  private browser;
  public clientId: string | number;
  public userIdentifier: string;
  public client_id: string | number;
  public hostId: string;
  public host_id: string;
  public devMode;
  public isScanning: boolean;
  public loginMode: number;

  constructor(
      private loadingCtrl: LoadingController,
      private authServ: AuthService,
      private alertController: AlertController,
      public storage: Storage,
      private qrScanner: QRScanner,
      private navCtrl: NavController,
      private ngZone: NgZone
  ) { }

    async presentAlert(header: string, subHeader: string, message: string, buttons: Array<string> ) {
        const alert = await this.alertController.create({
            header,
            subHeader,
            message,
            buttons
        });
        await alert.present();
    }

    /**
     * Save the form into storage
     */
    public async save() {
        this.clientId = this.client_id ? this.client_id : this.clientId;
        this.hostId = this.host_id ? this.host_id : this.hostId;

        console.log('saving', this.clientId, this.hostId, this);
        if (this.clientId || this.userIdentifier) {
            const loader = await this.loadingCtrl.create({
                message: 'Configurating...',
                showBackdrop: false
            });
            await loader.present();

            // Build the In App Browser url

            if (!this.hostId) {
                if (this.devMode) {
                    this.hostId = 'http://tw-app-dev.devhost.taktwerk.ch';
                } else {
                    this.hostId = 'https://app.taktwerk.ch';
                }
            }
            let appUrl = this.hostId + '/de/webview-login';
            let appConfirmUrl = this.hostId + '/de/webview-login/confirm';

            if (/*this.loginMode && this.loginMode === LoginMode.User && */this.userIdentifier) {
                appUrl += '?userIdentifier=' + this.userIdentifier;
                appConfirmUrl += '?userIdentifier=' + this.userIdentifier;
            } else {
                if (this.clientId) {
                    appUrl += '?client=' + this.clientId;
                    appConfirmUrl += '?client=' + this.clientId;
                }
            }

            console.log('appConfirmUrl', appConfirmUrl);
            this.authServ.login(appConfirmUrl)
                .then(data => {
                    console.log('should be login', data);
                    this.storage.set('url', appUrl);
                    loader.dismiss();
                    // Close the current page
                    this.ngZone.run(() => {
                        this.navCtrl.pop();
                    });

                })
                .catch(error => {
                    console.log(error);
                    loader.dismiss();
                    console.log('errrrror', error);
                    this.presentAlert('Config Error', null, 'There was an error setting up the application. Please try again.<br><br>Error: ' + error + '<br><br>Url: ' + appUrl, ['OK']);
                });

        }
    }

    ionViewWillLeave() {
        if (this.browser) {
            this.browser.close();
        }
    }

    public scanQrcode() {
        if (this.isScanning) {
            this.stopSearch();
            return false;
        }

        // Optionally request the permission early
        this.qrScanner.prepare()
            .then((status: QRScannerStatus) => {
                console.log('Scan status', status);
                if (status.authorized) {
                    // camera permission was granted
                    this.isScanning = true;
                    this.qrScanner.show().then(res => {});


                    // start scanning
                    const scanSub = this.qrScanner.scan().subscribe((text: string) => {
                        console.log('Scanned something', text);
                        this.isScanning = false;

                        console.log('raw', text);
                        const config = JSON.parse(text);
                        console.log('json', config);
                        if (config.taktwerk && config.taktwerk === 'guider') {
                            /*if (config.mode && config.mode === LoginMode.User) {
                                this.loginMode = config.mode;*/
                                if (config.userIdentifier) {
                                    this.userIdentifier = config.userIdentifier;
                                // }
                            } else {
                                if (config.client) {
                                    this.clientId = config.client;
                                }
                            }
                            if (config.dev) {
                                this.devMode = true;
                            }
                            if (config.host) {
                                this.hostId = config.host;
                            }
                            this.save();
                        }

                        this.stopSearch(); // hide camera preview
                        scanSub.unsubscribe(); // stop scanning
                    });

                } else if (status.denied) {
                    // camera permission was permanently denied
                    // you must use QRScanner.openSettings() method to guide the user to the settings page
                    // then they can grant the permission from there
                } else {
                    // permission was denied, but not permanently. You can ask for permission again at a later time.
                }
            })
            .catch((e: any) => this.presentAlert('Config Error', null,'There was an error using the camera. Please try again.<br><br>Error: ' + e, ['OK']));
    }


    private stopSearch() {
        if (this.isScanning) {
            this.isScanning = false;
            this.qrScanner.hide().then(res => {
                this.qrScanner.destroy();
            });
        }
    }



}
