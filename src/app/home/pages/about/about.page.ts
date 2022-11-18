/* eslint-disable @angular-eslint/component-selector */

import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { config } from '../../../../environments/config';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { Capacitor } from '@capacitor/core';
import { AuthService } from 'app/library/services/auth-service';

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'about-page',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss'],
})
export class AboutPage implements OnInit {
  public versionNumber = '0.0.1';
  public apiVersionNumber = '0.0.1';
  public params: any;
  currDate: Date = new Date();

  constructor(private platform: Platform, public authService: AuthService, private appVersion: AppVersion) { }

  ngOnInit(): void {


    if (Capacitor.getPlatform() === 'android') {
      this.appVersion.getVersionNumber().then(res => {
        console.log('check version number', res);

        this.versionNumber = res;
      }).catch(error => {
        alert(error);
      });
    }

    if (config) {
      if (config.apiVersion) {
        this.apiVersionNumber = config.apiVersion;
      }
    }


  }
}
// if (this.platform.is('capacitor')) {
//   this.appVersion.getVersionNumber().then(res => {
//     console.log('check version number', res);

//     this.versionNumber = res;
//   }).catch(error => {
//     alert(error);
//   });
// }
