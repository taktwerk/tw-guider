import { Component } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth-service';
import { HttpClient } from '../../services/http-client';
import { NgForm } from '@angular/forms';
import { ApiSync } from '../../providers/api-sync';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { AppSetting } from '../../services/app-setting';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
    selector: 'page-login',
    templateUrl: 'login.page.html',
    styleUrls: ['login.page.scss']
})
export class LoginPage {
    username: string;
    password: string;
    currDate: Date = new Date();
    public center;

    public params;
    /** flag that indicates if the login was failed or not */
    isLoginFailed: boolean = false;

    /**
     * @param navCtrl
     * @param authService
     * @param http
     * @param apiSync
     * @param network
     * @param appSetting
     */
    constructor(public navCtrl: NavController,
        public authService: AuthService,
        public http: HttpClient,
        public apiSync: ApiSync,
        private network: Network,
        private appSetting: AppSetting,
        private loader: LoadingController,
    ) { }

    /**
     * Try to login with the current pin-code and redirect the user to the
     * dashboard if the login was successful. Otherwise show fail message.
     */
    login(form: NgForm) {
        if (!form.value.password && !form.value.username) {
            this.http.showToast('validation.Username and password is required');
            return;
        }
        if (!form.value.password) {
            this.http.showToast('validation.Password is required');
            return;
        }
        if (!form.value.username) {
            this.http.showToast('validation.Username is required');
            return;
        }
        if (this.network.type === 'none' && !this.appSetting.isEnabledUsb) {
            this.showLoader()
            this.loginOffine(form);
        } else {
            this.showLoader()
            this.loginOnline(form);
        }
    }

    loginOffine(form: NgForm) {
        this.authService.offlineAuthenticate(form.value).then((result) => {
            if (!result) {
                this.loader.dismiss();
                this.http.showToast('validation.Wrong password or login!');
            } else {
                this.loader.dismiss();
                this.navCtrl.navigateRoot('/guide-categories');
                this.http.showToast('login.You are logged in.');
            }
        });
    }

    loginOnline(form: NgForm) {
        this.authService.authenticate(form.value).then((result: number) => {
            switch (result) {
                case AuthService.STATE_ERROR_NETWORK:
                    // network problem
                    this.username = '';
                    this.password = '';
                    this.http.showToast();
                    this.loader.dismiss();
                    break;
                case AuthService.STATE_ERROR_INVALID_LOGIN:
                    // invalid login
                    this.username = '';
                    this.password = '';
                    this.isLoginFailed = true;
                    this.http.showToast('Wrong password!');
                    this.loader.dismiss();
                    break;
                case AuthService.STATE_ERROR_USER_BLOCKED:
                    this.username = '';
                    this.password = '';
                    this.isLoginFailed = true;
                    this.http.showToast('validation.user_blocked');
                    this.loader.dismiss();
                    break;
                case AuthService.STATE_ERROR_USER_CANT_LOGIN:
                    this.username = '';
                    this.password = '';
                    this.isLoginFailed = true;
                    this.http.showToast('validation.user_cant_login');
                    this.loader.dismiss();
                    break;
                default:
                    this.loader.dismiss();
                    this.navCtrl.navigateRoot('/guide-categories');
                    this.http.showToast('login.You are logged in.');
            }
        });
    }

    async showLoader() {
        const loader = await this.loader.create();
        loader.present();
    }
}
