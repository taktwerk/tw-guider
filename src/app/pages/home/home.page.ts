import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private browser;
  public client_id;
  public host_id;
  public dev_mode;
  public version;
  public app_name;

   constructor(
       private router: Router,
       public appVersion: AppVersion,
       public storage: Storage,
       public device: Device,
       public iab: InAppBrowser,

   ) {}


   ionViewDidEnter(): void {
        this.appVersion.getAppName().then((res: string) => {
            console.log('config: app name', res);
            this.app_name = res;
            this.appVersion.getVersionNumber().then((version: string | number) => {
                console.log('config: app version', version);
                this.version = version;
                this.openBrowser();
            });
        });
    }

    public openBrowser(): void {
        console.log('entered');
        this.storage.get('url').then((url: string) => {
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
     * @param url
     */
    public openWebview(url: string) {
        let appUrl = url;
        appUrl += '&device_key=' + this.device.uuid + '&device_name=' + this.device.model + '&version=' + this.version;
        console.log('iab url', appUrl);

        this.browser = this.iab.create(appUrl, '_blank', {
            location: 'no',
            toolbar: 'no',
            allowinlinemediaplayback: 'yes',
            disallowoverscroll: 'yes',
            usewkwebview: 'yes'
        });

        // Events: loadstart, loadstop, loaderror, exit
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
            const forbiddenUrl = e.url.includes('user/login');
            console.log('forbidden', forbiddenUrl);
            if (forbiddenUrl) {
                console.log('closing');
                this.browser.close();
                this.openWebview(url);
            }
        });

    }

    public openSetup() {
        this.router.navigate(['setup']);
    }

    ionViewWillLeave() {
        if (this.browser) {
            this.browser.close();
        }
    }

}
