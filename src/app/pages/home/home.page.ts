import { Component, ViewChild } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router, RouterModule } from '@angular/router';
import {Platform} from '@ionic/angular';
import {PdfViewerService} from "../../services/pdf-viewer-service";

declare var cordova: any;

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
       private platform: Platform,
       public appVersion: AppVersion,
       public storage: Storage,
       public device: Device,
       public iab: InAppBrowser,
       private pdfViewerService: PdfViewerService
   ) {}

   ionViewDidEnter(): void {
       console.log('ionViewDidEnter');
       console.log('this.appVersion', this.appVersion);
       this.platform.ready().then(() => {
           if (this.appVersion) {
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

        if (this.platform.is('android')) {
          this.androidBrowser(appUrl);
        } else {
          this.iosBrowser(appUrl);
        }
    }

    iosBrowser(appUrl) {
      this.browser = this.iab.create(appUrl, "_blank", "'location=no,toolbar=no,allowinlinemediaplayback=yes,disallowoverscroll=yes,usewkwebview=yes'");
    }

    androidBrowser(appUrl) {
      this.browser = cordova.InAppBrowser.open(appUrl, "_blank", 'location=no,toolbar=no,allowinlinemediaplayback=yes,disallowoverscroll=yes,usewkwebview=yes,beforeload=yes');

      this.browser.addEventListener('beforeload', (params, callback) => {
        // If the URL being loaded is a PDF
        if(params.url.match(".pdf") || params.url.match("elfinder/connect")) {
          console.log('is pdf file');
          let appUrl = 'http://192.168.1.101:8015/img/file.pdf';
          this.browser.hide();
          this.pdfViewerService.open(appUrl, this.browser);
        } else {
          callback(params.url);
        }
      }, false);

      this.browser.addEventListener('loadstart', function(params, callback){
        console.log('loadstart event');
      });

      this.browser.addEventListener('loadstop', function(params, callback){
        console.log('loadstop event');
      });

      this.browser.addEventListener('exit', function(params, callback){
        console.log('exit event');
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
