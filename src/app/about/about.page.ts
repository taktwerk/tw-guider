import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from '../../services/auth-service';
// import { AppVersion } from '@ionic-native/app-version/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
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

  constructor(private platform: Platform, public authService: AuthService, private appVersion: AppVersion) { }

  ngOnInit(): void {
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        if (this.appVersion) {
          this.appVersion.getVersionNumber().then((versionNumber) => {
            this.versionNumber = versionNumber;
          });
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
