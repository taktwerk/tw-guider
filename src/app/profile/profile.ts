import {Component} from '@angular/core';
import {Events, NavController} from '@ionic/angular';
import {AuthService} from '../../services/auth-service';


/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
        constructor(
            public navCtrl: NavController,
            public authService: AuthService,
            public events: Events,
    ) {
            this.authService.checkAccess();
    }
}
