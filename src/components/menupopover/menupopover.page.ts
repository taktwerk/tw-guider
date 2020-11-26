import { GuideinfoPage } from 'src/components/guideinfo/guideinfo.page';
import { ModalController, NavParams } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ApiSync } from 'src/providers/api-sync';

@Component({
  selector: 'app-menupopover',
  templateUrl: './menupopover.page.html',
  styleUrls: ['./menupopover.page.scss'],
})
export class MenuPopoverComponent implements OnInit {
  guideId;
  constructor(
    private apiSync: ApiSync,
    private modalController: ModalController,
    public navParams: NavParams
  ) {
    this.guideId = this.navParams.get('guideId');
  }

  ngOnInit() { }

  async presentGuideInfo() {
    const modal = await this.modalController.create({
      component: GuideinfoPage,
      componentProps: {
        'guideId': this.guideId
      },
      cssClass: "modal-fullscreen"
    });
    return await modal.present();
  }

  async restartSlide(ev: any) {
    
   }
}
