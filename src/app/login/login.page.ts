import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';
import { NgForm } from '@angular/forms';
import {ApiSync} from '../../providers/api-sync';
import {Network} from '@ionic-native/network/ngx';
import {ConnectionStatusEnum} from '../app.component';

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
    /** flag that indicates if the login was failed or not */
    isLoginFailed: boolean = false;

    /**
     * @param navCtrl
     * @param authService
     * @param http
     * @param apiSync
     * @param network
     */
    constructor(public navCtrl: NavController,
                public authService: AuthService,
                public http: HttpClient,
                public apiSync: ApiSync,
                private network: Network) {}

    /**
     * Try to login with the current pin-code and redirect the user to the
     * dashboard if the login was successful. Otherwise show fail message.
     */
    login(form: NgForm) {
        if (this.network.type === 'none') {
            this.loginOffine(form);
        } else {
            this.loginOnline(form);
        }
    }

    loginOffine(form: NgForm) {
        this.authService.offlineAuthenticate(form.value).then((result) => {
            if (!result) {
                this.http.showToast('validation.Wrong password or login!');
            } else {
                this.navCtrl.navigateRoot('home');
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
                    break;
                case AuthService.STATE_ERROR_INVALID_LOGIN:
                    // invalid login
                    this.username = '';
                    this.password = '';
                    this.isLoginFailed = true;
                    this.http.showToast('Wrong password!');
                    break;
                default:
                    this.navCtrl.navigateRoot('home');
                    this.http.showToast('login.You are logged in.');
            }
        });
    }

    delete() {
        this.username = '';
        this.password = '';
    }
}
