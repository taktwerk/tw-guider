import { Subscription } from 'rxjs/Subscription';
import { MiscService } from './../../services/misc-service';
import { ApiSync } from 'src/providers/api-sync';
import { MenuPopoverComponent } from 'src/components/menupopover/menupopover.page';
import { GuideinfoPage } from './../../components/guideinfo/guideinfo.page';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component, ComponentFactoryResolver, NgZone,
  Input,
  OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef, ApplicationRef, Injector, ElementRef, Renderer2, OnDestroy, HostListener
} from '@angular/core';
import { GuiderService } from '../../providers/api/guider-service';
import { GuiderModel } from '../../models/db/api/guider-model';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { GuideStepService } from '../../providers/api/guide-step-service';
import { GuideStepModel } from '../../models/db/api/guide-step-model';
import { File } from '@ionic-native/file/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Events, IonSlides, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
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
import { Viewer3dService } from "../../services/viewer-3d-service";
import { GuideStepContentComponent } from "../../components/guide-step-content-component/guide-step-content-component";
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-guide',
  templateUrl: 'guide.page.html',
  styleUrls: ['guide.page.scss']
})
export class GuidePage implements OnInit, AfterContentChecked, OnDestroy {

  @ViewChildren('guideStepContent', { read: ViewContainerRef }) slideComponents: QueryList<any>;
  @ViewChild('guideStepSlide', { static: false }) guideStepSlides: IonSlides;
  @ViewChild('guideStepSlideElemRef', { static: false }) guideStepSlideElemRef: ElementRef;

  @ViewChild('guideStepContentTemplate', { static: false, read: ViewContainerRef }) guideStepContentTemplate;

  @Input() categoryId: number;

  @Input() guides: GuiderModel[] = [];

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

  public guideParent: GuiderModel;
  public guideCollection: GuiderModel
  public parentCollectionId;

  public collections: GuiderModel[] = [];

  public virtualGuideStepSlides = [];
  public params;


  public guideViewHistory: any;
  guideIndex: number = null;
  restartSub: Subscription;
  hasPrevious = false;
  hasNext = false;

  constructor(
    private elementRef: ElementRef,
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
    public events: Events,
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
    private toast: ToastController,
    private miscService: MiscService,
  ) {
    this.authService.checkAccess('guide');
    if (this.authService.auth && this.authService.auth.additionalInfo && this.authService.auth.additionalInfo.roles) {
      if (this.authService.auth.additionalInfo.roles.includes('FeedbackViewer') ||
        this.authService.auth.isAuthority) {
        this.haveFeedbackPermissions = true;
      }
    }
  }

  ngAfterContentChecked(): void {
    if (!this.isInitStepSlider && this.slideComponents && this.slideComponents.toArray().length > 0) {
      this.isInitStepSlider = true;
      this.haveAssets = this.guideAssets.length > 0;
      this.initializeGuideStepSlide();
    }
  }

  protected initializeGuideStepSlide() {
    const slideComponents = this.slideComponents.toArray();
    for (let i = 0; i < this.guideSteps.length; i++) {
      const virtualGuideStepSlide = {
        guideStep: this.guideSteps[i],
        containerElement: slideComponents[i],
        component: null
      };
      if (i < 2) {
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
      }
      this.virtualGuideStepSlides.push(virtualGuideStepSlide);
    }
    // console.log('this.virtualGuideStepSlides', this.virtualGuideStepSlides);
  }

  protected reinitializeGuideStepSlides() {
    this.virtualGuideStepSlides = [];
    this.initializeGuideStepSlide();
  }

  changeGuideStepCurrentSlide() {
    console.log('changeGuideStepCurrentSlide')
    this.guideStepSlides
      .getActiveIndex()
      .then(index => {
        this.activeGuideStepSlideIndex = index;
        this.updateGuideStepSlides();
      });
  }

