import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Device } from '@ionic-native/device';


import { Toast } from '@ionic-native/toast';
import { AppVersion } from '@ionic-native/app-version';


import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = HomePage;
    private browser;

    constructor(platform: Platform,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                public iab: InAppBrowser,
                public device: Device,
                public appVersion: AppVersion,
                toast: Toast) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();

            toast.show(appVersion.getAppName() + ': ' + appVersion.getVersionNumber(), '5000', 'center').subscribe(
                toast => {
                    console.log(toast);
                    this.openWebview()
                }
            );
        });
    }

    public openWebview() {

        // Build the In App Browser url
        var appUrl = "https://demo.taktwerk.ch/en/webview-login/?client=1";

        appUrl = "http://tw-demo-dev.devhost.taktwerk.ch/en/webview-login/?client=2";

        appUrl += "&device_key=" + this.device.uuid + "&device_name=" + this.device.model;

        console.info('iab url', appUrl);

        this.browser = this.iab.create(appUrl, "_blank", {'location': 'no', 'toolbar': 'no'});
    }

    ionViewWillLeave() {
        this.browser.close();
    }
}

