/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppSetting } from 'src/services/app-setting';
import { AuthService } from 'src/services/auth-service';
import { MiscService } from 'src/services/misc-service';

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
       // console.log('this.authService.auth.groups ', this.authService.auth.groups);
    }

    changeUsbMode() {
        this.appSetting.appSetting.find().then(async (result) => {
            // console.log('app setting result', result);
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
            if (event.TAG === 'network:online') {
                this.authService.checkAccess();
            }
        });
    }

    ngOnDestroy(): void {
        this.eventSubscription.unsubscribe();
    }
}
