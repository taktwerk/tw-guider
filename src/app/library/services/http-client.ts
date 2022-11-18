/* eslint-disable @typescript-eslint/naming-convention */

import { HttpHeaders as Headers, HttpClient as Http, HttpResponse as Response } from '@angular/common/http';
import { NavController, Platform } from '@ionic/angular';

import { AuthService } from './auth-service';
import { Device } from '@capacitor/device';
import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { Observable } from 'rxjs';
import { ToastService } from './toast-service';
import { TranslateConfigService } from './translate-config.service';
import { catchError } from 'rxjs/operators';
import { config } from '../../../environments/config';

@Injectable()
export class HttpClient {
    headers: Headers = new Headers();
    versionNumber = '0.0.1';
    databaseVersionNumber = '0.0.1';

    showAppVersionPopup = true;

    deviceInfo!: {
        model: any;
        platform: any;
        uuid: any;
        version: any;
        manufacturer: any;
        isVirtual: any;
        serial: any;
    };

    constructor(
        private http: Http,
        private platform: Platform,
        private authService: AuthService,
        public navCtrl: NavController,
        private translateConfigService: TranslateConfigService,
        private toastService: ToastService
    ) {
        this.platform.ready().then(async () => {

            const info = await Device.getInfo();
            const uuid = await Device.getId();
            this.deviceInfo = {
                model: info.model,
                platform: info.platform,
                uuid,
                version: info.osVersion,
                manufacturer: info.manufacturer,
                isVirtual: info.isVirtual,
                serial: info.manufacturer
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

    stringify(circObj: any) {
      const replacerFunc = () => {
          const visited = new WeakSet();
          return (key: any, value: any) => {
              if (typeof value === 'object' && value !== null) {
                  if (visited.has(value)) {
                      return;
                  }
                  visited.add(value);
              }
              return value;
          };
      };

      return JSON.stringify(circObj, replacerFunc());
  }

    /**
     * Init the headers
     */
    public initHeaders() {
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'X-CURRENT-DATETIME': new Date().toISOString()
        };
        if (this.authService.auth) {
            if (this.authService.auth.authToken) {
                (headers as any)['X-Auth-Token'] = this.getAuthorizationToken();
                /// send current device info with uuid and etc.
                (headers as any)['X-Device-Info'] = this.stringify(this.deviceInfo);
                if (this.authService.auth.lastAuthItemChangedAt) {
                  (headers as any)['X-Auth-Item-Last-Changed-At'] = '' + this.authService.auth.lastAuthItemChangedAt;
                }
                (headers as any)['X-VERSION-NUMBER'] = this.versionNumber;
                (headers as any)['X-DATABASE-VERSION-NUMBER'] = this.databaseVersionNumber;
            }
        }
        this.headers = new Headers(headers);
    }

    /**
     *
     */
    public getAuthorizationToken() {
        return this.authService.auth.authToken;
    }

    get(url: string, headers?: any): Observable<any> {
        this.initHeaders();
        return this.http.get(url, {
            headers: this.headers
        }).pipe(catchError(error => this.handleError(error)));
    }

    post(url: any, data:any): Observable<any> {
        this.initHeaders();
        return this.http.post(url, data, {
            headers: this.headers
        }).pipe(catchError(error => this.handleError(error)));
    }

    async handleError(error: any) {
        let errMsg: any = '';
        const network = await Network.getStatus();
        if (network.connected === false) {
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
                                        this.authService.presentAlert('Config Error', null,
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
                // console.log('errMsg', error);
            }
        }

        return Promise.reject(errMsg);
    }

    async showToast(msg?: string, header?: string, toastColor?: string, withLocalization: boolean = true) {
        this.toastService.showToast(msg, header, toastColor, withLocalization);
    }
}