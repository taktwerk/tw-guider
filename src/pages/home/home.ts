import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {Device} from "@ionic-native/device";
import {AppVersion} from "@ionic-native/app-version";
import { Storage } from '@ionic/storage';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Platform } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    private browser;
    public client_id;
    public dev_mode;
    public version;

    private isScanning: boolean = false;

    constructor(public navCtrl: NavController,
                public platform: Platform,
                public iab: InAppBrowser,
                public device: Device,
                public appVersion: AppVersion,
                public storage: Storage,
                private qrScanner: QRScanner) {

        appVersion.getAppName().then(res => {
            this.version = res;
            appVersion.getVersionNumber().then(res => {
                this.version += ' - ' + res;
            });
        });
    }

    ionViewDidEnter() {
        this.storage.get('url').then((url) => {
            if (url) {
                this.openWebview(url);
            }
        });
    }

    /**
     * Save the form into storage
     */
    public save() {
        if (this.client_id) {

            // Build the In App Browser url
            var appUrl = "https://demo.taktwerk.ch/en/webview-login/?client=" + this.client_id;

            if (this.dev_mode) {
                appUrl = "http://tw-demo-dev.devhost.taktwerk.ch/en/webview-login/?client=" + this.client_id;
            }

            this.storage.set('url', appUrl);

            this.openWebview(appUrl);
        }
    }

    public openWebview(url) {
        var appUrl = url;
        appUrl += "&device_key=" + this.device.uuid + "&device_name=" + this.device.model;

        console.info('iab url', appUrl);

        this.browser = this.iab.create(appUrl, "_blank", {
            'location': 'no', 'toolbar': 'no'
        });

        //Events: loadstart, loadstop, loaderror, exit
        this.browser.on('exit').subscribe(() => {
            this.platform.exitApp();
        }, err => {
            console.error(err);
        });

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
