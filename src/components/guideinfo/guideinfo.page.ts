import { ApiSync } from './../../providers/api-sync';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { GuiderModel } from '../../models/db/api/guider-model';
import { GuiderService } from '../../providers/api/guider-service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-guideinfo',
  templateUrl: './guideinfo.page.html',
  styleUrls: ['./guideinfo.page.scss'],
})
export class GuideinfoPage implements OnInit {
  @Input() guideId: any;
  @Input() from: any;
  @Input() parentCollectionId: any;
  @Input() guideCategoryId;

  guide: GuiderModel
  public params;

  constructor(
    public platform: Platform,
    private storage: Storage,

    public modalController: ModalController, private guiderService: GuiderService, private router: Router, private apiSync: ApiSync) { }

  async ngOnInit() {
    const guiderById = await this.guiderService.getById(this.guideId)
    if (guiderById.length) {
      this.guide = guiderById[0];
    }
  }

  ionViewDidEnter() {
    this.storage.set('guideInfoModalOpen', true)
  }

  dismiss() {
    this.modalController.dismiss();
    this.storage.set('guideInfoModalOpen', false)
  }

  onDismiss() {
    this.from === 'guide-list-component' ? this.openGuide(this.guide) : this.dismiss();
  }

  openCollection(guide: GuiderModel) {
    const feedbackNavigationExtras: NavigationExtras = {
      queryParams: {
        guideId: guide.idApi,
        guideCategoryId: this.guideCategoryId
      },
    };
    this.router.navigate(['/guide-collection/' + guide.idApi], feedbackNavigationExtras);
  }

  openGuide(guide: GuiderModel) {
    if (guide.guide_collection.length) {
      this.openCollection(guide);
      return;
    }
    // console.log("parentCollectionId", this.parentCollectionId)
    if (this.parentCollectionId) {
      this.router.navigate(['/guide/' + guide.idApi + '/' + this.parentCollectionId]);
    }
    else {
      this.router.navigate(['/guide/' + guide.idApi]);
    }
    this.dismiss();
  }

}


