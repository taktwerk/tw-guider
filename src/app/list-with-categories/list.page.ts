import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { GuideCategoryService } from '../../providers/api/guide-category-service';
import { GuiderService } from '../../providers/api/guider-service';
import { GuiderModel } from '../../models/db/api/guider-model';
import { AuthService } from '../../services/auth-service';
import { GuideCategoryModel } from '../../models/db/api/guide-category-model';
import { LoadingController, ModalController, PopoverController, Platform } from '@ionic/angular';
import { GuideCategoryBindingService } from '../../providers/api/guide-category-binding-service';
import { ProtocolTemplateService } from '../../providers/api/protocol-template-service';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MiscService } from '../../services/misc-service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit, OnDestroy {
  public guideCategories: GuideCategoryModel[] = [];
  public searchValue: string;
  public haveProtocolPermissions = false;
  public isLoadedContent = false;
  public params;

  eventSubscription: Subscription;

  public items: Array<{ title: string; note: string; icon: string }> = [];
  constructor(
    private guideCategoryBindingService: GuideCategoryBindingService,
    private guideCategoryService: GuideCategoryService,
    private guiderService: GuiderService,
    private protocolTemplateService: ProtocolTemplateService,
    public authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private loader: LoadingController,
    private miscService: MiscService,
    private platform: Platform

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
    loader.dismiss();
    this.isLoadedContent = true;
  }

  public searchGuides($event) {
    this.searchValue = $event.detail.value;

    this.guideCategoryService.findByGuides(this.searchValue).then(guideCategories => {
      this.guideCategories = guideCategories;
      this.setGuideInfo();
    });
  }

  async findAllGuideCategories() {
    this.guideCategories = this.searchValue ?
      await this.guideCategoryService.findByGuides(this.searchValue) :
      await this.guideCategoryService.findAll();
    for (let i = 0; i < this.guideCategories.length; i++) {
      this.guideCategories[i].guides = await this.guideCategoryService.getGuides(this.guideCategories[i].idApi, this.searchValue);
    }
  }

  setGuideInfo() {
    this.guideCategories.map(guideCategory => {
      this.guideCategoryService.getGuides(guideCategory.idApi, this.searchValue).then((guides) => {
        guideCategory.guides = guides;
      });
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

  ngOnInit() {
    // this.events.subscribe('user:login', () => {
    //   this.findAllGuideCategories();
    //   this.detectChanges();
    // });
    // this.events.subscribe(this.guideCategoryBindingService.dbModelApi.TAG + ':update', () => {
    //   this.findAllGuideCategories();
    // });
    // this.events.subscribe(this.guideCategoryBindingService.dbModelApi.TAG + ':delete', () => {
    //   this.findAllGuideCategories();
    // });
    // this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':update', () => {
    //   this.findAllGuideCategories();
    // });
    // this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':create', () => {
    //   this.findAllGuideCategories();
    // });
    // this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':delete', () => {
    //   this.findAllGuideCategories();
    // });
    // this.events.subscribe(this.guiderService.dbModelApi.TAG + ':update', () => {
    //   this.setGuideInfo();
    // });
    // this.events.subscribe(this.guiderService.dbModelApi.TAG + ':create', () => {
    //   this.setGuideInfo();
    // });
    // this.events.subscribe(this.guiderService.dbModelApi.TAG + ':delete', () => {
    //   this.setGuideInfo();
    // });
    // this.events.subscribe(this.protocolTemplateService.dbModelApi.TAG + ':create', () => {
    //   this.setGuideInfo();
    // });
    // this.events.subscribe(this.protocolTemplateService.dbModelApi.TAG + ':update', () => {
    //   this.setGuideInfo();
    // });
    // this.events.subscribe(this.protocolTemplateService.dbModelApi.TAG + ':delete', () => {
    //   this.setGuideInfo();
    // });
    // this.events.subscribe('network:online', () => {
    //   this.authService.checkAccess('guide');
    // });

    this.eventSubscription = this.miscService.events.subscribe(async (event) => {
      switch (event.TAG) {
        case 'user:login':
          this.findAllGuideCategories();
          this.detectChanges();
          break;
        case this.guideCategoryBindingService.dbModelApi.TAG + ':update':
        case this.guideCategoryBindingService.dbModelApi.TAG + ':delete':
        case this.guideCategoryService.dbModelApi.TAG + ':update':
        case this.guideCategoryService.dbModelApi.TAG + ':create':
        case this.guideCategoryService.dbModelApi.TAG + ':delete':
          this.findAllGuideCategories();
          break;
        case this.guiderService.dbModelApi.TAG + ':update':
        case this.guiderService.dbModelApi.TAG + ':create':
        case this.guiderService.dbModelApi.TAG + ':delete':
        case this.protocolTemplateService.dbModelApi.TAG + ':create':
        case this.protocolTemplateService.dbModelApi.TAG + ':update':
        case this.protocolTemplateService.dbModelApi.TAG + ':delete':
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