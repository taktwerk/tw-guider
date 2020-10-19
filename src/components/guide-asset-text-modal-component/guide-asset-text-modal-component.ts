import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GuideAssetModel } from '../../models/db/api/guide-asset-model';
import { Events, ModalController } from '@ionic/angular';
import { GuideAssetService } from '../../providers/api/guide-asset-service';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'guide-asset-text-modal-component',
  templateUrl: 'guide-asset-text-modal-component.html',
})
export class GuideAssetTextModalComponent implements OnInit {
  public asset: GuideAssetModel;

  constructor(
    private modalController: ModalController,
    private events: Events,
    private guideAssetService: GuideAssetService,
    public changeDetectorRef: ChangeDetectorRef
  ) { }

  dismiss() {
    this.modalController.dismiss();
  }

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnInit() {
    this.events.subscribe(this.guideAssetService.dbModelApi.TAG + ':create', (model) => {
      this.asset = model;
      this.detectChanges();
    });
    this.events.subscribe(this.guideAssetService.dbModelApi.TAG + ':update', (model) => {
      this.asset = model;
      this.detectChanges();
    });
  }
}
