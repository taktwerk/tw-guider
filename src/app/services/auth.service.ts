import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
      private http: HTTP
  ) { }


    public login(url: string) {
        return this.http.get(url, {
          responseType: 'json'
        }, {});
    }

}
