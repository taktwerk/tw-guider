import { Component, OnInit } from '@angular/core';
import { SyncModalComponent } from 'src/app/components/sync-modal-component/sync-modal-component';
import { AuthService } from 'src/controller/auth/auth.service';
import { NavCtrlService } from 'src/controller/core/ui/nav-ctrl.service';
import { SyncService } from 'src/controller/services/sync.service';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.scss'],
})
export class GuidesComponent implements OnInit {

  selectedTab = 'activity';

  searchValue: string = '';

  guideActivity: any[] = [];
  guideCategories: any[] = [];
  guidesWithoutCategories: any[] = [];
  guides: any[] = [];

  guideItemsLimit = 20;

  constructor(private navCtrl: NavCtrlService) { }

  ngOnInit() {

  }

  async segmentChanged(e: any) {
    if (e.detail.value === 'activity') {
      // await this.showAllActivity();
    }
    else if (e.detail.value === 'browse') {
      // await this.showAllGuides();
    }
    else if (e.detail.value === 'search') {
      // await this.setGuides();
    }
  }

  openGuide(guideStep: any) {

  }

  syncData() {
    this.navCtrl.popup(SyncModalComponent);
  }

  async searchGuides($event: any) {

  }
}
