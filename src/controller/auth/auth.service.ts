import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { Auth } from 'src/localServer/models/auth';
import { TranslateConfigService } from '../services/translate-config.service';
import { ToastrService } from '../core/ui/toastr.service';
import { CryptoProvider } from '../core/providers/crypto.provider';
import { StateService } from '../state/state.service';
import { AppSettingService } from '../services/app-setting.service';
import { NavCtrlService } from '../core/ui/nav-ctrl.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new Auth();

  async loadUser() {
    const user = await Auth.findOneBy({user_id: this.stateService.user_id});
    if(user != null) {
      this.user = user;
      if(!this.stateService.synced) {
        this.stateService.isAvailableForSyncData = true;
      }
    }
    return user;
  }

  constructor(private http: HttpClient, private toastr: ToastrService,
    private translateConfigService: TranslateConfigService,
    private appSettingService: AppSettingService,
    private navCtrl: NavCtrlService,
    private stateService: StateService) { }

  async loginByIdentifier(appConfirmUrl: any, type: string, identifier: string) {

    const deviceInfo = await Device.getInfo();
    const ID = await Device.getId();

    if (type === 'client' || type === 'client-default-user') {
      const version = deviceInfo.osVersion;

      if (!version) {
        this.toastr.alert('Missed version number in config', 'Config Error');
        return false;
      }

      appConfirmUrl += 'by-client-identifier?client=' + identifier;

      if (type === 'client-default-user') {
        appConfirmUrl += '&is_login_by_default_user=1';
      }

      else {
        appConfirmUrl += '&device_key=' + ID.uuid +
          '&device_name=' + deviceInfo.model +
          '&version=' + version;
      }
    }

    else if (type === 'user') {
      appConfirmUrl += 'by-user-identifier?user=' + identifier;
    }

    const onSuccess = (data: any) => {
      if (data) {
        this.saveAuthenticatedUser(data);
      }
    };

    const onError = (err: any) => {
      if (err?.error?.error) {
        if (err?.error?.error === 'User was blocked') {
          if (err?.error?.blocked_user_id) {
            Auth.findOneBy({ user_id: err.error.blocked_user_id }).then((user) => {
              if (user) {
                user.password = '';
                user.auth_token = '';
                user.save().then((result: any) => { console.log('Was saved user', (result)); });
              }
            });
          }

          return this.toastr.alert(this.translateConfigService.translateWord('validation.user_blocked'), 'Config Error');
        }
        else if (err?.error?.error === 'The user has no rights to log in') {
          return this.toastr.alert(this.translateConfigService.translateWord('validation.user_cant_login'), 'Config Error');
        }
      }

      return this.toastr.alert('There was an error setting up the application. Please try again.', 'Config Error');
    };

    return this.http.get(appConfirmUrl).subscribe(onSuccess, onError);
  }

  saveAuthenticatedUser(user: any, formData?: any) {

    this.stateService.authToken = user.access_token;

    Auth.findOneBy({ user_id: user.user_id }).then((existUser) => {
      if (existUser) {
        this.user = existUser;
      }
      else {
        this.user = new Auth();
      }

      this.user.user_id = user.user_id;
      this.user.auth_token = user.access_token ?? '';
      this.user.client_id = user.client_id ?? '';
      this.user.last_auth_item_changed_at = user.lastAuthItemChangedAt ?? '';
      this.user.is_authority = user.isAuthority ?? false;

      if (formData) {
        this.user.username = formData.username;
        this.user.password = CryptoProvider.hashPassword(formData.password);
      } else {
        this.user.username = user.username ?? '';
      }

      this.user.login_at = (new Date()).toDateString() ?? '';

      // additonal_info
      this.user.clientName        = user.additionalInfo.clientName;
      this.user.email             = user.additionalInfo.email;
      this.user.fullname          = user.additionalInfo.fullname;
      this.user.last_login_at     = user.additionalInfo.last_login_at;
      this.user.roles             = user.additionalInfo.roles;
      this.user.permissions       = user.additionalInfo.permissions;

      this.user.groups = user.groups ?? '';

      this.user.save().then((authSaveResult) => {
        if (authSaveResult) {
          this.stateService.isLoggedin = true;
          this.stateService.qrCodeSetup = true;
          this.stateService.user_id = user.user_id;
          this.stateService.isAvailableForSyncData = true;
          this.appSettingService.initalAfterLogin(this.user);
          this.navCtrl.goTo('/home/guides');
        }
      });

    });
  }

  isHaveUserRole(roleName: string): boolean {
    return this.user.roles.includes(roleName);
  }

  logout() {
    return new Promise((resolve) => {

      this.user.login_at = '';

      this.user.save().then(() => {
          this.stateService.isLoggedin = false;
          resolve(true);
      });
  });
  }
}
