/* eslint-disable @angular-eslint/component-selector */

import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth-service';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { Platform } from '@ionic/angular';
import { config } from '../../environments/config';

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
  public params;
  currDate: Date = new Date();

  constructor(private platform: Platform, public authService: AuthService, private device: Device) { }

  ngOnInit(): void {
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        if (this.device) {
          this.versionNumber = this.device.version;
        }
        if (config) {
          if (config.apiVersion) {
            this.apiVersionNumber = config.apiVersion;
          }
        }
      });
    }
  }
}
