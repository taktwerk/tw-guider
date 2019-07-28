import { Component, OnInit } from '@angular/core';
import {LoadingController, AlertController, NavController} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Storage } from '@ionic/storage';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage {
  private browser;
  public clientId: string | number;
  public devMode;
  public isScanning: boolean;

  constructor(
      private loadingCtrl: LoadingController,
      private authServ: AuthService,
      private alertController: AlertController,
      public storage: Storage,
      private qrScanner: QRScanner,
      private navCtrl: NavController
  ) { }

    async presentAlert(header: string, subHeader: string, buttons: Array<string> ) {
        const alert = await this.alertController.create({
            header,
            subHeader,
            buttons
        });
        await alert.present();
    }

    /**
     * Save the form into storage
     */
    public async save() {
        console.log('saving', this.clientId);
        if (this.clientId) {
            const loader = await this.loadingCtrl.create({
                message: 'Configurating...',
                showBackdrop: false
            });
            await loader.present();

            // Build the In App Browser url

            // Todo: test auto-detect?
            let appUrl = 'https://app.taktwerk.ch/de/webview-login/?client=' + this.clientId;
            let appConfirmUrl = 'https://app.taktwerk.ch/de/webview-login/confirm?client=' + this.clientId;

            if (this.devMode) {
                appUrl = 'http://tw-app-dev.devhost.taktwerk.ch/de/webview-login/?client=' + this.clientId;
                appConfirmUrl = 'http://tw-app-dev.devhost.taktwerk.ch/de/webview-login/confirm?client=' + this.clientId;
            }


            // We need to test the url

            this.authServ.login(appConfirmUrl)
                .then(data => {
                    this.storage.set('url', appUrl);
                    loader.dismiss();
                    // Close the current page
                    this.navCtrl.pop();
                })
                .catch(error => {
                    console.log(error);
                    loader.dismiss();
                    this.presentAlert('Config Error', 'There was an error setting up the application. Please try again.', ['OK']);
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

                            this.clientId = config.client;
                            if (config.dev) {
                                this.devMode = true;
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
            .catch((e: any) => console.log('Error is', e));
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
