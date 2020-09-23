import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component, ComponentFactory, ComponentFactoryResolver, ComponentRef,
  NgZone,
  Input,
  OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef, ApplicationRef, Injector, EmbeddedViewRef, ElementRef, Renderer2
} from '@angular/core';
import {GuiderService} from '../../providers/api/guider-service';
import {GuiderModel} from '../../models/db/api/guider-model';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {GuideStepService} from '../../providers/api/guide-step-service';
import {GuideStepModel} from '../../models/db/api/guide-step-model';
import { File } from '@ionic-native/file/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import {Events, IonSlides, LoadingController, ModalController, NavController} from '@ionic/angular';
import {AuthService} from '../../services/auth-service';
import {GuideAssetService} from '../../providers/api/guide-asset-service';
import {GuideAssetPivotService} from '../../providers/api/guide-asset-pivot-service';
import {GuideAssetTextModalComponent} from '../../components/guide-asset-text-modal-component/guide-asset-text-modal-component';
import {GuideAssetModel, GuideAssetModelFileMapIndexEnum} from '../../models/db/api/guide-asset-model';
import {DownloadService} from '../../services/download-service';
import {VideoService} from '../../services/video-service';
import {GuideCategoryService} from '../../providers/api/guide-category-service';
import {GuideCategoryBindingService} from '../../providers/api/guide-category-binding-service';
import {PictureService} from '../../services/picture-service';

import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import {Viewer3dService} from "../../services/viewer-3d-service";
import {GuideStepContentComponent} from "../../components/guide-step-content-component/guide-step-content-component";
import {delay} from "rxjs/operators";

declare var Swiper: any;

@Component({
  selector: 'app-guide',
  templateUrl: 'guide.page.html',
  styleUrls: ['guide.page.scss']
})
export class GuidePage implements OnInit, AfterContentChecked {
  // @ViewChild("guideStepContent", {static: false, read: ViewContainerRef }) guideStepContentContainer;

  @ViewChildren('guideStepContent', { read: ViewContainerRef }) slideComponents:QueryList<any>;
  @ViewChild('guideStepSlide', {static: false}) guideStepSlides: IonSlides;
  @ViewChild('guideStepSlideElemRef', {static: false}) guideStepSlideElemRef: ElementRef;

  @ViewChild('guideStepContentTemplate', { static: false, read: ViewContainerRef }) guideStepContentTemplate;

  @Input() categoryId: number;

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
  public virtualGuideStepSlides = [];
  public params;

  constructor(
      private guideCategoryService: GuideCategoryService,
      private guideCategoryBindingService: GuideCategoryBindingService,
      private guiderService: GuiderService,
      private guideStepService: GuideStepService,
      private guideAssetService: GuideAssetService,
      private guideAssetPivotService: GuideAssetPivotService,
      private activatedRoute: ActivatedRoute,
      private file: File,
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
      private applicationRef: ApplicationRef,
      private injector: Injector,
      private renderer:Renderer2
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
        componentRef.instance.haveFeedbackPermissions = this.haveFeedbackPermissions;
        componentRef.instance.haveAssets = this.haveAssets;
        componentRef.instance.guideStepsLength = this.guideSteps.length;
        componentRef.instance.stepNumber = i;
        virtualGuideStepSlide.component = componentRef;
      }
      this.virtualGuideStepSlides.push(virtualGuideStepSlide);
    }
    console.log('this.virtualGuideStepSlides', this.virtualGuideStepSlides);
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

    console.log('changeGuideStepCurrentSlide');
  }

  protected updateGuideStepSlides() {
    console.log('updateGuideStepSlides');
    if (this.activeGuideStepSlideIndex > (this.virtualGuideStepSlides.length - 1)) {
      this.activeGuideStepSlideIndex = this.virtualGuideStepSlides.length - 1;
    }
    for (let i = 0; i < this.virtualGuideStepSlides.length; i++) {
      if (i < this.activeGuideStepSlideIndex - 1 || i > this.activeGuideStepSlideIndex + 1) {
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
        const componentRef = this.virtualGuideStepSlides[i]
            .containerElement
            .createComponent(factory);
        componentRef.instance.step = this.guideSteps[i];
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
    console.log('basePath', basePath);
    const fileUrl = this.downloadService.getNativeFilePath(basePath, modelName);
    console.log('fileUrl', fileUrl);
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

  trackGuideAsset(index: number, element: GuideAssetModel) {
    return element.idApi;
  }

  public setGuideSteps(id) {
    return this.guideStepService.dbModelApi.findAllWhere(['guide_id', id], 'order_number ASC').then(results => {
      this.guideSteps = results.filter(model => {
        return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT];
      });
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
      autoHeight: true,
    };
    const loader = await this.loader.create();
    loader.present();
    this.guideId = +this.activatedRoute.snapshot.paramMap.get('guideId');
    if (this.guideId) {
      const guiderById = await this.guiderService.getById(this.guideId)
      if (guiderById.length) {
        this.guide = guiderById[0];
        await this.setGuideSteps(this.guide.idApi);
        await this.setAssets(this.guide.idApi);
        this.detectChanges();
      }
    }
    loader.dismiss();
    this.isLoadedContent = true;

    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':create', async (model) => {
      console.log('model create', model);
      if (this.guide) {
        this.setGuideSteps(this.guide.idApi).then(() => {
          this.detectChanges();
          this.reinitializeGuideStepSlides();
          this.detectChanges();
        });
      }
    });
    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':delete', async (model) => {
      console.log('model delete', model);
      if (this.guide) {
        this.setGuideSteps(this.guide.idApi).then(() => {
          this.detectChanges();
          this.reinitializeGuideStepSlides();
          console.log('after reinitialize');
        });
      }
    });
    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':update', async (model) => {
      console.log('model update', model);
      if (this.guide) {
        this.setGuideSteps(this.guide.idApi).then(() => {
          this.detectChanges();
          this.reinitializeGuideStepSlides();
          console.log('after reinitialize');
        });
      }
    });
    this.events.subscribe(this.guideAssetPivotService.dbModelApi.TAG + ':create', async (model) => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetPivotService.dbModelApi.TAG + ':update', async (model) => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetPivotService.dbModelApi.TAG + ':delete', async (model) => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetService.dbModelApi.TAG + ':create', async (model) => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetService.dbModelApi.TAG + ':update', async (model) => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetService.dbModelApi.TAG + ':delete', async (model) => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guideAssetService.dbModelApi.TAG + ':delete', async (model) => {
      if (this.guide) {
        this.setAssets(this.guide.idApi).then(() => this.detectChanges());
      }
    });
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':delete', async (model) => {
      this.ngZone.run(() => {
        this.navCtrl.navigateRoot('/guide-categories');
      });
    });
    this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':delete', async (model) => {
      this.ngZone.run(() => {
        this.navCtrl.navigateRoot('/guide-categories');
      });
    });
    this.events.subscribe(this.guideCategoryBindingService.dbModelApi.TAG + ':delete', (model) => {
      this.ngZone.run(() => {
        this.navCtrl.navigateRoot('/guide-categories');
      });
    });
    this.events.subscribe('network:online', (isNetwork) => {
      this.authService.checkAccess('guide');
    });
  }
}
