import { UserService } from './../../services/user-service';

import { MiscService } from './../../services/misc-service';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { GuideCategoryService } from '../../providers/api/guide-category-service';
import { GuideChildService } from '../../providers/api/guide-child-service';
import { GuiderService } from '../../providers/api/guider-service';
import { GuiderModel } from '../../models/db/api/guider-model';
import { AuthService } from '../../services/auth-service';
import { GuideCategoryModel } from '../../models/db/api/guide-category-model';
import { LoadingController, ModalController } from '@ionic/angular';
import { GuideCategoryBindingService } from '../../providers/api/guide-category-binding-service';
import { NavigationExtras, Router } from '@angular/router';
import { ApiSync } from 'src/providers/api-sync';
import { AppSetting } from 'src/services/app-setting';
import { SyncMode } from 'src/components/synchronization-component/synchronization-component';
import { SyncService } from 'src/services/sync-service';
import { SyncModalComponent } from 'src/components/sync-modal-component/sync-modal-component';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SyncIndexService } from 'src/providers/api/sync-index-service';

@Component({
  selector: 'app-list',
  templateUrl: 'categories-list.page.html',
  styleUrls: ['categories-list.page.scss']
})
export class CategoriesListPage implements OnInit, OnDestroy {
  public isStartSync = false;
  public iconStatus: string = 'unsynced';

  public modeSync = SyncMode.Manual;
  public syncProgressStatus = 'not_sync';

  public guideCategories: GuideCategoryModel[] = [];
  public searchValue: string;
  public haveProtocolPermissions = false;
  public isLoadedContent = false;
  public guides: GuiderModel[] = [];
  public guideItemsLimit = 20;
  public guidesWithoutCategories: GuiderModel[] = [];
  public params;

  public items: Array<{ title: string; note: string; icon: string }> = [];

  public type: string;

  onboardingSyncShown: boolean;

  eventSubscription: Subscription;

  constructor(
    private guideCategoryBindingService: GuideCategoryBindingService,
    private guideCategoryService: GuideCategoryService,
    private guiderService: GuiderService,
    private guideChildService: GuideChildService,
    public authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private loader: LoadingController,
    public apiSync: ApiSync,
    public appSetting: AppSetting,
    private syncService: SyncService,
    private modalController: ModalController,
    private miscService: MiscService,
    private userService: UserService,
    private syncIndexService: SyncIndexService,

  ) {
    this.authService.checkAccess('guide');
    if (this.authService.auth && this.authService.auth.additionalInfo && this.authService.auth.additionalInfo.roles) {
      if (this.authService.auth.additionalInfo.roles.includes('ProtocolViewer') ||
        this.authService.auth.isAuthority
      ) {
        this.haveProtocolPermissions = true;
      }
    }
    this.showAllGuides();
  }

  async showAllGuides() {
    const loader = await this.loader.create();
    loader.present();
    await this.findAllGuideCategories();
    await this.setGuides();
    loader.dismiss();
    this.isLoadedContent = true;
  }

  async searchGuides($event) {
    this.searchValue = $event.detail.value;
    this.setGuides();
  }

  async setGuides() {
    // syncIndexify guides
    const _guides = await this.guideCategoryService.getGuides(null, this.searchValue);
    if (_guides.length > 0) {
      const syncedList = await this.syncIndexService.getSyncIndexModel(_guides, _guides[0].TABLE_NAME);
      this.guides = syncedList;
    }

    // syncIndexify guidesWithoutCategories
    const _guidesWithoutCategories = await this.guideCategoryService.getGuides(null, '', true);
    if (_guidesWithoutCategories.length > 0) {
      const syncedList_guidesWithoutCategories = await this.syncIndexService.getSyncIndexModel(_guidesWithoutCategories, _guidesWithoutCategories[0].TABLE_NAME);
      this.guidesWithoutCategories = syncedList_guidesWithoutCategories;
      console.log("guidesWithoutCategorie", this.guidesWithoutCategories);
    }
  }

  async findAllGuideCategories() {
    // syncIndexify guideCategories
    const _guideCategories = await this.guideCategoryService.findAll(this.searchValue);
    if (_guideCategories.length > 0) {
      const syncedList = await this.syncIndexService.getSyncIndexModel(_guideCategories, _guideCategories[0].TABLE_NAME);
      this.guideCategories = syncedList;
      this.setCategoryGuides();
    }
  }

