import { Injectable } from '@angular/core';
import { NavigationRouteService } from '../services/navigation-route/navigation-route.service';
import { RequestService } from '../utility/handler/request.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../app/models/User.model';
import { StateService } from '../app/data/state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  site: any;
  user: User | null = null;

  constructor(private toastr: ToastrService, private stateService: StateService,
    private requestService: RequestService, private navCtrl: NavigationRouteService) {
  }

  isLoggedIn(): Promise<boolean> {
    return Promise.resolve(this.stateService.hasLoggedIn);
  }

  setLoggedIn(value: any) {
    this.user = new User();
    this.user.set(value, true);
    this.stateService.token = value.token;
    this.stateService.hasLoggedIn = true;
    this.stateService.userID = value.user_id;
    this.stateService.role = value.role;
    this.stateService.baseScenario = this.stateService.default.baseScenario;
  }

  logout() {
    document.cookie.split(';').forEach(function (c) {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    const pls = localStorage.getItem("user_pl");
    localStorage.clear();
    localStorage.setItem("user_pl", pls);

    this.navCtrl.goTo('/auth', {}, 'root');
  }

  async login(user: any) {
    const success = (value: any) => {
      if (value.status !== 200) {
        this.toastr.error(value.message);
      } else if (value.token) {
        this.setLoggedIn(value);
        this.toastr.success(value.message);
        this.navCtrl.goTo('/home', {}, 'root');
      } else {
        this.toastr.error(value.message);
      }
    };
    this.requestService.send('login', user, success);
  }
}
