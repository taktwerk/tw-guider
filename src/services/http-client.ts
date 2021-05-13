import { Injectable } from '@angular/core';
import { HttpClient as Http, HttpHeaders as Headers, HttpResponse as Response } from '@angular/common/http';

import { AuthService } from './auth-service';

import { NavController, Platform } from '@ionic/angular';
import { TranslateConfigService } from './translate-config.service';
import { Device } from '@ionic-native/device/ngx';
import { Network } from '@ionic-native/network/ngx';
import { ToastService } from './toast-service';
import config from '../environments/config.json';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class HttpClient {
    headers: Headers = null;
    versionNumber = '0.0.1';
    databaseVersionNumber = '0.0.1';

    showAppVersionPopup = true;

    deviceInfo: any = {
        model: this.device.model,
        platform: this.device.platform,
        uuid: this.device.uuid,
        version: this.device.version,
        manufacturer: this.device.manufacturer,
        isVirtual: this.device.isVirtual,
        serial: this.device.serial
    };

    constructor(
        private http: Http,
        private platform: Platform,
        private authService: AuthService,
        public navCtrl: NavController,
        private translateConfigService: TranslateConfigService,
        private device: Device,
        private network: Network,
        private toastService: ToastService
    ) {
        this.platform.ready().then(() => {
            this.deviceInfo = {
                model: this.device.model,
                platform: this.device.platform,
                uuid: this.device.uuid,
                version: this.device.version,
                manufacturer: this.device.manufacturer,
                isVirtual: this.device.isVirtual,
                serial: this.device.serial
            };
            if (config) {
                if (config.apiVersion) {
                    this.versionNumber = config.apiVersion;
                }
                if (config.databaseVersion) {
                    this.databaseVersionNumber = config.databaseVersion;
                }
            }
            this.initHeaders();
        });
    }

    /**
     * Init the headers
     */
    public initHeaders() {
        let headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'X-CURRENT-DATETIME': new Date().toISOString()
        };
        if (this.authService.auth) {
            if (this.authService.auth.authToken) {
                headers['X-Auth-Token'] = this.getAuthorizationToken();
                /// send current device info with uuid and etc.
                headers['X-Device-Info'] = JSON.stringify(this.deviceInfo);
                if (this.authService.auth.lastAuthItemChangedAt) {
                    headers['X-Auth-Item-Last-Changed-At'] = '' + this.authService.auth.lastAuthItemChangedAt;
                }
                headers['X-VERSION-NUMBER'] = this.versionNumber;
                headers['X-DATABASE-VERSION-NUMBER'] = this.databaseVersionNumber;
            }
        }
        this.headers = new Headers(headers);
    }

    /**
     *
     * @returns {string}
     */
    public getAuthorizationToken() {
        return this.authService.auth.authToken;
    }

    get(url, headers?): Observable<any> {
        this.initHeaders();
        return this.http.get(url, {
            headers: this.headers
        }).pipe(catchError(error => this.handleError(error)))
    }

    post(url, data): Observable<any> {
        this.initHeaders();
        return this.http.post(url, data, {
            headers: this.headers
        }).pipe(catchError(error => this.handleError(error)))
    }

    private handleError(error: any) {
        let errMsg: string;
        if (this.network.type === 'none') {
            console.log('no network');
        } else if (error instanceof Response) {
            console.log('errrorrr', error);
        } else {
            if (error.status === 401) {
                this.authService.logout().then(() => {
                    this.navCtrl.navigateRoot('/login').then(() => {
                        if (error.error && error.error.message) {
                            try {
                                const errorResponse = JSON.parse(error.error.message);
                                if (errorResponse.error) {
                                    if (errorResponse.user_id) {
                                        this.authService.newAuthModel().findWhere(['user_id', errorResponse.user_id]).then((user) => {
                                            if (user) {
                                                user.password = '';
                                                user.auth_token = '';
                                                user.save(true);
                                            }
                                        });
                                    }
                                    if (errorResponse.error === 'User was blocked') {
                                        this.authService.presentAlert(
                                            'Config Error',
                                            null,
                                            this.translateConfigService.translateWord('validation.user_blocked'),
                                            ['OK']
                                        );
                                        return;
                                    }
                                    if (errorResponse.error === 'The user has no rights to log in') {
                                        this.authService.presentAlert(
                                            'Config Error',
                                            null,
                                            this.translateConfigService.translateWord('validation.user_cant_login'),
                                            ['OK']
                                        );
                                        return;
                                    }
                                }
                            } catch (e) {
                                //
                            }
                        }
                        this.showToast(
                            'validation.You are not authorized.',
                            'login.Please, login',
                            'danger'
                        );
                    });
                });
            } else if (error.status === 426) {
                if (this.showAppVersionPopup) {
                    if (error.error.message === 'Wrong Application Version') {
                        this.authService.presentAlert(
                            '',
                            null,
                            this.translateConfigService.translateWord('validation.is_app_version_old'),
                            ['OK']
                        );
                        this.showAppVersionPopup = false;
                    } else if (error.error.message === 'Wrong Database Application Version') {
                        this.authService.presentAlert(
                            '',
                            null,
                            this.translateConfigService.translateWord('app.You needs to swipe data and reinstall app'),
                            ['OK']
                        );
                        this.showAppVersionPopup = false;
                    }
                }
            } else {
                errMsg = error.message ? error.message : error.toString();
                console.log('errMsg', error);
            }
        }

        return Promise.reject(errMsg);
    }

    async showToast(msg?: string, header?: string, toastColor?: string, withLocalization: boolean = true) {
        this.toastService.showToast(msg, header, toastColor, withLocalization);
    }
}
