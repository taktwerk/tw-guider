import {Injectable} from '@angular/core';
import {HttpClient as Http, HttpHeaders as Headers, HttpResponse as Response} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import {AuthService} from './auth-service';
import { Observable } from 'rxjs/Observable';
import {NavController, Platform, ToastController} from '@ionic/angular';
import {TranslateConfigService} from './translate-config.service';
import { Device } from '@ionic-native/device/ngx';
import {Network} from '@ionic-native/network/ngx';

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
      private device: Device,
      private network: Network
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
        'X-CURRENT-DATETIME': this.getCurrentDateTime()
    };
    if (this.authService.auth && this.authService.auth.authToken) {
        headers['X-Auth-Token'] = this.getAuthorizationToken();
        /// send current device info with uuid and etc.
        headers['X-Device-Info'] = JSON.stringify(this.deviceInfo);
    }
    this.headers = new Headers(headers);
  }

  public getCurrentDateTime() {
      let timezone_offset_min = new Date().getTimezoneOffset();
      let offset_hrs = parseInt(String(Math.abs(timezone_offset_min / 60)));
      let offset_min = Math.abs(timezone_offset_min % 60);
      let timezone_standard = '';

      const offsetMinString = offset_min < 10 ? '0' + offset_min : '' + offset_min;
      const offsetHrsString = offset_hrs < 10 ? '0' + offset_hrs : '' + offset_hrs;
      if (timezone_offset_min < 0) {
          timezone_standard = '+' + offsetHrsString + ':' + offsetMinString;
      } else if (timezone_offset_min > 0) {
          timezone_standard = '-' + offsetHrsString + ':' + offsetMinString;
      } else if (timezone_offset_min === 0) {
          timezone_standard = 'Z';
      }

      let dt = new Date(),
          current_date = dt.getDate(),
          current_month = dt.getMonth() + 1,
          current_hrs = dt.getHours(),
          current_mins = dt.getMinutes(),
          current_secs = dt.getSeconds();
      const currentDate = current_date < 10 ? '0' + current_date : '' + current_date;
      const currentMonth = current_month < 10 ? '0' + current_month : '' + current_month;
      const currentHrs = current_hrs < 10 ? '0' + current_hrs : '' + current_hrs;
      const currentMins = current_mins < 10 ? '0' + current_mins : '' + current_mins;
      const currentSecs = current_secs < 10 ? '0' + current_secs : '' + current_secs;
      const currentDatetime = dt.getFullYear() + '-' + currentMonth + '-' + currentDate + 'T' + currentHrs + ':' + currentMins + ':' + currentSecs;

      return currentDatetime + timezone_standard;
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
    if (this.network.type === 'none') {
        console.log('no network');
    } else if (error instanceof Response) {
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
          console.log('errMsg', error);
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
