import { UserService } from '../../services/user-service';
import { SyncService } from '../../services/sync-service';
import { GuideViewHistoryModel } from '../../models/db/api/guide-view-history-model';
import { GuideViewHistoryService } from '../../providers/api/guide-view-history-service';

import { MiscService } from './../../services/misc-service';
import { ApiSync } from '../../providers/api-sync';
import { MenuPopoverComponent } from '../../components/menupopover/menupopover.page';
import { GuideinfoPage } from './../../components/guideinfo/guideinfo.page';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  NgZone,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ElementRef,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { GuiderService } from '../../providers/api/guider-service';
import { GuiderModel } from '../../models/db/api/guider-model';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { GuideStepService } from '../../providers/api/guide-step-service';
import { GuideStepModel } from '../../models/db/api/guide-step-model';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import {
  IonBackButtonDelegate,
  IonContent,
  IonSlides,
  LoadingController,
  ModalController,
  NavController,
  ToastController,
  Platform,
} from '@ionic/angular';
import { AuthService } from '../../services/auth-service';
import { GuideAssetService } from '../../providers/api/guide-asset-service';
import { GuideAssetPivotService } from '../../providers/api/guide-asset-pivot-service';
import { GuideAssetTextModalComponent } from '../../components/guide-asset-text-modal-component/guide-asset-text-modal-component';
import { GuideAssetModel, GuideAssetModelFileMapIndexEnum } from '../../models/db/api/guide-asset-model';
import { DownloadService } from '../../services/download-service';
import { VideoService } from '../../services/video-service';
import { GuideCategoryService } from '../../providers/api/guide-category-service';
import { GuideCategoryBindingService } from '../../providers/api/guide-category-binding-service';
import { PictureService } from '../../services/picture-service';

import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { Viewer3dService } from '../../services/viewer-3d-service';
import { GuideStepContentComponent } from '../../components/guide-step-content-component/guide-step-content-component';
import { PopoverController } from '@ionic/angular';
import { TranslateConfigService } from '../../services/translate-config.service';
import { HttpClient } from '../../services/http-client';
import { UserDb } from '../../models/db/user-db';
import { Subject, Subscription } from 'rxjs';
import { SyncIndexService } from '../../providers/api/sync-index-service';
import { HelpingService } from 'controller/helping.service';
import { ViewerService } from 'services/viewer.service';

@Component({
  selector: 'app-guide',
  templateUrl: 'guide.page.html',
  styleUrls: ['guide.page.scss'],
})
export class GuidePage implements OnInit, AfterContentChecked, OnDestroy {
  @ViewChild(IonBackButtonDelegate) backButtonDelegate: IonBackButtonDelegate;

  @ViewChildren('guideStepContent', { read: ViewContainerRef }) slideComponents: QueryList<any>;
  @ViewChild('guideStepSlides') guideStepSlides: IonSlides;

  @ViewChild('guideStepContentTemplate', { read: ViewContainerRef }) guideStepContentTemplate;

  @Input() categoryId: number;

  @Input() guides: GuiderModel[] = [];

  @ViewChild(IonContent) content: IonContent;
  @ViewChild('assetSection') assetSection: any;

  isInitStepSlider = false;

  guideAssetModelFileMapIndexEnum: typeof GuideAssetModelFileMapIndexEnum = GuideAssetModelFileMapIndexEnum;

  haveFeedbackPermissions = false;
  haveAssets = false;
  isLoadedContent = false;
  public slideOpts: any;

  public faFilePdf = faFilePdf;

  public activeGuideStepSlideIndex = 0;

  public guide: GuiderModel = this.guiderService.newModel();
  public guideId: number = null;
  public guideSteps: GuideStepModel[] = [];
  public guideAssets: GuideAssetModel[] = [];
  public guideViewHistory: GuideViewHistoryModel = this.guideViewHistoryService.newModel();
  public guideHistories: GuideViewHistoryModel[] = [];

  public guideParent: GuiderModel;
  public guideCollection: GuiderModel;
  public parentCollectionId;

  public collections: GuiderModel[] = [];

  public virtualGuideStepSlides = [];
  public params;

  guideIndex: number = null;
  restartSub: Subscription;
  hasPrevious = false;
  hasNext = false;

  resumeModeSub: Subscription;
  resumeMode: boolean;
  eventSubscription: Subscription;

