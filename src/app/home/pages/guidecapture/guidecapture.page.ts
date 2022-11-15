import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GuideCategoryModel } from 'src/app/database/models/db/api/guide-category-model';
import { GuiderModel } from 'src/app/database/models/db/api/guider-model';
import { GuideCategoryService } from 'src/app/library/providers/api/guide-category-service';
import { GuideChildService } from 'src/app/library/providers/api/guide-child-service';
import { GuiderService } from 'src/app/library/providers/api/guider-service';
import { SyncIndexService } from 'src/app/library/providers/api/sync-index-service';
import { AuthService } from 'src/app/library/services/auth-service';
import { MiscService } from 'src/app/library/services/misc-service';

@Component({
  selector: 'app-guidecapture',
  templateUrl: './guidecapture.page.html',
  styleUrls: ['./guidecapture.page.scss'],
})
export class GuidecapturePage implements OnInit, OnDestroy {
  public guideCategories: GuideCategoryModel[] = [];
  public searchValue: string;
  public haveProtocolPermissions = false;
  public isLoadedContent = false;
  public guides: GuiderModel[] = [];
  public guideItemsLimit = 20;
  public params;

  public items: Array<{ title: string; note: string; icon: string }> = [];
  public type: string;

  eventSubscription: Subscription;

  constructor(
    private guideCategoryService: GuideCategoryService,
    private guiderService: GuiderService,
    private guideChildService: GuideChildService,
    public authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
    private loader: LoadingController,
    private miscService: MiscService,
    private syncIndexService: SyncIndexService,
  ) {
    this.authService.checkAccess('guide');
    this.showAllGuides();
  }

  async showAllGuides() {
    const loader = await this.loader.create();
    loader.present();
    await this.setGuides();
    loader.dismiss();
    this.isLoadedContent = true;
  }

  async setGuides() {
    const _guides = await this.guideCategoryService.getGuides();
    if (_guides.length > 0) {
      const syncedList = await this.syncIndexService.getSyncIndexModel(_guides, _guides[0].TABLE_NAME);
      this.guides = syncedList;
    }
  }

  async searchGuides($event) {
    this.searchValue = $event.detail.value;
    const _guides = await this.guideCategoryService.getGuides(null, this.searchValue);
    const syncedList = await this.syncIndexService.getSyncIndexModel(_guides, _guides[0].TABLE_NAME);
    this.guides = syncedList;
  }

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnInit() {
    this.eventSubscription = this.miscService.events.subscribe(async (event) => {
      switch (event.TAG) {
        case this.guiderService.dbModelApi.TAG + ':update':
          this.setGuides();
          this.detectChanges();
          break;
        case this.guiderService.dbModelApi.TAG + ':create':
          this.setGuides();
          this.detectChanges();
          break;
        case this.guiderService.dbModelApi.TAG + ':delete':
          this.setGuides();
          this.detectChanges();
          break;
        case this.guiderService.dbModelApi.TAG + ':delete'
          || this.guideChildService.dbModelApi.TAG + ':update'
          || this.guideChildService.dbModelApi.TAG + ':delete'
          || this.guideChildService.dbModelApi.TAG + ':create':
          this.setGuides();
          this.detectChanges();
          break;
        case 'network:online':
          this.authService.checkAccess('guide');
          break;
        default:
      }
    })
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}


