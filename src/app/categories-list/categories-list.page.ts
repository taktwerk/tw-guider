import { UserService } from './../../services/user-service';

import { MiscService } from './../../services/misc-service';
import { ChangeDetectorRef, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { GuideCategoryService } from '../../providers/api/guide-category-service';
import { GuideViewHistoryService } from '../../providers/api/guide-view-history-service';
import { GuideChildService } from '../../providers/api/guide-child-service';
import { GuiderService } from '../../providers/api/guider-service';
import { GuiderModel } from '../../models/db/api/guider-model';
import { AuthService } from '../../services/auth-service';
import { GuideCategoryModel } from '../../models/db/api/guide-category-model';
import { GuideViewHistoryModel } from '../../models/db/api/guide-view-history-model';
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
import { StateService } from '../state.service';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';

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
  public guideActivity: GuideViewHistoryModel[] = [];
  public guideArr: any = [];
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

  isPreStateLoad = false;
  @Input() guideStepsLength: number = 0;
  @Input() stepNumber: number = 0;
  constructor(
    private state: StateService,
    private guideCategoryBindingService: GuideCategoryBindingService,
    private guideCategoryService: GuideCategoryService,
    private guideViewHistoryService: GuideViewHistoryService,
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

   
  }
  async showAllActivity(){
    let guideActivity: any = this.state.getState('CategoriesListPage_guideActivity');
    if(guideActivity != null) {
      this.guideActivity = await guideActivity;
      this.isPreStateLoad = true;
    }

    let loader;
    if(this.isPreStateLoad === false) {
      loader = await this.loader.create();
      loader.present();
    }
   console.log('step1');
   await this.findAllGuideActivity();
   await this.setActivity();

    if(typeof loader != 'undefined')  loader.dismiss();
    this.isLoadedContent = true;
  }

  async showAllGuides() {

    let guideCategories: any = this.state.getState('CategoriesListPage_guideCategories');
    if(guideCategories != null) {
      this.guideCategories = await guideCategories;
      this.isPreStateLoad = true;
    }

    let loader;
    if(this.isPreStateLoad === false) {
      loader = await this.loader.create();
      loader.present();
    }
   
    await this.findAllGuideCategories();
    await this.setGuides();

    if(typeof loader != 'undefined')  loader.dismiss();
    this.isLoadedContent = true;
  }

  async searchGuides($event) {
    this.searchValue = $event.detail.value;
    this.setGuides();
  }

  async setGuides() {
    console.log('setGuides');
    // syncIndexify guides
    const _guides = await this.guideCategoryService.getGuides(null, this.searchValue);
    // console.log("_guides", _guides)

    if (_guides.length > 0) {
      const syncedList = await this.syncIndexService.getSyncIndexModel(_guides, _guides[0].TABLE_NAME);
      this.guides = syncedList;
    }

    // syncIndexify guidesWithoutCategories
    const _guidesWithoutCategories = await this.guideCategoryService.getGuides(null, '', true);
    if (_guidesWithoutCategories.length > 0) {
      const syncedList_guidesWithoutCategories = await this.syncIndexService.getSyncIndexModel(_guidesWithoutCategories, _guidesWithoutCategories[0].TABLE_NAME);
      this.guidesWithoutCategories = syncedList_guidesWithoutCategories;
      // console.log("guidesWithoutCategorie", this.guidesWithoutCategories);
    }
  }
  async setActivity() {
    console.log('setActivity');
    // syncIndexify guides
    const _guidesActivity = await this.guideViewHistoryService.getActivity(null, this.searchValue);
    console.log("guidesCatActivity", _guidesActivity)

    if (_guidesActivity.length > 0) {
      const syncedList = await this.syncIndexService.getSyncIndexModel(_guidesActivity, _guidesActivity[0].TABLE_NAME);
      this.guides = syncedList;
      this.guideArr = this.guides;
      
    }

    // syncIndexify guidesWithoutCategories
    const _guidesWithoutCategories = await this.guideViewHistoryService.getActivity(null, '', true);
    if (_guidesWithoutCategories.length > 0) {
      const syncedList_guidesWithoutCategories = await this.syncIndexService.getSyncIndexModel(_guidesWithoutCategories, _guidesWithoutCategories[0].TABLE_NAME);
      this.guidesWithoutCategories = syncedList_guidesWithoutCategories;
    
      this.guideArr = this.guidesWithoutCategories;
      console.log("guidesWithoutCatActivity", this.guidesWithoutCategories);
    }
  }
  async findAllGuideActivity() {
    console.log('step2');
    // syncIndexify guides
  this.guideActivity = await this.guideViewHistoryService.findAll(this.searchValue);
  console.log("guideActivitystep3 ", this.guideActivity)
  if (this.guideActivity.length > 0) {
    const syncedList = await this.syncIndexService.getSyncIndexModel(this.guideActivity, this.guideActivity[0].TABLE_NAME);
    this.guideActivity = syncedList;
    // this.setCategoryGuides();
    console.log(this.guideActivity, 'syncedList-->Activity')
    this.state.setState('CategoriesListPage_guideActivity', this.guideActivity);
  }
  }

  async findAllGuideCategories() {
    console.log('findAllGuideCategories');
    // syncIndexify guideCategories
    this.guideCategories = await this.guideCategoryService.findAll(this.searchValue);
    console.log("_guideCategoriesstep1 ", this.guideCategories)
    if (this.guideCategories.length > 0) {
      const syncedList = await this.syncIndexService.getSyncIndexModel(this.guideCategories, this.guideCategories[0].TABLE_NAME);
      this.guideCategories = syncedList;
      this.setCategoryGuides();

      this.state.setState('CategoriesListPage_guideCategories', this.guideCategories);
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
    // console.log("isStartSync", this.isStartSync)
    if (this.isStartSync) {
      console.log(this.isStartSync)
      this.miscService.set_guideShown("onboardingSyncShown");
    }
  }

  ngOnInit() {
    this.showAllActivity();
    this.showAllGuides();

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

    this.type = 'activity';
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
