import {Injectable} from '@angular/core';
import {HttpClient as Http, HttpHeaders as Headers, HttpResponse as Response} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import {AuthService} from './auth-service';
import { Observable } from 'rxjs/Observable';
import {ToastController} from '@ionic/angular';

@Injectable()
export class HttpClient {
  headers: Headers = null;

  constructor(
      private http: Http,
      private authService: AuthService,
      public toastCtrl: ToastController) {
    this.initHeaders();
  }

  previousToast = null;

    /**
     * Init the headers
     */
  public initHeaders() {
      // if (this.headers === null) {
        let headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'X-CURRENT-DATETIME': new Date().toISOString()
        };
        if (this.authService.auth && this.authService.auth.authToken) {
            headers['X-Auth-Token'] = this.getAuthorizationToken();
        }
        this.headers = new Headers(headers);
  }

    /**
     * Add the Auth stuff. Always remove the previous one in case we switched users.
     */
  public addAuthorizationHeader() {
      console.log('addAuthorizationHeader', this.headers.keys());
      if (this.headers.has('X-Auth-Token')) {
          this.headers.delete('X-Auth-Token');
      }

      this.headers.delete('Access-Control-Allow-Origin');
      this.headers.append('Access-Control-Allow-Origin', '*');

      console.log('this.authService.auth', !!(this.authService.auth && this.authService.auth.authToken));
      if (this.authService.auth && this.authService.auth.authToken) {
          console.log('in condition', this.getAuthorizationToken());
          this.headers.set('X-Auth-Token', this.getAuthorizationToken());
          console.log('HttpClient', 'X-Auth-Token', this.headers.get('X-Auth-Token'));
      }
  }

    /**
     *
     * @returns {string}
     */
  public getAuthorizationToken() {
      return this.authService.auth.authToken;
  }

    /**
     * Add the current datetime. Always remove the previous one set to be accurate.
     */
  public addDateTimeHeader() {
      if (this.headers.has('X-CURRENT-DATETIME')) {
          this.headers.delete('X-CURRENT-DATETIME');
      }
      this.headers.append('X-CURRENT-DATETIME', new Date().toISOString());
  }

  get(url): Observable<any> {
    this.initHeaders();
    console.log('HttpClient', 'Call URL', url);
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
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
        console.log('errrorrr', error);
      // try {
      //   const body = error.json() || '';
      //   const err = body.error || JSON.stringify(body);
      //   errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      // } catch (e) {
      //   errMsg = error.text();
      // }
    } else {
      if (error.status === 401) {
          this.showToast('You are not authorized.', 'Please, login', 'danger');
      } else {
          errMsg = error.message ? error.message : error.toString();
          this.showToast(errMsg, 'header', 'danger');
      }
    }

    return Promise.reject(errMsg);
  }

  showToast(msg?: string, header = '' , toastColor?: string) {
    console.log('showToast', header);
    if (!msg) {
        msg = 'Fehler: Keine Verbindung zum Server.';
    }
    let toastOptions = {
        header: header,
        showCloseButton: true,
        closeButtonText: 'OK',
        message: msg,
        duration: 3000,
        color: toastColor
    };

    this.toastCtrl.create(toastOptions).then((toast) => {
        toast.present().then(() => {
            this.previousToast.dismiss();
            this.previousToast = toast;
        });
        this.previousToast = toast;
    });
  }
}
