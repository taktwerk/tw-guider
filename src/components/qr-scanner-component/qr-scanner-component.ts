import {Component, OnInit} from '@angular/core';
import {AlertController, LoadingController, Platform} from '@ionic/angular';
import {AuthService} from '../../services/auth-service';
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner/ngx';
import {HttpClient} from '../../services/http-client';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'qr-scanner-component',
  templateUrl: 'qr-scanner-component.html',
})
export class QrScannerComponent implements OnInit{
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
        private http: HttpClient
    ) {}

    public scanQrcode() {
        // if (this.isScanning) {
        //     this.stopSearch();
        //     return false;
        // }

        // Optionally request the permission early
        this.qrScanner.prepare()
            .then((status: QRScannerStatus) => {
                console.log('Scan status', status);
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
                    console.log('where is my scanner', res);
                });


                // start scanning
                const scanSub = this.qrScanner.scan().subscribe((text: string) => {
                    console.log('Scanned something', text);
                    // this.isScanning = false;
                    //
                    // console.log('raw', text);
                    // const config = JSON.parse(text);
                    // console.log('json', config);
                    // if (config.taktwerk && config.taktwerk === 'guider') {
                    //
                    //     this.clientId = config.client;
                    //     if (config.dev) {
                    //         this.devMode = true;
                    //     }
                    //     if (config.host) {
                    //         this.hostId = config.host;
                    //     }
                    //     this.save();
                    // }
                    //
                    // this.stopSearch(); // hide camera preview
                    scanSub.unsubscribe(); // stop scanning
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

    /**
     * Save the form into storage
     */
    public async save() {
        this.clientId = this.client_id;
        this.hostId = this.host_id;

        console.log('saving', this.clientId, this.hostId, this);
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

            if (this.hostId) {
                appUrl = this.hostId + '/de/webview-login/?client=' + this.clientId;
                appConfirmUrl = this.hostId + '/de/webview-login/confirm?client=' + this.clientId;
            }

            // We need to test the url

            return this.http.get(appConfirmUrl, {responseType: 'json'})
                .subscribe(data => {
                    /// TODO save data from response
                    loader.dismiss();
                    // this.navCtrl.pop();
                },
                        error => {
                    console.log(error);
                    loader.dismiss();
                    this.presentAlert(
                        'Config Error',
                        null,
                        'There was an error setting up the application. Please try again.<br><br>Error: '
                        + error + '<br><br>Url: ' + appUrl,
                        ['OK']
                    );
                });
        }
    }

    private stopSearch() {
        if (this.isScanning) {
            this.isScanning = false;
            this.qrScanner.hide().then(res => {
                this.qrScanner.destroy();
            });
        }
    }

    ionViewDidLeave() {
        window.document.querySelector('ion-app').classList.remove('transparentBody');
    }

    ngOnInit() {
        window.document.querySelector('ion-app').classList.add('transparentBody');
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
