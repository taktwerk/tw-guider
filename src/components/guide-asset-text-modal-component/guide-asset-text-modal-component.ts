import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { GuideAssetModel } from '../../models/db/api/guide-asset-model';
import { ModalController } from '@ionic/angular';
import { GuideAssetService } from '../../providers/api/guide-asset-service';
import { Subscription } from 'rxjs';
import { MiscService } from 'src/services/misc-service';

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
export class GuideAssetTextModalComponent implements OnInit, OnDestroy {
  public asset: GuideAssetModel;
  eventSubscription: Subscription;

  constructor(
    private modalController: ModalController,
    private guideAssetService: GuideAssetService,
    public changeDetectorRef: ChangeDetectorRef,
    private miscService: MiscService,
    //    public miscService: MiscService,
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
    // this.events.subscribe(this.guideAssetService.dbModelApi.TAG + ':create', (model) => {
    //   this.asset = model;
    //   this.detectChanges();
    // });
    // this.events.subscribe(this.guideAssetService.dbModelApi.TAG + ':update', (model) => {
    //   this.asset = model;
    //   this.detectChanges();
    // });

    this.eventSubscription = this.miscService.events.subscribe(async (event) => {
      switch (event.TAG) {
        case this.guideAssetService.dbModelApi.TAG + ':create':
        case this.guideAssetService.dbModelApi.TAG + ':update':
          this.asset = event.data;
          this.detectChanges();
          break;
        default:
      }
    });
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
