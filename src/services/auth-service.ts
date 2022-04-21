/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */

import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { HttpHeaders as Headers, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone, OnInit } from '@angular/core';

import { AppSetting } from './app-setting';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { AuthDb } from '../models/db/auth-db';
import { CryptoProvider } from '../providers/crypto-provider';
import { Device } from '@ionic-native/device/ngx';
import { DownloadService } from './download-service';
import { MiscService } from '../services/misc-service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { TranslateConfigService } from './translate-config.service';
import { UserDb } from '../models/db/user-db';
import { UserService } from './user-service';
import { UserSetting } from '../models/user-setting';

@Injectable()
export class AuthService implements OnInit {
    /**
     * Auth Service
     * @param http
     * @param loadingController
     * @param events
     * @param downloadService
     * @param navCtrl
     * @param cryptoProvider
     * @param toastCtrl
     * @param network
     * @param ngZone
     * @param appSetting
     * @param device
     * @param appVersion
     * @param alertController
     * @param userService
     * @param translateConfigService
     */
    constructor(private http: HttpClient,
        public loadingController: LoadingController,
        public downloadService: DownloadService,
        public navCtrl: NavController,
        public cryptoProvider: CryptoProvider,
        public toastCtrl: ToastController,
        private ngZone: NgZone,
        private appSetting: AppSetting,
        private device: Device,
        private appVersion: AppVersion,
        private alertController: AlertController,
        private userService: UserService,
        private translateConfigService: TranslateConfigService,
        private miscService: MiscService,
        private storage: Storage

    ) {
        // Create a tmp user until everything has properly been loaded
        this.auth = this.newAuthModel();
        this.auth.userId = 0;
    }

    async ngOnInit() {
        await this.storage.create();
    }

    static STATE_ERROR_INVALID_LOGIN = -1;
    static STATE_ERROR_NETWORK = -2;
    static STATE_ERROR_USER_BLOCKED = -3;
    static STATE_ERROR_USER_CANT_LOGIN = -4;
    /** AuthDb instance that holds the login data and is stored in the local sql lite db */
    public auth: AuthDb;
    /** successful auth state info */
    public isLoggedin: boolean;

    /** app is initialized **/
    public isInitialized = false;

    /** is currently a dummy user */
    public isDummy: boolean;

    /**
     * Authentificate the last logged in user
     * @returns {Promise<T>}
     */
    authenticateLastUser(user: AuthDb): Promise<any> {
        return new Promise(resolve => {
            if (user) {
                this.authenticate({ username: user.username, password: user.password }).then((res) => {
                    resolve(res);
                });
            } else {
                resolve(false);
            }
        });
    }

    /**
     * Get the last authed user for later
     * @returns {Promise<T>}
     */
    getLastUser(): Promise<any> {
        return new Promise(resolve => {
            this.newAuthModel().loadLast().then((user: AuthDb) => {
                if (user) {
                    this.auth = user;
                    this.isLoggedin = true;
                    resolve(user);
                } else {
                    this.isLoggedin = false;
                    resolve(false);
                }
            });
        });
    }

