import { ApiSync } from './../../providers/api-sync';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { GuiderModel } from 'src/models/db/api/guider-model';
import { GuiderService } from 'src/providers/api/guider-service';

@Component({
  selector: 'app-guideinfo',
  templateUrl: './guideinfo.page.html',
  styleUrls: ['./guideinfo.page.scss'],
})
export class GuideinfoPage implements OnInit {
  @Input() guideId: any;
  guide: GuiderModel
  public params;

  constructor(public modalController: ModalController, private guiderService: GuiderService, private router: Router, private apiSync: ApiSync) { }

  async ngOnInit() {
    const guiderById = await this.guiderService.getById(this.guideId)
    if (guiderById.length) {
      this.guide = guiderById[0];
      console.log("Guide from api >>>>>>>>>>>>>>>>>>>>>>>>>")
      console.log(this.guide)
    }
  }

  dismiss() {
    this.modalController.dismiss({ 'dismissed': true, 'guideId': this.guideId });
    // this.router.navigate(['/guide/' + this.guide.idApi]);
  }
}
