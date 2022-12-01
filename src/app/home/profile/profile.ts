// import { MiscService } from './../../services/misc-service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/controller/auth/auth.service';
import { ToastrService } from 'src/controller/core/ui/toastr.service';
import { AppSettingService } from 'src/controller/services/app-setting.service';
import { StateService } from 'src/controller/state/state.service';

@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage implements OnInit, OnDestroy {

    eventSubscription: Subscription = new Subscription;

    constructor(
        private navCtrl: NavController,
        public authService: AuthService,
        public appSettingService: AppSettingService,
        private toastrService: ToastrService,
        // public miscService: MiscService,
        public stateService: StateService
    ) {

    }

    ngOnInit(): void {
        // this.eventSubscription = this.miscService.events.subscribe(async (event) => {
        //     if (event.TAG === 'network:online') {
        //         this.authService.checkAccess();
        //     }
        // });
    }

    ngOnDestroy(): void {
        this.eventSubscription.unsubscribe();
    }

    selectedLanguage = 'en';
    languageChanged() {

    }

    logout() {
      this.authService.logout().then(data => {
        this.navCtrl.navigateRoot('/login');
        this.toastrService.info('Login.You are logged out.');
      });
    }
}
