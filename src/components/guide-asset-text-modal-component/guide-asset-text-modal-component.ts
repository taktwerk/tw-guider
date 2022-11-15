import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { GuideAssetModel } from 'src/app/database/models/db/api/guide-asset-model';
import { GuideAssetService } from 'src/app/library/providers/api/guide-asset-service';
import { MiscService } from 'src/app/library/services/misc-service';

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
    private storage: Storage,
    //    public miscService: MiscService,
  ) { }

  dismiss() {
    this.modalController.dismiss();
    this.storage.set('GuideAssetTextModalComponentOpen', false)
  }

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  ionViewDidEnter() {
    this.storage.set('GuideAssetTextModalComponentOpen', true)
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
          console.log("event.data for asset", this.asset);
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
