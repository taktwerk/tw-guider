import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {Storage} from "@ionic/storage";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";

/**
 * Generated class for the SetupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
    name: 'bluetooth-page'
})
@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html',
})
export class SetupPage {

    private browser;
    public client_id;
    public dev_mode;

    private isScanning: boolean = false;

    constructor(public navCtrl: NavController,
                public http: HttpClient,
                public platform: Platform,
                public storage: Storage,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                private qrScanner: QRScanner) {

    }

    /**
     *
     */
    ionViewDidEnter() {

    }

    /**
     * Save the form into storage
     */
    public save() {
        console.log('saving', this.client_id);
        if (this.client_id) {
            const loader = this.loadingCtrl.create({
                content: "Configurating...",
                showBackdrop: false
            });
            loader.present();

            // Build the In App Browser url

            // Todo: test auto-detect?
            var appUrl = "https://tw-app.scapp.io/de/webview-login/?client=" + this.client_id;
            var appConfirmUrl = "https://tw-app.scapp.io/de/webview-login/confirm?client=" + this.client_id;

            if (this.dev_mode) {
                appUrl = "http://tw-app-dev.devhost.taktwerk.ch/de/webview-login/?client=" + this.client_id;
                appConfirmUrl = "http://tw-app-dev.devhost.taktwerk.ch/de/webview-login/confirm?client=" + this.client_id;
            }


            // We need to test the url
            this.http.get(appConfirmUrl, {responseType: 'json'}).subscribe(res => {
                this.storage.set('url', appUrl);
                loader.dismiss();

                // Close the current page
                this.navCtrl.pop();
            }, err => {
                loader.dismiss();
                const alert = this.alertCtrl.create({
                    title: 'Config Error',
                    subTitle: 'There was an error setting up the application. Please try again.',
                    buttons: ['OK']
                });
                alert.present();
            });
        }
    }

    ionViewWillLeave() {
        this.browser.close();
    }

    /**
     *
     */
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
                    let scanSub = this.qrScanner.scan().subscribe((text: string) => {
                        console.log('Scanned something', text);
                        this.isScanning = false;

                        console.log('raw', text);
                        var config = JSON.parse(text);
                        console.log('json', config);
                        if (config.taktwerk && config.taktwerk === 'guider') {

                            this.client_id = config.client;
                            if (config.dev) {
                                this.dev_mode = true;
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

    /**
     * Stop searching
     */
    private stopSearch()
    {
        if (this.isScanning) {
            this.isScanning = false;
            this.qrScanner.hide().then(res => {
                this.qrScanner.destroy();
            });
        }
    }

}
