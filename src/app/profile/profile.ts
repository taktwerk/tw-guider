import { Component, OnInit } from '@angular/core';
import { Events, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth-service';
import { AppSetting } from '../../services/app-setting';

@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit {

    public params;

    constructor(
        public navCtrl: NavController,
        public authService: AuthService,
        public events: Events,
        public appSetting: AppSetting
    ) {
        this.authService.checkAccess();
    }

    changeUsbMode() {
        this.appSetting.appSetting.find().then(async (result) => {
            console.log('app setting result', result);
            if (result) {
                result.settings.isEnabledUsb = !this.appSetting.isEnabledUsb;
                await result.save();
                this.appSetting.isEnabledUsb = !this.appSetting.isEnabledUsb;
            }
        });
    }

    ngOnInit(): void {
        this.events.subscribe('network:online', (isNetwork) => {
            this.authService.checkAccess();
        });
    }
}
