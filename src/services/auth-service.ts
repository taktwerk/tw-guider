import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders as Headers, HttpHeaders} from '@angular/common/http';
import {AppSetting} from './app-setting';
import {Platform, LoadingController} from '@ionic/angular';
import {DbProvider} from '../providers/db-provider';
import {AuthDb} from '../models/db/auth-db';
import {UserDb} from '../models/db/user-db';
import {UserSetting} from '../models/user-setting';
import { Events, NavController } from '@ionic/angular';
import {DownloadService} from './download-service';
import {CryptoProvider} from '../providers/crypto-provider';



@Injectable()
export class AuthService {
    /** AuthDb instance that holds the login data and is stored in the local sql lite db */
    public auth: AuthDb;
    /** successful auth state info */
    public isLoggedin: boolean;

    /** app is initialized **/
    public isInitialized: boolean = false;

    /** is currently a dummy user */
    public isDummy: boolean;

    static STATE_ERROR_INVALID_LOGIN: number = -1;
    static STATE_ERROR_NETWORK: number = -2;

    /**
     * Auth Service
     * @param http
     * @param platform
     * @param dbProvider
     * @param loadingController
     * @param events
     * @param downloadService
     * @param navCtrl
     * @param cryptoProvider
     */
    constructor(private http: HttpClient,
                public platform: Platform,
                public dbProvider: DbProvider,
                public loadingController: LoadingController,
                public events: Events,
                public downloadService: DownloadService,
                public navCtrl: NavController,
                public cryptoProvider: CryptoProvider
    ) {
        // Create a tmp user until everything has properly been loaded
        this.auth = this.newAuthModel();
        this.auth.userId = 0;
    }

    /**
     * Authentificate the last logged in user
     * @returns {Promise<T>}
     */
    authenticateLastUser(user: AuthDb): Promise<any> {
        return new Promise(resolve => {
            if (user) {
                console.log('AuthService', 'Try to log in last user', user);
                this.authenticate({username: user.username, password: user.password}).then((res) => {
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

    offlineAuthenticate(formData: any): Promise<any> {
        return new Promise((resolve) => {
            this.auth.findFirst(['username', '"' + formData.username + '"'], 'user_id DESC').then((result) => {
                if (!result || !result[0]) {
                    resolve(false);
                    return;
                }
                const user = result[0];
                this.cryptoProvider.deriveAesKey(formData.password);
                const decryptedPassword = this.cryptoProvider.makeDecrypt(user.password);
                if (decryptedPassword !== formData.password) {
                    resolve(false);
                    return;
                }
                user.loginDate = new Date();
                user.save(true).then((authSaveResult) => {
                    if (authSaveResult) {
                        this.isLoggedin = true;
                        // create user setting
                        this.createUserSettingsIfNotExists().then((res) => {
                            if (res) {
                                // send a notification to the rest of the app
                                this.events.publish('user:login', user.userId);
                                resolve(user.userId);
                                return;
                            } else {
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

    /**
     * Tries to authenticate with a given pin and returns whether the authentification was successful or not.
     * @param pin
     * @returns {Promise<boolean>}
     */
    authenticate(formData: any): Promise<any> {
        const creds = `username=${formData.username}&password=${formData.password}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        return new Promise((resolve) => {
            this.http.get<any>(AppSetting.API_URL + '/login?' + creds, {headers}).subscribe(
                (data) => {
                    if (data) {
                        let user = data;

                        const findAuthModel = this.newAuthModel();
                        findAuthModel.findFirst(['user_id', user.user_id], 'login_at DESC').then((existUser) => {
                           if (existUser.length) {
                               this.auth = existUser[0];
                               this.auth.authToken = user.access_token;
                               this.auth.password = this.cryptoProvider.makeEncrypt(formData.password);
                               this.auth.loginDate = new Date();
                           } else {
                               this.auth = this.newAuthModel();
                               this.auth.userId = user.user_id;
                               this.auth.authToken = user.access_token;
                               this.auth.username = formData.username;
                               this.auth.password = this.cryptoProvider.makeEncrypt(formData.password);
                               this.auth.loginDate = new Date();
                           }
                           this.auth.save(!!(existUser.length)).then((authSaveResult) => {
                               if (authSaveResult) {
                                   this.isLoggedin = true;
                                   // create user setting
                                   this.createUserSettingsIfNotExists().then((res) => {
                                       if (res) {
                                           // send a notification to the rest of the app
                                           this.events.publish('user:login', user.user_id);
                                            resolve(user.user_id);
                                        } else {
                                            resolve(false);
                                        }
                                    });
                                } else {
                                    // User creation error?
                                    resolve(false);
                                }
                            });
                        });
                        // save auth in local db
                    }
                }, (err) => {
                    if (err.status === 0) {
                        // loading.dismiss();
                        resolve(AuthService.STATE_ERROR_NETWORK);
                    } else {
                        // loading.dismiss();
                        resolve(AuthService.STATE_ERROR_INVALID_LOGIN);
                    }
                }
            );
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
                    const user = this.newUserModel();
                    user.userId = this.auth.userId;
                    user.userSetting = new UserSetting();
                    user.userSetting.accessToken = this.auth.authToken;
                    user.save(true).then((res) => resolve(res));
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
            this.auth.loginDate = null;
            this.auth.save(true).then((res) => {
                console.log('AuthService', 'logout', 'user loggin out');
                this.isLoggedin = false;
                this.events.publish('user:logout');
                if (res) {
                    console.log('successfully reset auths in local db');
                }
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

    /**
     * Check if a user has access to a page
     */
    public checkAccess(): void {
        this.getLastUser().then(isAuthenticatedUser => {
            if (!isAuthenticatedUser) {
                this.navCtrl.navigateRoot('home');
            }
        });
    }

    /**
     * Create a new auth model
     * @returns {AuthDb}
     */
    public newAuthModel(): AuthDb {
        return new AuthDb(this.platform, this.dbProvider, this.events, this.downloadService);
    }

    /**
     * Create a new user model
     * @returns {UserDb}
     */
    public newUserModel(): UserDb {
        return new UserDb(this.platform, this.dbProvider, this.events, this.downloadService);
    }
}
