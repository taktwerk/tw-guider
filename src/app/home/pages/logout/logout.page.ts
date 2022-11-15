import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'app/library/services/auth-service';
import { HttpClient } from 'app/library/services/http-client';

@Component({
  selector: 'page-logout',
  templateUrl: 'logout.page.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController,
              public http: HttpClient,
              public authService: AuthService) {
      this.authService.logout().then(data => {
        this.navCtrl.navigateRoot('/login');
        this.http.showToast('login.You are logged out.');
      });
  }
}
