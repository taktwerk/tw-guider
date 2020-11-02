import {AfterViewChecked, ChangeDetectorRef, Component, DoCheck, OnChanges, OnInit} from '@angular/core';
import {GuideCategoryService} from '../../providers/api/guide-category-service';
import {GuideChildService} from '../../providers/api/guide-child-service';
import {GuiderService} from '../../providers/api/guider-service';
import {GuiderModel} from '../../models/db/api/guider-model';
import {AuthService} from '../../services/auth-service';
import {GuideCategoryModel} from '../../models/db/api/guide-category-model';
import {Events, LoadingController} from '@ionic/angular';
import {GuideCategoryBindingService} from '../../providers/api/guide-category-binding-service';
import {ProtocolTemplateService} from '../../providers/api/protocol-template-service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';

@Component({
  selector: 'guide-collection-page',
  templateUrl: 'guide-collection.page.html',
  styleUrls: ['guide-collection.page.scss']
})
export class GuideCollectionPage implements OnInit {
  public guideCategory: GuideCategoryModel;
  public searchValue: string;
  public haveProtocolPermissions = false;
  public isLoadedContent = false;
  public guideCategoryId: number;

  public guide: GuiderModel;
  public collectionGuides: GuiderModel[] = [];

  public items: Array<{ title: string; note: string; icon: string }> = [];
  constructor(
      private guideCategoryBindingService: GuideCategoryBindingService,
      private guideCategoryService: GuideCategoryService,
      private guideChildService: GuideChildService,
      private guiderService: GuiderService,
      private protocolTemplateService: ProtocolTemplateService,
      public authService: AuthService,
      public events: Events,
      public changeDetectorRef: ChangeDetectorRef,
      private router: Router,
      private loader: LoadingController,
      private activatedRoute: ActivatedRoute
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
    }
    await this.findAllGuideCategories();
    loader.dismiss();
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

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async params => {
      if (params.guideId) {
        this.collectionGuides = [];
        const guiderById = await this.guiderService.getById(params.guideId);
        if (guiderById.length) {
          this.guide = guiderById[0];
          await this.setGuideInfo();
          this.isLoadedContent = true;
          this.detectChanges();
        }
      }
    });
    this.events.subscribe('user:login', () => {
      this.findAllGuideCategories();
      this.detectChanges();
    });
    this.events.subscribe(this.guideCategoryBindingService.dbModelApi.TAG + ':update', (model) => {
      this.findAllGuideCategories();
    });
    this.events.subscribe(this.guideCategoryBindingService.dbModelApi.TAG + ':delete', (model) => {
      this.findAllGuideCategories();
    });
    this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':update', async (model) => {
      const guiderCategoryById = await this.guideCategoryService.getById(this.guideCategoryId)
      if (guiderCategoryById.length) {
        this.guideCategory = guiderCategoryById[0];
        this.detectChanges();
      }
    });
    this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':create', async (model) => {
      const guiderCategoryById = await this.guideCategoryService.getById(this.guideCategoryId)
      if (guiderCategoryById.length) {
        this.guideCategory = guiderCategoryById[0];
        this.detectChanges();
      }
    });
    this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':delete', async (model) => {
      const guiderCategoryById = await this.guideCategoryService.getById(this.guideCategoryId)
      if (guiderCategoryById.length) {
        this.guideCategory = guiderCategoryById[0];
        this.detectChanges();
      }
    });
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':update', async (model) => {
      await this.setGuideInfo();
    });
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':create', async (model) => {
     await  this.setGuideInfo();
    });
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':delete', async (model) => {
      await this.setGuideInfo();
    });
    this.events.subscribe(this.protocolTemplateService.dbModelApi.TAG + ':create', async (model) => {
      await this.setGuideInfo();
    });
    this.events.subscribe(this.protocolTemplateService.dbModelApi.TAG + ':update', async (model) => {
      await this.setGuideInfo();
    });
    this.events.subscribe(this.protocolTemplateService.dbModelApi.TAG + ':delete', async (model) => {
      await this.setGuideInfo();
    });
    this.events.subscribe(this.guideChildService.dbModelApi.TAG + ':update', async (model) => {
      await this.setGuideInfo();
    });
    this.events.subscribe(this.guideChildService.dbModelApi.TAG + ':delete', async (model) => {
      await this.setGuideInfo();
    });
    this.events.subscribe(this.guideChildService.dbModelApi.TAG + ':create', async (model) => {
      await this.setGuideInfo();
    });
    this.events.subscribe('network:online', (isNetwork) => {
      this.authService.checkAccess('guide');
    });
  }
}