  guiderSubscription: Subscription;
  guiderSubject = new Subject<number>();

  public userDb: UserDb;

  constructor(
    public http: HttpClient,
    private translateConfigService: TranslateConfigService,
    private apiSync: ApiSync,
    private popoverController: PopoverController,
    private guideCategoryService: GuideCategoryService,
    private guideCategoryBindingService: GuideCategoryBindingService,
    private guiderService: GuiderService,
    private guideStepService: GuideStepService,
    private guideAssetService: GuideAssetService,
    private guideAssetPivotService: GuideAssetPivotService,
    private activatedRoute: ActivatedRoute,
    private photoViewer: PhotoViewer,
    public authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
    public modalController: ModalController,
    public downloadService: DownloadService,
    private router: Router,
    private videoService: VideoService,
    private viewer3dService: Viewer3dService,
    public navCtrl: NavController,
    private ngZone: NgZone,
    private pictureService: PictureService,
    private loader: LoadingController,
    private componentResolver: ComponentFactoryResolver,
    private miscService: MiscService,
    private guideViewHistoryService: GuideViewHistoryService,
    private syncService: SyncService,
    private userService: UserService,
    public platform: Platform,
    private syncIndexService: SyncIndexService,
    private element: ElementRef,
    public helper: HelpingService,
    public viewer: ViewerService,
  ) {
    this.authService.checkAccess('guide');
    if (this.authService.auth && this.authService.auth.additionalInfo && this.authService.auth.additionalInfo.roles) {
      if (this.authService.auth.additionalInfo.roles.includes('FeedbackViewer') || this.authService.auth.isAuthority) {
        this.haveFeedbackPermissions = true;
      }
    }
    this.initUser().then(() => {
      this.resumeMode = this.userService.userDb.userSetting.resumeMode;
    });
  }

  protected initUser() {
    return this.userService.getUser().then((result) => {
      this.userDb = result;
    });
  }

  protected initializeGuideStepSlide() {
    const slideComponents = this.slideComponents.toArray();
    for (let i = 0; i < this.guideSteps.length; i++) {
      const virtualGuideStepSlide = {
        guideStep: this.guideSteps[i],
        containerElement: slideComponents[i],
        component: null,
      };
      
      const factory = this.componentResolver.resolveComponentFactory(GuideStepContentComponent);
      const componentRef = slideComponents[i].createComponent(factory);
      componentRef.instance.step = this.guideSteps[i];
      componentRef.instance.guide = this.guide;
      componentRef.instance.portraitOriginal = window.innerHeight > window.innerWidth;
      componentRef.instance.haveFeedbackPermissions = this.haveFeedbackPermissions;
      componentRef.instance.haveAssets = this.haveAssets;
      componentRef.instance.guideStepsLength = this.guideSteps.length;
      componentRef.instance.stepNumber = i;
      virtualGuideStepSlide.component = componentRef;
  
      this.virtualGuideStepSlides.push(virtualGuideStepSlide);
    }
    // console.log('this.virtualGuideStepSlides', this.virtualGuideStepSlides);
  }

  protected reinitializeGuideStepSlides() {
    this.virtualGuideStepSlides = [];
    this.initializeGuideStepSlide();
  }

  async changeGuideStepCurrentSlide() {
    
    this.guideStepSlides = this.element.nativeElement.querySelector('#guideStepSlides');
    await this.guideStepSlides.getActiveIndex()
      .then((index) => {
        console.log(index);
        this.activeGuideStepSlideIndex = index;
        // this.updateGuideStepSlides();
      })
      .catch((error) => {
        console.error(error);
      });

    this.ionSlideDidChange();
  }

