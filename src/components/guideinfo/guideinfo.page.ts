import { Component, Input, OnInit } from '@angular/core';
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

  constructor(public modalController: ModalController, private guiderService: GuiderService,
  ) { }

  async ngOnInit() {
    const guiderById = await this.guiderService.getById(this.guideId)
    if (guiderById.length) {
      this.guide = guiderById[0];
    }
  }

  dismiss() {
    this.modalController.dismiss({ 'dismissed': true });
  }
}
