import { MiscService } from './../../services/misc-service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth-service';
import { AppSetting } from '../../services/app-setting';
import { Subscription } from 'rxjs';

@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit, OnDestroy {
    public params;
    eventSubscription: Subscription;

    constructor(
        public navCtrl: NavController,
        public authService: AuthService,
        public appSetting: AppSetting,
        public miscService: MiscService
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
        // this.events.subscribe('network:online', (isNetwork) => {
        //     this.authService.checkAccess();
        // });

        this.eventSubscription = this.miscService.events.subscribe(async (event) => {
            if (event.TAG == 'network:online') { 
                this.authService.checkAccess();
            }
        })
    }

    ngOnDestroy(): void {
        this.eventSubscription.unsubscribe();
    }
}