  protected updateGuideStepSlides() {
    // console.log('updateGuideStepSlides 123');
    if (this.activeGuideStepSlideIndex > (this.virtualGuideStepSlides.length - 1)) {
      this.activeGuideStepSlideIndex = this.virtualGuideStepSlides.length - 1;
    }
    for (let i = 0; i < this.virtualGuideStepSlides.length; i++) {
      if (i < this.activeGuideStepSlideIndex - 1 || i > this.activeGuideStepSlideIndex + 1) {
        // console.log('this.activeGuideStepSlideIndexthis.activeGuideStepSlideIndex');
        if (this.virtualGuideStepSlides[i] && this.virtualGuideStepSlides[i].component) {
          this.virtualGuideStepSlides[i]
            .containerElement
            .remove(
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
        const componentRef = this.virtualGuideStepSlides[i]
          .containerElement
          .createComponent(factory);
        // console.log('componentRef', componentRef);
        try {
          //  console.log('componentRef.instance', componentRef.instance);
        } catch (e) {
          console.log('componentRef.instance is errrrrorrrr');
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

  public openFile(basePath: string, fileApiUrl: string, modelName: string, title?: string) {
    const filePath = basePath;
    let fileTitle = 'Guide';
    if (title) {
      fileTitle = title;
    }
    //  console.log('basePath', basePath);
    const fileUrl = this.downloadService.getNativeFilePath(basePath, modelName);
    //  console.log('fileUrl', fileUrl);
    if (this.downloadService.checkFileTypeByExtension(filePath, 'video') ||
      this.downloadService.checkFileTypeByExtension(filePath, 'audio')
    ) {
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
        asset: asset
      },
      cssClass: "modal-fullscreen"
    });
    return await modal.present();
  }

  trackGuideAsset(element: GuideAssetModel) {
    return element.idApi;
  }

  public setGuideSteps(id) {
    return this.guideStepService.dbModelApi.findAllWhere(['guide_id', id], 'order_number ASC').then(async results => {
      this.guideSteps = results.filter(model => {
        return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT];
      });

      // resume slide at
      this.apiSync.getGuideViewHistory(this.guideId).then(async (res) => {
        this.guideViewHistory = res[0];
        console.log(this.guideViewHistory)

        if (this.guideViewHistory && this.guideViewHistory.metadata != undefined) {
          this.guideStepSlides.slideTo(this.guideViewHistory.metadata.step_order_number).then(() => {
            this.toast.create({ message: 'Resume', duration: 1000 });
          })
        }
      })
    });
  }

  public setAssets(id) {
    return this.guiderService.dbModelApi.setAssets(id).then(results => {
      this.guideAssets = results.filter(model => {
        return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT];
      });
    });
  }

  openFeedback(referenceModelAlias, referenceId) {
    const feedbackNavigationExtras: NavigationExtras = {
      queryParams: {
        backUrl: this.router.url,
        referenceModelAlias: referenceModelAlias,
        referenceId: referenceId
      }
    };
    this.router.navigate(['feedback'], feedbackNavigationExtras);
  }

  async ngOnInit() {
    this.slideOpts = {
      initialSlide: 0,
      speed: 400,
    };
    const loader = await this.loader.create();
    loader.present();

    console.log("snapshot", this.activatedRoute.snapshot)
    this.guideId = +this.activatedRoute.snapshot.paramMap.get('guideId');
    this.parentCollectionId = +this.activatedRoute.snapshot.paramMap.get('parentCollectionId');
    if (this.guideId) {
      const guiderById = await this.guiderService.getById(this.guideId);
      if (guiderById.length) {
        this.guide = guiderById[0];
        await this.setGuideSteps(this.guide.idApi);
        await this.setAssets(this.guide.idApi);
        this.detectChanges();
      }
    }
    loader.dismiss();
    this.isLoadedContent = true;

    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':create', async () => {
      if (this.guide) {
        this.setGuideSteps(this.guide.idApi).then(() => {
          this.detectChanges();
          this.reinitializeGuideStepSlides();
          this.detectChanges();
        });
      }
    });
    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':delete', async () => {
      // console.log('model delete', model);
      if (this.guide) {
        this.setGuideSteps(this.guide.idApi).then(() => {
          this.detectChanges();
          this.reinitializeGuideStepSlides();
          // console.log('after reinitialize');
        });
      }
    });
    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':update', async () => {
      //  console.log('model update', model);
      if (this.guide) {

        this.setGuideSteps(this.guide.idApi).then(() => {
          this.detectChanges();
          this.reinitializeGuideStepSlides();
          //  console.log('after reinitialize');
        });
      }
    });
    this.events.subscribe(this.guideAssetPivotService.dbModelApi.TAG + ':create', async () => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetPivotService.dbModelApi.TAG + ':update', async () => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetPivotService.dbModelApi.TAG + ':delete', async () => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetService.dbModelApi.TAG + ':create', async () => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetService.dbModelApi.TAG + ':update', async () => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetService.dbModelApi.TAG + ':delete', async () => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetService.dbModelApi.TAG + ':delete', async () => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':delete', async () => {
      this.ngZone.run(() => {
        this.navCtrl.navigateRoot('/guide-categories');
      });
    });
    this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':delete', async () => {
      this.ngZone.run(() => {
        this.navCtrl.navigateRoot('/guide-categories');
      });
    });
    this.events.subscribe(this.guideCategoryBindingService.dbModelApi.TAG + ':delete', () => {
      this.ngZone.run(() => {
        this.navCtrl.navigateRoot('/guide-categories');
      });
    });
    this.events.subscribe('network:online', () => {
      this.authService.checkAccess('guide');
    });

    this.restartSub = this.miscService.onSlideRestart.subscribe((res) => {
      if (res) {
        if (this.guideStepSlides.slideTo(0)) {
          this.guideStepSlides.slideTo(0)
        }
        else {
          this.guideStepSlides.slideTo(1)
        }
      }
    })

    this.presentGuideInfo(this.guideId);
  }

  async presentGuideInfo(guideId) {
    const modal = await this.modalController.create({
      component: GuideinfoPage,
      componentProps: {
        'guideId': guideId
      },
      cssClass: "modal-fullscreen"
    });

    const willShow_GuideInfo = await this.miscService.get_guideShown(this.guideId);
    if (willShow_GuideInfo == null) {
      this.miscService.set_guideShown(this.guideId)
      return await modal.present();
    }
  }

  ionViewDidEnter() {
    this.setGuides();
  }

  async setGuides() {
    this.guideCategoryService.getGuides().then((res) => {
      setTimeout(() => {
        this.guides = res;
        if (this.parentCollectionId) {
          this.collections = this.guides.filter(g => g.guide_collection.length > 0);
          this.guideCollection = this.collections.filter(c => {
            return c.guide_collection.find(({ guide_id }) => this.guideId == guide_id)
          })[0];
          this.guideIndex = this.guideCollection.guide_collection.findIndex(({ guide_id }) => this.guide.idApi == guide_id);

          if (this.guideCollection.guide_collection[this.guideIndex - 1] != undefined) {
            this.hasPrevious = true;
          }

          if (this.guideCollection.guide_collection[this.guideIndex + 1] != undefined) {
            this.hasNext = true;
          }
        }
      }, 1200)
    })

  }

  previousGuide() {
    this.guideIndex = this.guides.findIndex(({ idApi }) => this.guide.idApi == idApi);
    if (this.guides[this.guideIndex - 1] != undefined) {
      this.hasPrevious = true;
      const previousGuideIndex = this.guides[this.guideIndex - 1].idApi;

      this.miscService.onSlideRestart.next(true);
      this.router.navigate(['/guide/' + previousGuideIndex + '/' + this.parentCollectionId]);
      // set next guide
    }
    else {
      this.hasPrevious = false;
    }
  }

  nextGuide() {
    this.guideIndex = this.guides.findIndex(({ idApi }) => this.guide.idApi == idApi);
    if (this.guides[this.guideIndex + 1] != undefined) {
      this.hasNext = true;
      const nextGuideIndex = this.guides[this.guideIndex + 1].idApi;
      this.miscService.onSlideRestart.next(true);
      this.router.navigate(['/guide/' + nextGuideIndex + '/' + this.parentCollectionId]);
    }
    else {
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

  ionViewWillLeave() {
    this.guideStepSlides.getActiveIndex().then(index => {
      console.log(index)
      this.apiSync.saveGuideHistory(this.guideId, index);
    })
  }


  ionViewDidLeave() {
    console.log("did leave");
    this.elementRef.nativeElement.remove();
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    console.log("destroyed")
    this.restartSub.unsubscribe();
  }
}
