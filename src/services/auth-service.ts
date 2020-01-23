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
     */
    constructor(private http: HttpClient,
                public platform: Platform,
                public dbProvider: DbProvider,
                public loadingController: LoadingController,
                public events: Events,
                public downloadService: DownloadService,
                public navCtrl: NavController
    ) {
        // Create a tmp user until everything has properly been loaded
        this.auth = this.newAuthModel();
        this.auth.userId = 0;
    }

    /**
     * Create a dummy user for API calls
     * @returns {Promise<T>}
     */
    public createDummyUser(): Promise<any> {
        // Do we really need a dummy user if we already have one?
        let user = this.newUserModel();
        user.userId = 1;
        user.userSetting = new UserSetting();

        return new Promise((resolve) => {
            user.save().then(() => {
                let auth = this.newAuthModel();
                auth.userId = 1;
                auth.authToken = '123123';
                auth.username = '123123';
                // auth.password = '123123';
                return auth.save().then(() => {
                    resolve(true);
                }, (err) => {
                    resolve(false);
                });
            }, (err) => {
                resolve(false);
            });
        });
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
     * Checks if a user can view a page.
     * @returns {boolean}
     */
    // canViewPage(): boolean {
    //     return this.isInitialized && this.isLoggedin;
    // }

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
     * @param pin
     * @returns {Promise<boolean>}
     */
    authenticate(formData: any): Promise<any> {
        const creds = `username=${formData.username}&password=${formData.password}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': ['*'],
        });

        return new Promise((resolve) => {
            this.http.get<any>(AppSetting.API_URL + '/login?' + creds, {headers}).subscribe(
                (data) => {
                    console.log('data of the http get', data);
                    if (data) {
                        const user = data;
                        console.log('user', user);
                        console.log('AuthService', 'Logged in user', user);
                        if (!this.auth) {
                            this.auth = this.newAuthModel();
                        }
                        this.auth.userId = user.user_id;
                        this.auth.authToken = user.access_token;
                        this.auth.username = formData.username;
                        // this.auth.password = formData.password;
                        this.auth.loginDate = new Date();
                        // save auth in local db
                        this.auth.save(true).then((authSaveResult) => {
                            if (authSaveResult) {
                                this.isLoggedin = true;
                                // create user setting
                                this.createUserSettingsIfNotExists().then((res) => {
                                    if (res) {
                                        // send a notification to the rest of the app
                                        this.events.publish('user:login', user.user_id);

                                        // return successful login state
                                        // if (loading) {
                                        //     loading.dismiss();
                                        // }

                                        console.log('AuthService', 'User could be logged in', this.auth);

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
            this.auth.removeAll().then((res) => {
                console.log('AuthService', 'logout', 'user loggin out');
                this.auth = this.newAuthModel();
                this.isLoggedin = false;
                this.events.publish('user:logout');
                if (res) {
                    console.log('successfully reset auths in local db');
                }
                resolve(res);
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
