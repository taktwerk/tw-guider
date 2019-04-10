import {Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {Device} from "@ionic-native/device";
import {AppVersion} from "@ionic-native/app-version";
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { SetupPage } from "../setup/setup";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    private browser;
    public client_id;
    public dev_mode;
    public version;
    public app_name;

    constructor(public navCtrl: NavController,
                public http: HttpClient,
                public platform: Platform,
                public iab: InAppBrowser,
                public device: Device,
                public appVersion: AppVersion,
                public storage: Storage,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController
    ) {


    }

    /**
     *
     */
    ionViewDidEnter() {
        console.log('ion view did enter');
        this.appVersion.getAppName().then(res => {
            console.log('config: app name', res);
            this.app_name = res;
            this.appVersion.getVersionNumber().then((version) => {
                console.log('config: app version', version);
                this.version = version;
                this.openBrowser();
            });
        });
    }

    /**
     *
     */
    public openBrowser() {
        console.log('entered');
        this.storage.get('url').then((url) => {
            console.log('Config.url', url);
            if (url) {
                this.openWebview(url);
            } else {
                this.openSetup();
            }
        });
    }

    /**
     *
     */
    public openSetup() {
        this.navCtrl.push(SetupPage);
    }

    /**
     *
     * @param url
     */
    public openWebview(url) {
        var appUrl = url;
        appUrl += "&device_key=" + this.device.uuid + "&device_name=" + this.device.model + "&version=" + this.version;

        console.info('iab url', appUrl);

        this.browser = this.iab.create(appUrl, "_blank", {
            'location': 'no',
            'toolbar': 'no',
            'allowinlinemediaplayback': 'yes',
            'disallowoverscroll': 'yes',
            'usewkwebview': 'yes'
        });

        //Events: loadstart, loadstop, loaderror, exit
        // this.browser.on('exit').subscribe(() => {
        //     console.log('closed browser');
        //     this.platform.exitApp();
        //     navigator['app'].exitApp();
        // }, err => {
        //     console.error(err);
        // });

        // If going on the login page, redirect
        this.browser.on('loadstart').subscribe((e) => {
            console.log('url loadstart', e.url);
            var forbiddenUrl = e.url.includes('user/login');
            console.log('forbidden', forbiddenUrl);
            if (forbiddenUrl) {
                console.log('closing');
                this.browser.close();
                this.openWebview(url);
            }
        });

    }


    ionViewWillLeave() {
        this.browser.close();
    }
}
