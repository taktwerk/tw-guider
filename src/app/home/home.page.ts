import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/controller/auth/auth.service';
import { NavCtrlService } from 'src/controller/core/ui/nav-ctrl.service';
import { StateService } from 'src/controller/state/state.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  appPages: Array<{ url: string, icon: string, title: string, condition: any }> = [
    { title: 'login.Login', url: '/login', icon: 'person', condition: () => !this.stateService.isLoggedin && this.stateService.qrCodeSetup },
    { title: 'start.header', url: '/home/start', icon: 'home', condition: () => !this.stateService.qrCodeSetup || !this.stateService.isLoggedin },
    { title: 'guides.header', url: '/home/guides', icon: 'move', condition: () => this.authService.isHaveUserRole('GuiderViewer') || this.authService.user.is_authority },
    { title: 'feedback.header', url: '/home/feedback', icon: 'chatbox', condition: () => this.authService.isHaveUserRole('FeedbackViewer') || this.authService.user.is_authority },
    { title: 'protocol.Protocols', url: '/home/protocol', icon: 'list', condition: () => this.authService.isHaveUserRole('ProtocolViewer') || this.authService.user.is_authority },
    { title: 'guider.header', url: '/home/guidecapture', icon: 'camera', condition: () => (this.authService.isHaveUserRole('GuiderAdmin') && this.authService.isHaveUserRole('Betatest')) || this.authService.user.is_authority },
    { title: 'profile.Profile', url: '/home/profile', icon: 'person', condition: () => this.stateService.isLoggedin },
    { title: 'about.header', url: '/home/about', icon: 'information-circle', condition: () => true },
    { title: 'log.header', url: '/home/logs', icon: 'hourglass', condition: () => true },
  ];

  constructor(private stateService: StateService, private authService: AuthService, private navCtrl: NavCtrlService, private menu: MenuController) {
    if (this.stateService.isLoggedin) {
      this.loadUser();
    } else {
      this.navCtrl.goTo('/home/start')
    }
  }

  async loadUser() {
    const user = await this.authService.loadUser();
    if (user) {
      this.navCtrl.goTo('/home/guides')
    } else {
      this.navCtrl.goTo('/home/start')
    }
  }


  async openSyncModal() {
    this.menu.close();
    setTimeout(() => {
      this.navCtrl.goTo('/sync-model', null, 'root');
    }, 100);
  }
}
