import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '../../services/http-client';

/**
 * Generated class for the LogoutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.page.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController,
              public http: HttpClient,
              public authService: AuthService) {
      this.authService.checkAccess();
      this.authService.logout().then(data => {
        this.navCtrl.navigateRoot('/home');
        this.http.showToast('You are logged out.');
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutPage');
  }

}