  protected updateGuideStepSlides() {
    // console.log('updateGuideStepSlides 123');
    if (this.activeGuideStepSlideIndex > this.virtualGuideStepSlides.length - 1) {
      this.activeGuideStepSlideIndex = this.virtualGuideStepSlides.length - 1;
    }
    for (let i = 0; i < this.virtualGuideStepSlides.length; i++) {
      if (i < this.activeGuideStepSlideIndex - 1 || i > this.activeGuideStepSlideIndex + 1) {
        // console.log('this.activeGuideStepSlideIndexthis.activeGuideStepSlideIndex');
        if (this.virtualGuideStepSlides[i] && this.virtualGuideStepSlides[i].component) {
          this.virtualGuideStepSlides[i].containerElement.remove(
            this.virtualGuideStepSlides[i].containerElement.indexOf(this.virtualGuideStepSlides[i].component)
          );
          this.virtualGuideStepSlides[i].component.destroy();
          this.virtualGuideStepSlides[i].component = null;
        }
        continue;
      }
      if (!this.virtualGuideStepSlides[i].component) {
        const factory = this.componentResolver.resolveComponentFactory(GuideStepContentComponent);
        //  console.log('factory factory', factory);
        const componentRef = this.virtualGuideStepSlides[i].containerElement.createComponent(factory);
        // console.log('componentRef', componentRef);
        try {
          //  console.log('componentRef.instance', componentRef.instance);
        } catch (e) {
          console.error('componentRef.instance is errrrrorrrr');
        }

        componentRef.instance.step = this.guideSteps[i];
        //  console.log('this.guideStepsthis.guideSteps', this.guideSteps);
        //  console.log('componentRef.instance.step', componentRef.instance.step);
        // console.log('this.guideSteps[i]', this.guideSteps[i]);
        componentRef.instance.guide = this.guide;
        componentRef.instance.haveFeedbackPermissions = this.haveFeedbackPermissions;
        componentRef.instance.haveAssets = this.haveAssets;
        componentRef.instance.guideStepsLength = this.guideSteps.length;
        componentRef.instance.stepNumber = i;
        this.virtualGuideStepSlides[i].component = componentRef;
      }
    }
  }

  public openFile(basePath: string, fileApiUrl: string, modelName: string, title?: string, fileType = 'image') {
    const filePath = basePath;
    let fileTitle = 'Guide';
    if (title) {
      fileTitle = title;
    }

    let fileUrl = '';
    //  console.log('basePath', basePath);
    if(this.platform.is('capacitor')) {
      fileUrl = this.downloadService.getNativeFilePath(basePath, modelName);
    } else {
      this.helper.getSecureFile(fileApiUrl, fileType === 'video' || fileType === 'pdf').then( (url: any) => {
        
        if(url === false) {
          return;
        }

        if(fileType === 'image') {
          this.viewer.photoframe = {
            url: url,
            title: title,
            show: true
          };
        } else if(fileType === 'video') {   
          this.viewer.videoframe = {
            url: url,
            title: title,
            show: true
          };
        } else if(fileType === 'pdf') {
          this.viewer.pdfframe = {
            url: url,
            title: title,
            show: true
          };
        }
      })
      return;
    }
    //  console.log('fileUrl', fileUrl);
    if (this.downloadService.checkFileTypeByExtension(filePath, 'video') || this.downloadService.checkFileTypeByExtension(filePath, 'audio')) {
      if (!fileApiUrl) {
        return false;
      }
      this.videoService.playVideo(fileUrl, fileTitle);
    } else if (this.downloadService.checkFileTypeByExtension(filePath, 'image')) {
      this.photoViewer.show(fileUrl, fileTitle);
    } else if (this.downloadService.checkFileTypeByExtension(filePath, 'pdf')) {
      this.pictureService.openFile(fileUrl, fileTitle);
    } else if (this.downloadService.checkFileTypeByExtension(filePath, '3d')) {
      this.viewer3dService.openPopupWithRenderedFile(fileUrl, fileTitle);
    }
  }

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  async openAssetTextModal(asset: GuideAssetModel) {
    const modal = await this.modalController.create({
      component: GuideAssetTextModalComponent,
      componentProps: {
        asset: asset,
      },
      cssClass: 'modal-fullscreen',
    });
    return await modal.present();
  }

  trackGuideAsset(element: GuideAssetModel) {
    return element.idApi;
  }