    /**
     * Tries to authenticate with a given pin and returns whether the authentification was successful or not.
     * @returns {Promise<boolean>}
     * @param formData
     */
    authenticate(formData: any): Promise<any> {
        const creds = `username=${formData.username}&password=${formData.password}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        return new Promise((resolve) => {
            this.http.get<any>(this.appSetting.getApiUrl() + '/login?' + creds, { headers }).subscribe(
                async (data) => {
                    if (data) {
                        const isSavedUser = await this.saveAuthenticatedUser(data, formData);
                        resolve(isSavedUser);
                    }
                }, (err) => {
                    if (err.status === 0) {
                        // loading.dismiss();
                        resolve(AuthService.STATE_ERROR_NETWORK);
                    } else {
                        if (err.error && err.error.error) {
                            if (err.error.error === 'User was blocked') {
                                if (err.error.blocked_user_id) {
                                    this.newAuthModel().findWhere(['user_id', err.error.blocked_user_id]).then((user) => {
                                        if (user) {
                                            user.password = '';
                                            user.auth_token = '';
                                            user.save(true).then((result) => { console.log('Was saved user', (result)); });
                                        }
                                    });
                                }
                                resolve(AuthService.STATE_ERROR_USER_BLOCKED);
                            }
                            if (err.error.error === 'The user has no rights to log in') {
                                this.presentAlert(
                                    'Config Error',
                                    null,
                                    this.translateConfigService.translateWord('validation.user_cant_login'),
                                    ['OK']
                                );
                                resolve(AuthService.STATE_ERROR_USER_CANT_LOGIN);
                            }
                        }
                        // loading.dismiss();
                        resolve(AuthService.STATE_ERROR_INVALID_LOGIN);
                    }
                }
            );
        });
    }

    offlineAuthenticate(formData: any): Promise<any> {
        return new Promise((resolve) => {
            this.auth.findFirst(['username', '"' + formData.username + '"'], 'user_id DESC').then((result) => {
                if (!result || !result[0]) {
                    resolve(false);
                    return;
                }
                const user = result[0];
                try {
                    if (!this.cryptoProvider.comparePassword(formData.password, user.password)) {
                        resolve(false);
                        return;
                    }
                } catch (error) {
                    resolve(false);
                    return;
                }

                user.password = this.cryptoProvider.hashPassword(formData.password);
                user.loginDate = new Date();

                user.save(true).then((authSaveResult) => {
                    if (authSaveResult) {
                        this.isLoggedin = true;
                        // create user setting
                        this.createUserSettingsIfNotExists().then((res) => {
                            if (res) {
                                // send a notification to the rest of the app
                                // this.events.publish('user:login', user.userId);
                                this.miscService.events.next({ TAG: 'user:login', data: user.userId })
                                resolve(user.userId);
                                return;
                            }
                            else {
                                resolve(false);
                                return;
                            }
                        });
                    } else {
                        // User creation error?
                        resolve(false);
                        return;
                    }
                });
            });
        });
    }

    findExistingUser(formData) {
        return new Promise((resolve) => {
            this.auth.findFirst(['username', '"' + formData.username + '"'], 'user_id DESC').then((result) => {
                if (!result || !result[0]) {
                    resolve(false);
                    return;
                }
                else {
                    const user = result[0];
                    resolve(user);
                }
            })
        })
    }

    loginByIdentifier(appConfirmUrl, type: string, identifier: string) {
        return new Promise(async (resolve, reject) => {
            if (type === 'client' || type === 'client-default-user') {
                const version = await this.appVersion.getVersionNumber();

                if (!version) {
                    resolve(false);
                    reject(new Error('Missed version number in config'));
                    return false;
                }

                appConfirmUrl += 'by-client-identifier?client=' + identifier;

                if (type === 'client-default-user') {
                    appConfirmUrl += '&is_login_by_default_user=1';
                }

                else {
                    appConfirmUrl += '&device_key=' + this.device.uuid +
                        '&device_name=' + this.device.model +
                        '&version=' + version;
                }
            }

            else if (type === 'user') {
                appConfirmUrl += 'by-user-identifier?user=' + identifier;
            }

            this.http.get(appConfirmUrl)
                .toPromise()
                .then(async data => {
                    if (data) {
                        await this.saveAuthenticatedUser(data).then(() => {
                            // console.log("saveAuthenticatedUser==========>")
                            // console.log(data)
                            // console.log("saveAuthenticatedUser==========>")
                            resolve(data);
                            return true;
                        });
                    }
                })
                .catch(err => {
                    if (err.error && err.error.error) {
                        if (err.error.error === 'User was blocked') {
                            if (err.error.blocked_user_id) {
                                this.newAuthModel().findWhere(['user_id', err.error.blocked_user_id]).then((user) => {
                                    if (user) {
                                        user.password = '';
                                        user.auth_token = '';
                                        user.save(true).then((result) => { console.log('Was saved user', (result)); });
                                    }
                                });
                            }
                            reject(new Error('User blocked'));
                            this.presentAlert(
                                'Config Error',
                                null,
                                this.translateConfigService.translateWord('validation.user_blocked'),
                                ['OK']
                            );
                            return;
                        }
                        if (err.error.error === 'The user has no rights to log in') {
                            reject(new Error('User can\'t login'));
                            this.presentAlert(
                                'Config Error',
                                null,
                                this.translateConfigService.translateWord('validation.user_cant_login'),
                                ['OK']
                            );
                            resolve(AuthService.STATE_ERROR_USER_CANT_LOGIN);
                        }
                    }

                    reject(new Error('Config Error'));
                    this.presentAlert(
                        'Config Error',
                        null,
                        'There was an error setting up the application. Please try again.',
                        ['OK']
                    );
                });
        });
    }

    saveAuthenticatedUser(user, formData?: any) {
        return new Promise(resolve => {
            const findAuthModel = this.newAuthModel();

            localStorage.setItem('authToken', user.access_token);

            findAuthModel.findFirst(['user_id', user.user_id], 'login_at DESC').then(async (existUser) => {
                if (existUser.length) {
                    this.auth = existUser[0];
                    this.auth.authToken = user.access_token;
                    this.auth.client_id = user.client_id;
                    this.auth.lastAuthItemChangedAt = user.lastAuthItemChangedAt;
                    this.auth.isAuthority = user.isAuthority;

                    if (formData) {
                        this.auth.password = this.cryptoProvider.hashPassword(formData.password);
                    }

                    this.auth.loginDate = new Date();
                    this.auth.additionalInfo = user.additionalInfo;
                    this.auth.groups = user.groups;

                    // show/hide sync button on guide category page
                    const onboardingSyncShown = await this.miscService.get_guideShown("onboardingSyncShown");
                    if (!onboardingSyncShown) this.miscService.unset_guideShown('onboardingSyncShown');
                }
                else {
                    // show sync button on guide category page
                    this.miscService.unset_guideShown('onboardingSyncShown');

                    if ((formData && !formData.username) || (!formData && !user.username)) {
                        resolve(false);
                        return false;
                    }

                    this.auth = this.newAuthModel();
                    this.auth.userId = user.user_id;
                    this.auth.client_id = user.client_id;
                    this.auth.isAuthority = user.isAuthority;
                    this.auth.lastAuthItemChangedAt = user.lastAuthItemChangedAt;
                    this.auth.authToken = user.access_token;

                    if (formData) {
                        this.auth.username = formData.username;
                        this.auth.password = this.cryptoProvider.hashPassword(formData.password);
                    }
                    else {
                        this.auth.username = user.username;
                    }

                    this.auth.loginDate = new Date();
                    this.auth.additionalInfo = user.additionalInfo;
                    this.auth.groups = user.groups;
                }

                console.log("user.groups ", user.groups)

                this.auth.save(!!(existUser.length)).then((authSaveResult) => {
                    if (authSaveResult) {
                        this.isLoggedin = true;
                        // create user setting
                        this.createUserSettingsIfNotExists().then((res) => {
                            if (res) {
                                // send a notification to the rest of the app
                                // this.events.publish('user:login', user.user_id);
                                this.miscService.events.next({ TAG: 'user:login', data: user.user_id });
                                this.userService.userDb = res;
                                // console.log('after login this.userService.userDb', this.userService.userDb);
                                resolve(user.user_id);
                                return true;
                            } else {
                                resolve(false);
                                return false;
                            }
                        });
                    } else {
                        resolve(false);
                        return false;
                    }
                });
            });
        });
    }

    /**
     * Creates a new UserDb instance if not exists including a new related UserSetting Object.
     * This instance is only being created if there's not already an existing UserDb instance
     * for the current logged in user id on this device.
     */
    private createUserSettingsIfNotExists(): Promise<any> {
        return new Promise((resolve) => {
            this.newUserModel().findWhere([UserDb.COL_USER_ID, this.auth.userId]).then((user) => {
                if (!user) {
                    user = this.newUserModel();
                    user.userId = this.auth.userId;
                    user.userSetting = new UserSetting();
                    user.userSetting.accessToken = this.auth.authToken;
                    user.save(true).then((res) => resolve(user));
                } else {
                    resolve(user);
                }
            });
        });
    }

    /**
     * Logout the current user. Therefor reset stored pin in the local storage.
     * @returns {Promise<boolean>}
     */
    logout() {
        return new Promise((resolve) => {
            // console.log('logout', this.auth);
            this.auth.loginDate = null;
            this.auth.save(true).then(() => {
                this.isLoggedin = false;
                this.userService.userDb = null;
                // this.events.publish('user:logout');
                this.miscService.events.next({ TAG: 'user:logout' });
                resolve(true);
            });
        });
    }

    /**
     * Ask if a user is logged in
     * @returns {boolean}
     */
    authenticated(): boolean {
        return this.isLoggedin;
    }

    checkUserToken(): Promise<boolean> {
        return new Promise((resolve) => {
            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-CURRENT-DATETIME': new Date().toISOString()
            };
            if (this.auth && this.auth.authToken) {
                headers['X-Auth-Token'] = this.auth.authToken;
            } else {
                resolve(false);
                return;
            }
            const headersObject = new Headers(headers);

            this.http.get(this.appSetting.getApiUrl() + '/login/check', { headers: headersObject }).subscribe(
                (data) => {
                    if (data) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }, (err) => {
                    if (err.status === 0) {
                        // loading.dismiss();
                        resolve(false);
                    } else {
                        // loading.dismiss();
                        resolve(false);
                    }
                }
            );
        });
    }

    /**
     * Check if a user has access to a page
     */
    public checkAccess(pageName?: string): void {
        this.userService.getUser().then(isAuthenticatedUser => {
            if (!isAuthenticatedUser) {
                this.ngZone.run(() => {
                    this.navCtrl.navigateRoot('login').then(() => {
                        this.showToast('validation.You are not authorized.', 'login.Please, login', 'danger');
                    });
                });
            } else {
                let userHaveAcessToPage = true;

                switch (pageName) {
                    case 'protocol':
                        userHaveAcessToPage = this.isHaveUserRole('ProtocolViewer')
                            || this.isHaveUserRole('ProtocolAdmin')
                            || this.auth.isAuthority;
                        break;
                    case 'feedback':
                        userHaveAcessToPage = this.isHaveUserRole('FeedbackViewer') ||
                            this.isHaveUserRole('FeedbackAdmin') ||
                            this.auth.isAuthority;
                        break;
                    case 'guide':
                        userHaveAcessToPage = this.isHaveUserRole('GuiderViewer') || this.auth.isAuthority;
                        break;
                    default:
                        userHaveAcessToPage = true;
                }

                if (!userHaveAcessToPage) {
                    this.ngZone.run(() => {
                        this.navCtrl.navigateRoot('profile');
                    });
                }
            }
        });
    }

    public isHaveUserRoles(): boolean {
        return this.auth && this.auth.additionalInfo && this.auth.additionalInfo.roles;
    }

    public isHaveUserRole(roleName: string): boolean {
        //  console.log(this.auth.additionalInfo)
        return this.isHaveUserRoles() && this.auth.additionalInfo.roles.includes(roleName);
    }

    async showToast(msg?: string, header = '', toastColor?: string) {
        if (!msg) {
            msg = 'Fehler: Keine Verbindung zum Server.';
        }
        const toastOptions = {
            header,
            showCloseButton: true,
            closeButtonText: 'OK',
            message: msg,
            duration: 3000,
            color: toastColor
        };

        const toast = await this.toastCtrl.create(toastOptions);
        await toast.present();
    }

    async presentAlert(header: string, subHeader: string, message: string, buttons: Array<string>) {
        const alert = await this.alertController.create({
            header,
            subHeader,
            message,
            buttons
        });
        await alert.present();
    }

    /**
     * Create a new auth model
     * @returns {AuthDb}
     */
    public newAuthModel(): AuthDb {
        return new AuthDb();
    }

    /**
     * Create a new user model
     * @returns {UserDb}
     */
    public newUserModel(): UserDb {
        return new UserDb();
    }
}