  async setCategoryGuides() {
    this.guideCategories.map(guideCategory => {
      guideCategory.setGuides().then(async res => {
        // // console.log("guideCategory.guides", guideCategory.guides)
        // if (guideCategory.guides.length > 0) {
        //   const syncedList = await this.syncIndexService.getSyncIndexModel(guideCategory.guides, guideCategory.guides[0].TABLE_NAME);
        //   guideCategory.guides = syncedList;
        //   guideCategory.guidesCount = syncedList.length;
        //   console.log("guideCategory.guidesCount", guideCategory.guidesCount);
        // }
        // else {
        //   guideCategory.guidesCount = 0;
        // }
      })
    });


  }

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  trackByFn(item) {
    return item[item.COL_ID];
  }

  openProtocol(guide: GuiderModel) {
    const feedbackNavigationExtras: NavigationExtras = {
      queryParams: {
        templateId: guide.protocol_template_id,
        referenceModelAlias: 'guide',
        referenceId: guide.idApi,
        clientId: guide.client_id,
        backUrl: this.router.url
      }
    };
    this.router.navigate(['/guider_protocol_template/' + guide.protocol_template_id], feedbackNavigationExtras);
  }

  getGuidesWithoutCategories() {
    return this.guides.filter(guide => {
      return !guide.guide_collection.length;
    });
  }

  async ionViewWillEnter() {
    this.onboardingSyncShown = await this.miscService.get_guideShown("onboardingSyncShown");
    console.log("isStartSync", this.isStartSync)
    if (this.isStartSync) {
      console.log(this.isStartSync)
      this.miscService.set_guideShown("onboardingSyncShown");
    }
  }

  ngOnInit() {
    this.apiSync.isStartSyncBehaviorSubject.subscribe((isSync) => {
      this.isStartSync = isSync;
      this.detectChanges();
    });

    this.apiSync.syncProgressStatus
      .pipe(debounceTime(500))
      .subscribe(syncProgressStatus => {
        switch (syncProgressStatus) {
          case ('initial'):
            this.iconStatus = 'unsynced';
            break;
          case ('success'):
            this.iconStatus = 'synced';
            break;
          case ('resume'):
          case ('progress'):
            this.iconStatus = 'progress';
            break;
          case ('pause'):
            this.iconStatus = 'pause';
            break;
          case ('failed'):
            this.iconStatus = 'failed';
            break;
          default:
            this.iconStatus = null;
        }
        this.detectChanges();
      });

    this.syncService.syncMode.subscribe((result) => {
      if (![SyncMode.Manual, SyncMode.Periodic, SyncMode.NetworkConnect].includes(result)) {
        return;
      }
      this.modeSync = result;
      this.detectChanges();
    });

    this.eventSubscription = this.miscService.events.subscribe((event) => {
      switch (event.TAG) {
        case 'user:login':
          this.findAllGuideCategories();
          this.detectChanges();
          break;
        case this.guideCategoryBindingService.dbModelApi.TAG + ':update':
          this.apiSync.setIsPushAvailableData(true);
          break;
        case this.guideCategoryBindingService.dbModelApi.TAG + ':delete':
          this.findAllGuideCategories();
          break;
        case this.guideCategoryBindingService.dbModelApi.TAG + ':create':
          this.findAllGuideCategories();
          break;
        case this.guideCategoryService.dbModelApi.TAG + ':update':
          this.findAllGuideCategories();
          break;
        case this.guideCategoryService.dbModelApi.TAG + ':create':
          this.findAllGuideCategories();
          break;
        case this.guideCategoryService.dbModelApi.TAG + ':delete':
          this.findAllGuideCategories();
          break;
        case this.guiderService.dbModelApi.TAG + ':update':
          this.setGuides();
          this.setCategoryGuides();
          break;
        case this.guiderService.dbModelApi.TAG + ':create':
          this.setGuides();
          this.setCategoryGuides();
          break;
        case this.guiderService.dbModelApi.TAG + ':delete':
          this.setGuides();
          this.setCategoryGuides();
          break;
        case this.guideChildService.dbModelApi.TAG + ':update':
          this.setGuides();
          this.setCategoryGuides();
          break;
        case this.guideChildService.dbModelApi.TAG + ':delete':
          this.setGuides();
          this.setCategoryGuides();
          break;
        case this.guideChildService.dbModelApi.TAG + ':create':
          this.setGuides();
          this.setCategoryGuides();
          break;
        case 'network:online':
          this.authService.checkAccess('guide');
          break;
        default:
      }
    })

    this.type = 'browse';
  }

  syncData() {
    if (!this.appSetting.isMigratedDatabase()) {
      this.appSetting.showIsNotMigratedDbPopup();
      return;
    }
    this.miscService.set_guideShown("onboardingSyncShown");
    this.onboardingSyncShown = true;
    this.apiSync.makeSyncProcess();
    this.openSyncModal();
  }

  async openSyncModal() {
    const modal = await this.modalController.create({
      component: SyncModalComponent,
      cssClass: "modal-fullscreen"
    });
    return await modal.present();
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
