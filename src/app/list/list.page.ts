import { AfterViewChecked, ChangeDetectorRef, Component, DoCheck, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { GuideCategoryService } from '../../providers/api/guide-category-service';
import { GuideChildService } from '../../providers/api/guide-child-service';
import { GuiderService } from '../../providers/api/guider-service';
import { GuiderModel } from '../../models/db/api/guider-model';
import { AuthService } from '../../services/auth-service';
import { GuideCategoryModel } from '../../models/db/api/guide-category-model';
import { LoadingController } from '@ionic/angular';
import { GuideCategoryBindingService } from '../../providers/api/guide-category-binding-service';
import { ProtocolTemplateService } from '../../providers/api/protocol-template-service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateConfigService } from '../../services/translate-config.service';
import { MiscService } from 'src/services/misc-service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit, OnDestroy {
  public guideCategory: GuideCategoryModel;
  public searchValue: string;
  public haveProtocolPermissions = false;
  public isLoadedContent = false;
  public guideCategoryId: number;
  public params;

  public items: Array<{ title: string; note: string; icon: string }> = [];

  eventSubscription: Subscription;

  constructor(
    private guideCategoryBindingService: GuideCategoryBindingService,
    private guideCategoryService: GuideCategoryService,
    private guideChildService: GuideChildService,
    private guiderService: GuiderService,
    private protocolTemplateService: ProtocolTemplateService,
    public authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private loader: LoadingController,
    private activatedRoute: ActivatedRoute,
    private translateConfigService: TranslateConfigService,
    private miscService: MiscService,

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
    this.guideCategoryId = +this.activatedRoute.snapshot.paramMap.get('guideCategoryId');
    if (this.guideCategoryId) {
      const guiderCategoryById = await this.guideCategoryService.getById(this.guideCategoryId)
      if (guiderCategoryById.length) {
        this.guideCategory = guiderCategoryById[0];
        this.detectChanges();
      }
    } else {
      this.guideCategory = this.guideCategoryService.newModel();
      this.guideCategory.name = this.translateConfigService.translateWord('guide-categories.no-category');
      this.detectChanges();
    }
    await this.findAllGuideCategories();
    loader.dismiss();
    this.isLoadedContent = true;
  }

  public searchGuides($event) {
    this.searchValue = $event.detail.value;
    this.setGuideInfo();
  }

  async findAllGuideCategories() {
    this.setGuideInfo();
  }

  setGuideInfo() {
    const guideCategoryId = this.guideCategory ? this.guideCategory.idApi : null;
    this.guideCategoryService.getGuides(guideCategoryId, this.searchValue, !guideCategoryId).then((guides) => {
      this.guideCategory.guides = guides;
    });
  }

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  trackByFn(item, index) {
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

  async ngOnInit() {
    // this.events.subscribe('user:login', () => {
    //   this.findAllGuideCategories();
    //   this.detectChanges();
    // });
    // this.events.subscribe(this.guideCategoryBindingService.dbModelApi.TAG + ':update', (model) => {
    //   this.findAllGuideCategories();
    // });
    // this.events.subscribe(this.guideCategoryBindingService.dbModelApi.TAG + ':delete', (model) => {
    //   this.findAllGuideCategories();
    // });
    // this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':update', async (model) => {
    //   const guiderCategoryById = await this.guideCategoryService.getById(this.guideCategoryId)
    //   if (guiderCategoryById.length) {
    //     this.guideCategory = guiderCategoryById[0];
    //     this.detectChanges();
    //   }
    // });
    // this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':create', async (model) => {
    //   const guiderCategoryById = await this.guideCategoryService.getById(this.guideCategoryId)
    //   if (guiderCategoryById.length) {
    //     this.guideCategory = guiderCategoryById[0];
    //     this.detectChanges();
    //   }
    // });
    // this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':delete', async (model) => {
    //   const guiderCategoryById = await this.guideCategoryService.getById(this.guideCategoryId)
    //   if (guiderCategoryById.length) {
    //     this.guideCategory = guiderCategoryById[0];
    //     this.detectChanges();
    //   }
    // });
    // this.events.subscribe(this.guiderService.dbModelApi.TAG + ':update', (model) => {
    //   this.setGuideInfo();
    // });
    // this.events.subscribe(this.guiderService.dbModelApi.TAG + ':create', (model) => {
    //   this.setGuideInfo();
    // });
    // this.events.subscribe(this.guiderService.dbModelApi.TAG + ':delete', (model) => {
    //   this.setGuideInfo();
    // });
    // this.events.subscribe(this.protocolTemplateService.dbModelApi.TAG + ':create', (model) => {
    //   this.setGuideInfo();
    // });
    // this.events.subscribe(this.protocolTemplateService.dbModelApi.TAG + ':update', (model) => {
    //   this.setGuideInfo();
    // });
    // this.events.subscribe(this.protocolTemplateService.dbModelApi.TAG + ':delete', (model) => {
    //   this.setGuideInfo();
    // });
    // this.events.subscribe(this.guideChildService.dbModelApi.TAG + ':update', (model) => {
    //   this.setGuideInfo();
    // });
    // this.events.subscribe(this.guideChildService.dbModelApi.TAG + ':delete', (model) => {
    //   this.setGuideInfo();
    // });
    // this.events.subscribe(this.guideChildService.dbModelApi.TAG + ':create', (model) => {
    //   this.setGuideInfo();
    // });
    // this.events.subscribe('network:online', (isNetwork) => {
    //   this.authService.checkAccess('guide');
    // });

    this.eventSubscription = this.miscService.events.subscribe(async (event) => {
      const guiderCategoryById = await this.guideCategoryService.getById(this.guideCategoryId);
      switch (event.TAG) {
        case 'user:login':
          this.findAllGuideCategories();
          this.detectChanges();
          break;
        case this.guideCategoryBindingService.dbModelApi.TAG + ':update':
        case this.guideCategoryBindingService.dbModelApi.TAG + ':delete':
          this.findAllGuideCategories();
          break;
        case this.guiderService.dbModelApi.TAG + ':update':
        case this.guiderService.dbModelApi.TAG + ':create':
        case this.guiderService.dbModelApi.TAG + ':delete':
        case this.protocolTemplateService.dbModelApi.TAG + ':create':
        case this.protocolTemplateService.dbModelApi.TAG + ':update':
        case this.protocolTemplateService.dbModelApi.TAG + ':delete':
        case this.guideChildService.dbModelApi.TAG + ':update':
        case this.guideChildService.dbModelApi.TAG + ':delete':
        case this.guideChildService.dbModelApi.TAG + ':create':
          this.setGuideInfo();
          break;
        case 'network:online':
          this.authService.checkAccess('guide');
          break;
        default:
      }
    });
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
