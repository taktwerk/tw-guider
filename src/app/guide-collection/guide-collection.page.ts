import { Location } from '@angular/common';
import { AfterViewChecked, ChangeDetectorRef, Component, DoCheck, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { GuideCategoryService } from '../../providers/api/guide-category-service';
import { GuideChildService } from '../../providers/api/guide-child-service';
import { GuiderService } from '../../providers/api/guider-service';
import { GuiderModel } from '../../models/db/api/guider-model';
import { AuthService } from '../../services/auth-service';
import { GuideCategoryModel } from '../../models/db/api/guide-category-model';
import { LoadingController, Platform } from '@ionic/angular';
import { GuideCategoryBindingService } from '../../providers/api/guide-category-binding-service';
import { ProtocolTemplateService } from '../../providers/api/protocol-template-service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MiscService } from 'src/services/misc-service';

@Component({
  selector: 'guide-collection-page',
  templateUrl: 'guide-collection.page.html',
  styleUrls: ['guide-collection.page.scss']
})
export class GuideCollectionPage implements OnInit, OnDestroy {
  public guideCategory: GuideCategoryModel;
  public searchValue: string;
  public haveProtocolPermissions = false;
  public isLoadedContent = false;
  public guideCategoryId = null;

  public guide: GuiderModel;
  public collectionGuides: GuiderModel[] = [];

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
    private miscService: MiscService,
    public platform: Platform,
    public location: Location
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

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async params => {
      if (params.guideId) {
        this.guideCategoryId = params.guideCategoryId;
        console.log(this.guideCategoryId, "this.guideCategoryId")
        this.collectionGuides = [];
        const guiderById = await this.guiderService.getById(params.guideId);
        if (guiderById.length) {
          this.guide = guiderById[0];
          console.log("this.guide.idApi", this.guide.idApi)
          await this.setGuideInfo();
          this.isLoadedContent = true;
          this.detectChanges();
        }
      }
    });

    this.eventSubscription = this.miscService.events.subscribe(async (event) => {
      const guiderCategoryById = await this.guideCategoryService.getById(this.guideCategoryId);
      switch (event.TAG) {
        case 'user:login':
          this.findAllGuideCategories();
          this.detectChanges();
          break;
        case this.guideCategoryBindingService.dbModelApi.TAG + ':update':
          this.findAllGuideCategories();
          break;
        case this.guideCategoryBindingService.dbModelApi.TAG + ':delete':
          this.findAllGuideCategories();
          break;
        case this.guideCategoryService.dbModelApi.TAG + ':update':
          if (guiderCategoryById.length) {
            this.guideCategory = guiderCategoryById[0];
            this.detectChanges();
          }
          break;
        case this.guideCategoryService.dbModelApi.TAG + ':create':
          if (guiderCategoryById.length) {
            this.guideCategory = guiderCategoryById[0];
            this.detectChanges();
          }
        case this.guideCategoryService.dbModelApi.TAG + ':delete':
          if (guiderCategoryById.length) {
            this.guideCategory = guiderCategoryById[0];
            this.detectChanges();
          }
          break;
        case this.guiderService.dbModelApi.TAG + ':update':
          await this.setGuideInfo();
          break;
        case this.guiderService.dbModelApi.TAG + ':create':
          await this.setGuideInfo();
          break;
        case this.guiderService.dbModelApi.TAG + ':delete':
          await this.setGuideInfo();
          break;
        case this.protocolTemplateService.dbModelApi.TAG + ':create':
          await this.setGuideInfo();
          break;
        case this.protocolTemplateService.dbModelApi.TAG + ':update':
          await this.setGuideInfo();
          break;
        case this.protocolTemplateService.dbModelApi.TAG + ':delete':
          await this.setGuideInfo();
          break;
        case this.guideChildService.dbModelApi.TAG + ':update':
          await this.setGuideInfo();
          break;
        case this.guideChildService.dbModelApi.TAG + ':delete':
          await this.setGuideInfo();
          break;
        case this.guideChildService.dbModelApi.TAG + ':create':
          await this.setGuideInfo();
          break;
        case 'network:online':
          this.authService.checkAccess('guide');
          break;
        default:
      }
    })
  }

  public searchGuides($event) {
    this.searchValue = $event.detail.value;
    this.setGuideInfo();
  }

  async findAllGuideCategories() {
    this.setGuideInfo();
  }

  async setGuideInfo() {
    if (!this.guide) {
      return;
    }

    const collectionGuideChildren = await this.guide.setChildren();
    const collectionGuidesTemporary = [];

    for (let i = 0; i < collectionGuideChildren.length; i++) {
      let guides = await this.guiderService.getById(collectionGuideChildren[i].guide_id);
      if (guides.length) {
        let guide = guides[0];
        await guide.setChildren();
        await guide.setProtocolTemplate();
        collectionGuidesTemporary.push(guide);
      }
    }

    this.collectionGuides = collectionGuidesTemporary;
    this.detectChanges();
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

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
