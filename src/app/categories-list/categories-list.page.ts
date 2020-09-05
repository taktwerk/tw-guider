import {AfterViewChecked, ChangeDetectorRef, Component, DoCheck, OnChanges, OnInit} from '@angular/core';
import {GuideCategoryService} from '../../providers/api/guide-category-service';
import {GuiderService} from '../../providers/api/guider-service';
import {GuiderModel} from '../../models/db/api/guider-model';
import {AuthService} from '../../services/auth-service';
import {GuideCategoryModel} from '../../models/db/api/guide-category-model';
import {Events, LoadingController} from '@ionic/angular';
import {GuideCategoryBindingService} from '../../providers/api/guide-category-binding-service';
import {ProtocolTemplateService} from '../../providers/api/protocol-template-service';
import {NavigationExtras, Router} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: 'categories-list.page.html',
  styleUrls: ['categories-list.page.scss']
})
export class CategoriesListPage implements OnInit {
  public guideCategories: GuideCategoryModel[] = [];
  public searchValue: string;
  public haveProtocolPermissions = false;
  public isLoadedContent = false;
  public guides: GuiderModel[] = [];
  public guideItemsLimit = 20;
  public guidesWithoutCategories: GuiderModel[] = [];

  public items: Array<{ title: string; note: string; icon: string }> = [];

  public type: string;
  constructor(
      private guideCategoryBindingService: GuideCategoryBindingService,
      private guideCategoryService: GuideCategoryService,
      private guiderService: GuiderService,
      private protocolTemplateService: ProtocolTemplateService,
      public authService: AuthService,
      public events: Events,
      public changeDetectorRef: ChangeDetectorRef,
      private router: Router,
      private loader: LoadingController
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
    this.guides = await this.guideCategoryService.getGuides(null, this.searchValue);
    this.guidesWithoutCategories = await this.guideCategoryService.getGuides(null, '', true);
  }

  async findAllGuideCategories() {
    this.guideCategories = await this.guideCategoryService.findAll(this.searchValue);

    this.setCategoryGuides();
  }

  async setCategoryGuides() {
    this.guideCategories.map(guideCategory => {
      guideCategory.setGuides();
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

  getGuidesWithoutCategories()
  {
    return this.guides.filter(guide => {
      return !guide.guide_collection.length;
    });
  }

  ngOnInit() {
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
    this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':update', (model) => {
      this.findAllGuideCategories();
    });
    this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':create', (model) => {
      this.findAllGuideCategories();
    });
    this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':delete', (model) => {
      this.findAllGuideCategories();
    });
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':update', (model) => {
      this.setGuides();
      this.setCategoryGuides();
    });
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':create', (model) => {
      this.setGuides();
      this.setCategoryGuides();
    });
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':delete', (model) => {
      this.setGuides();
      this.setCategoryGuides();
    });
    this.events.subscribe('network:online', (isNetwork) => {
      this.authService.checkAccess('guide');
    });

    this.type = 'browse';
  }
}
