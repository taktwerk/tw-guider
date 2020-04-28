import {Component, OnInit} from '@angular/core';
import {Events, NavController, Platform} from '@ionic/angular';
import {AuthService} from '../../services/auth-service';
import {AppSetting} from '../../services/app-setting';
import {AppVersion} from '@ionic-native/app-version/ngx';


/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'about-page',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss']
})
export class AboutPage implements OnInit {

    public versionNumber = '0.0.1';

    constructor(
        private platform: Platform,
        public authService: AuthService,
        private appVersion: AppVersion
    ) {}

    ngOnInit(): void {
        this.platform.ready().then(() => {
            if (this.appVersion) {
                this.appVersion.getVersionNumber().then((versionNumber) => {
                    this.versionNumber = versionNumber;
                });
            }
        });
    }
}
