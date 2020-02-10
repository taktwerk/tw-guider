import {Injectable} from '@angular/core';
import {HttpClient as Http, HttpHeaders as Headers, HttpResponse as Response} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import {AuthService} from './auth-service';
import { Observable } from 'rxjs/Observable';
import {NavController, Platform, ToastController} from '@ionic/angular';
import {TranslateConfigService} from './translate-config.service';
import { Device } from '@ionic-native/device/ngx';

@Injectable()
export class HttpClient {
  headers: Headers = null;

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
      public toastCtrl: ToastController,
      public navCtrl: NavController,
      private translateConfigService: TranslateConfigService,
      private device: Device
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
          this.initHeaders();
      });
  }

  previousToast = null;

    /**
     * Init the headers
     */
  public initHeaders() {
    let headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-CURRENT-DATETIME': new Date().toISOString()
    };
    if (this.authService.auth && this.authService.auth.authToken) {
        headers['X-Auth-Token'] = this.getAuthorizationToken();
        /// send current device info with uuid and etc.
        headers['X-Device-Info'] = JSON.stringify(this.deviceInfo);
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
    }).catch(error => this.handleError(error));
  }

  post(url, data): Observable<any> {
    this.initHeaders();
    return this.http.post(url, data, {
      headers: this.headers
    }).catch(error => this.handleError(error));
  }

  private handleError(error: any) {
    let errMsg: string;
    if (error instanceof Response) {
        console.log('errrorrr', error);
    } else {
      if (error.status === 401) {
          this.authService.logout().then(() => {
              this.navCtrl.navigateRoot('/login').then(() => {
                  this.showToast(
                      'validation.You are not authorized.',
                      'login.Please, login',
                      'danger'
                  );
              });
          });
      } else {
          errMsg = error.message ? error.message : error.toString();
          this.showToast(errMsg, '', 'danger');
      }
    }

    return Promise.reject(errMsg);
  }

  async showToast(msg?: string, header?: string , toastColor?: string, withLocalization: boolean = true) {
    if (!msg) {
        msg = 'Fehler: Keine Verbindung zum Server.';
    }
    if (withLocalization) {
        msg = await this.translateConfigService.translate(msg);
        if (header) {
            header = await this.translateConfigService.translate(header);
        }
    }

    const toastOptions = {
        header: header,
        showCloseButton: true,
        closeButtonText: 'OK',
        message: msg,
        duration: 3000,
        color: toastColor
    };

    this.toastCtrl.create(toastOptions).then((toast) => {
        if (this.previousToast) {
            this.previousToast.dismiss();
        }

        toast.present().then(() => {
            this.previousToast = toast;
        });
        this.previousToast = toast;
    });
  }
}
