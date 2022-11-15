import { GuideinfoPage } from '../../components/guideinfo/guideinfo.page';
import { ModalController, NavParams, PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ApiSync } from 'app/library/providers/api-sync';
import { MiscService } from 'app/library/services/misc-service';

@Component({
  selector: 'app-menupopover',
  templateUrl: './menupopover.page.html',
  styleUrls: ['./menupopover.page.scss'],
})
export class MenuPopoverComponent implements OnInit {
  guideId;
  params;
  constructor(
    private apiSync: ApiSync,
    private modalController: ModalController,
    public navParams: NavParams,
    private miscService: MiscService,
    private popoverController: PopoverController,
  ) {
    this.guideId = this.navParams.get('guideId');
  }

  ngOnInit() { }

  async presentGuideInfo() {
    const modal = await this.modalController.create({
      component: GuideinfoPage,
      componentProps: {
        guideId: this.guideId
      },
      cssClass: 'modal-fullscreen'
    });
    this.popoverController.dismiss();
    return await modal.present();
  }

  async restartSlide(ev: any) {
    console.log('check eventt', ev);
    this.miscService.onSlideRestart.next(true);
    this.popoverController.dismiss();
  }
}