  public setGuideSteps(id) {
    // console.log("id", id)
    return this.guideStepService.dbModelApi.findAllWhere(['guide_id', id], 'order_number ASC').then(async (results) => {
      // console.log("results", results)
      const _guideSteps = results.filter((model) => {
        return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT];
      });
      if (_guideSteps.length > 0) {
        const syncedList = await this.syncIndexService.getSyncIndexModel(_guideSteps, _guideSteps[0].TABLE_NAME);
        this.guideSteps = syncedList;
        console.log(this.guideSteps);
      }
    });
  }

  public async resumeStep(id) {
    this.guideHistories = await this.guideViewHistoryService.dbModelApi.findAllWhere(['guide_id', id]);
    // in collection
    if (this.parentCollectionId) {
      this.guideViewHistory = this.guideHistories.filter((h) => h.parent_guide_id === this.parentCollectionId && h.user_id === this.userDb.userId)[0];
      if (!this.guideViewHistory) {
        this.guideViewHistory = this.guideViewHistoryService.newModel();
      }
    } else {
      // console.log("Not in COllection")
      // console.log(this.guideHistories);
      // this.guideViewHistory = this.guideHistories.sort((a: GuideViewHistoryModel, b: GuideViewHistoryModel) => b.created_at.getDate() - a.created_at.getDate()).filter((h: GuideViewHistoryModel) => !h.parent_guide_id)[0];
      this.guideViewHistory = this.guideHistories.filter((h) => h.guide_id === this.guide.idApi && h.user_id === this.userDb.userId)[0];
      if (!this.guideViewHistory) {
        this.guideViewHistory = this.guideViewHistoryService.newModel();
      }
    }

    // show guide info if not already shown
    if (this.guideViewHistory.show_info === 0 || !this.guideViewHistory.show_info) {
      this.presentGuideInfo(this.guideId);
    }

    // resume step from saved step
    if (this.guideStepSlides && this.guideViewHistory) {
      let stepValue = this.guideViewHistory.step;

      if (this.guideViewHistory.step === this.guideSteps.length - 1) {
        stepValue = 0;
      }

      // slide to step
      this.guideStepSlides.slideTo(stepValue).then(async () => {
        if (stepValue !== 0) {
          const alertMessage = await this.translateConfigService.translate('alert.resumed');
          this.http.showToast(alertMessage);
        }
      });
    }
  }

  public async saveStep(saveGuideInfo = false) {
    const user = await this.authService.getLastUser();
    if (!user) {
      return;
    }
    // update
    if (saveGuideInfo) {
      this.guideViewHistory.show_info = 1;
    }
    this.guideViewHistory.parent_guide_id = this.parentCollectionId;
    this.guideViewHistory.client_id = this.guide.client_id;
    this.guideViewHistory.user_id = user.userId;
    this.guideViewHistory.guide_id = this.guide.idApi;

    try {
      const _activeIndex = await this.guideStepSlides.getActiveIndex();
      this.guideViewHistory.step = _activeIndex;
    } catch (error) {
      console.error(error);
      this.guideViewHistory.step = 0;
    }

    this.guideViewHistoryService.save(this.guideViewHistory).then(async (res) => {
      if (this.resumeMode) {
        this.apiSync.setIsPushAvailableData(true);
      }
    });
  }

  public setAssets(id) {
    return this.guiderService.dbModelApi.setAssets(id).then(async (results) => {
      const _guideAssets = results.filter((model) => {
        return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT];
      });
      if (_guideAssets.length > 0) {
        const syncedList = await this.syncIndexService.getSyncIndexModel(_guideAssets, 'guide_asset');
        this.guideAssets = syncedList;
      }
    });
  }

  ngAfterContentChecked(): void {
    if (!this.isInitStepSlider && this.slideComponents && this.slideComponents.toArray().length > 0) {
      this.isInitStepSlider = true;
      this.haveAssets = this.guideAssets.length > 0;
      this.initializeGuideStepSlide();
    }
  }

  async ngOnInit() {

    this.guideStepSlides = this.element.nativeElement.querySelector('#guideStepSlides');

    this.slideOpts = { initialSlide: 0, speed: 400, spaceBetween: 100 };
    const loader = await this.loader.create();
    loader.present();
    // console.log("snapshot", this.activatedRoute.snapshot)
    this.guideId = +this.activatedRoute.snapshot.paramMap.get('guideId');
    // this.presentGuideInfo(this.guideId);
    // console.log("guideId", this.guideId)
    this.parentCollectionId = +this.activatedRoute.snapshot.paramMap.get('parentCollectionId');
    // console.log("parentCollectionId", this.parentCollectionId);
    if (this.guideId) {
      const guiderById = await this.guiderService.getById(this.guideId);
      // console.log("guiderById", guiderById)
      if (guiderById.length) {
        this.guide = guiderById[0];
        //  console.log("guide", this.guide)
        await this.setGuideSteps(this.guide.idApi);
        await this.setAssets(this.guide.idApi);
        this.detectChanges();
        this.setGuides();
      }
    }
    loader.dismiss();
    this.isLoadedContent = true;
    this.resumeStep(this.guide.idApi);

    this.guiderSubscription = this.guiderSubject.subscribe(async (guideId) => {
      // console.log("this.guiderResetSubject.subscribe((guideId)", guideId);
      const loader = await this.loader.create();
      loader.present();
      this.guideId = guideId;
      // this.presentGuideInfo(this.guideId);
      const guiderById = await this.guiderService.getById(this.guideId);
      if (guiderById.length) {
        this.guide = guiderById[0];
        await this.setGuideSteps(this.guide.idApi);
        await this.setAssets(this.guide.idApi);
        this.detectChanges();
        this.setGuides();
        loader.dismiss();
        this.isLoadedContent = true;
        this.resumeStep(this.guide.idApi);
        this.miscService.onSlideRestart.next(true);
        this.reinitializeGuideStepSlides();
      }
    });

    this.eventSubscription = this.miscService.events.subscribe(async (event) => {
      switch (event.TAG) {
        case this.guideStepService.dbModelApi.TAG + ':create':
          if (this.guide) {
            this.setGuideSteps(this.guide.idApi).then(() => {
              this.detectChanges();
              this.reinitializeGuideStepSlides();
              this.detectChanges();
            });
          }
          break;
        case this.guideStepService.dbModelApi.TAG + ':delete':
          if (this.guide) {
            this.setGuideSteps(this.guide.idApi).then(() => {
              this.detectChanges();
              this.reinitializeGuideStepSlides();
            });
          }
          break;
        case this.guideStepService.dbModelApi.TAG + ':update':
          if (this.guide) {
            this.setGuideSteps(this.guide.idApi).then(() => {
              this.detectChanges();
              this.reinitializeGuideStepSlides();
            });
          }
          break;
        case this.guideAssetPivotService.dbModelApi.TAG + ':create':
          if (this.guide) {
            this.setAssets(this.guide.idApi).then(() => this.detectChanges());
          }
          break;
        case this.guideAssetPivotService.dbModelApi.TAG + ':update':
          if (this.guide) {
            this.setAssets(this.guide.idApi).then(() => this.detectChanges());
          }
        case this.guideAssetPivotService.dbModelApi.TAG + ':delete':
          if (this.guide) {
            this.setAssets(this.guide.idApi).then(() => this.detectChanges());
          }
          break;
        case this.guideAssetService.dbModelApi.TAG + ':create':
          if (this.guide) {
            this.setAssets(this.guide.idApi).then(() => this.detectChanges());
          }
          break;
        case this.guideAssetService.dbModelApi.TAG + ':update':
          if (this.guide) {
            this.setAssets(this.guide.idApi).then(() => this.detectChanges());
          }
          break;
        case this.guideAssetService.dbModelApi.TAG + ':delete':
          if (this.guide) {
            this.setAssets(this.guide.idApi).then(() => this.detectChanges());
          }
          break;
        case this.guiderService.dbModelApi.TAG + ':delete':
          this.ngZone.run(() => {
            this.navCtrl.navigateRoot('/guide-categories');
          });
          break;
        case this.guideCategoryService.dbModelApi.TAG + ':delete':
          this.ngZone.run(() => {
            this.navCtrl.navigateRoot('/guide-categories');
          });
          break;
        case this.guideCategoryBindingService.dbModelApi.TAG + ':delete':
          this.ngZone.run(() => {
            this.navCtrl.navigateRoot('/guide-categories');
          });
          break;
        case 'network:online':
          this.authService.checkAccess('guide');
          break;
        default:
      }
    });

    this.restartSub = this.miscService.onSlideRestart.subscribe((res) => {
      if (res) {
        if (this.guideStepSlides.slideTo(0)) {
          this.guideStepSlides.slideTo(0);
        } else {
          this.guideStepSlides.slideTo(1);
        }
      }
    });

    this.resumeModeSub = this.syncService.resumeMode.subscribe((mode) => {
      this.resumeMode = mode;
    });
  }

  async presentGuideInfo(guideId) {
    const modal = await this.modalController.create({
      component: GuideinfoPage,
      componentProps: {
        guideId: guideId,
      },
      cssClass: 'modal-fullscreen',
    });
    // if (this.guideViewHistory.show_info === 0 || !this.guideViewHistory.show_info) {
    this.saveStep(true);
    return await modal.present();
    // }
  }

  async setGuides() {
    this.guideCategoryService.getGuides().then((res) => {
      // console.log("guideCategoryService.getGuides().then((res)", res);

      setTimeout(async () => {
        const _guides = res;
        const syncedList = await this.syncIndexService.getSyncIndexModel(_guides, _guides[0].TABLE_NAME);
        this.guides = syncedList;

        // console.log("this.parentCollectionId in guide slider", this.parentCollectionId);

        if (this.parentCollectionId) {
          this.collections = this.guides.filter((g) => g.guide_collection.length > 0);
          this.guideCollection = this.collections.filter((c) => {
            return c.guide_collection.find(({ guide_id }) => this.guideId == guide_id);
          })[0];
          this.guideIndex = this.guideCollection.guide_collection.findIndex(({ guide_id }) => this.guide.idApi == guide_id);

          this.guideStepSlides.isBeginning().then((res) => {
            // console.log("isBeginning on Loaded", res)
            if (this.guideCollection.guide_collection[this.guideIndex - 1] != undefined && res) {
              this.hasPrevious = true;
            } else {
              this.hasPrevious = false;
            }
          });

          this.guideStepSlides.isEnd().then((res) => {
            // console.log("isEnd on Loaded", res)
            if (this.guideCollection.guide_collection[this.guideIndex + 1] != undefined && res) {
              this.hasNext = true;
            } else {
              this.hasNext = false;
            }
          });
        }
      }, 2000);
    });
  }

  ionSlideDidChange() {
    this.guideStepSlides.isBeginning().then((res) => {
      if (this.guideCollection && this.guideCollection.guide_collection) {
        if (this.guideCollection.guide_collection[this.guideIndex - 1] != undefined && res) {
          this.hasPrevious = true;
        } else {
          this.hasPrevious = false;
        }
      }
    });

    this.guideStepSlides.isEnd().then((res) => {
      // console.log("isEnd", res)
      if (this.guideCollection && this.guideCollection.guide_collection) {
        if (this.guideCollection.guide_collection[this.guideIndex + 1] != undefined && res) {
          this.hasNext = true;
        } else {
          this.hasNext = false;
        }
      }
    });

    // save last seen step
    this.guideStepSlides.getActiveIndex().then((index) => {
      this.saveStep();
    });
  }

  previousGuide() {
    this.guideIndex = this.guides.findIndex(({ idApi }) => this.guide.idApi == idApi);
    if (this.guideCollection.guide_collection[this.guideIndex - 1] != undefined) {
      this.hasPrevious = true;
      const previousGuideIndex = this.guides[this.guideIndex - 1].idApi;
      // this.router.navigate(['/guide/' + previousGuideIndex + '/' + this.parentCollectionId]);
      // reset guide
      this.guideId = previousGuideIndex;
      this.guiderSubject.next(this.guideId);
    } else {
      this.hasPrevious = false;
    }
  }

  nextGuide() {
    this.guideIndex = this.guides.findIndex(({ idApi }) => this.guide.idApi == idApi);
    if (this.guideCollection.guide_collection[this.guideIndex + 1] != undefined) {
      this.hasNext = true;
      const nextGuideIndex = this.guides[this.guideIndex + 1].idApi;
      // this.router.navigate(['/guide/' + nextGuideIndex + '/' + this.parentCollectionId]);
      // reset guide
      this.guideId = nextGuideIndex;
      this.guiderSubject.next(this.guideId);
    } else {
      this.hasNext = false;
    }
  }

  async presentSlideInfo(ev: any) {
    const popover = await this.popoverController.create({
      component: MenuPopoverComponent,
      componentProps: { guideId: this.guideId },
      translucent: true,
      event: ev,
    });
    return await popover.present();
  }

  ionViewWillLeave() {}

  backToCollection() {
    const feedbackNavigationExtras: NavigationExtras = {
      queryParams: {
        guideId: this.parentCollectionId,
      },
    };
    this.router.navigate(['/guide-collection/' + this.parentCollectionId], feedbackNavigationExtras);
  }

  onScrollTop() {
    this.content.scrollToPoint(0, this.assetSection.nativeElement.offsetTop, 500);
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.restartSub.unsubscribe();
    this.resumeModeSub.unsubscribe();
    this.eventSubscription.unsubscribe();
  }
}
