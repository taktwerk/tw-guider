import {AfterViewChecked, ChangeDetectorRef, Component, DoCheck, OnChanges, OnInit} from '@angular/core';
import {GuideCategoryService} from '../../providers/api/guide-category-service';
import {GuiderService} from '../../providers/api/guider-service';
import {GuiderModel} from '../../models/db/api/guider-model';
import {AuthService} from '../../services/auth-service';
import {GuideCategoryModel} from '../../models/db/api/guide-category-model';
import {Events} from '@ionic/angular';
import {GuideCategoryBindingService} from '../../providers/api/guide-category-binding-service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit, DoCheck, AfterViewChecked {

  ngAfterViewChecked(): void {
    console.log('ngAfterViewChecked on event');
  }

  ngDoCheck(): void {
      console.log('ngDoCheck on event');
  }
  public guiders: GuiderModel[] = [];
  public guideCategories: GuideCategoryModel[] = [];
  public searchValue: string;

  public items: Array<{ title: string; note: string; icon: string }> = [];
  constructor(
      private guideCategoryBindingService: GuideCategoryBindingService,
      private guideCategoryService: GuideCategoryService,
      private guiderService: GuiderService,
      public authService: AuthService,
      public events: Events,
      public changeDetectorRef: ChangeDetectorRef
  ) {
    console.log('guide list constructor');
    this.authService.checkAccess();
    this.findAllGuideCategories();
  }

  public getModels() {
    console.log('get models guide list');
    this.guiderService.data.filter(model => {
      return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT];
    });

    return this.guiders;
  }

  public searchGuides($event) {
    this.searchValue = $event.detail.value;

    this.guideCategoryService.findByGuides(this.searchValue).then(guideCategories => {
      this.guideCategories = guideCategories;
      this.setGuideInfo();
    });
  }

  findAllGuideCategories() {
    console.log('findAllGuideCategories');
    if (this.searchValue) {
      this.guideCategoryService.findByGuides(this.searchValue).then(guideCategories => {
        this.guideCategories = guideCategories;
        this.guideCategories.map((guideCategory) => {
          this.guideCategoryService.getGuides(guideCategory.idApi, this.searchValue).then((guides) => {
            guideCategory.guides = guides;
          });
        });
      });
    } else {
      this.guideCategoryService.findAll().then(guideCategories => {
        this.guideCategories = guideCategories;
        this.guideCategories.map((guideCategory) => {
          this.guideCategoryService.getGuides(guideCategory.idApi, this.searchValue).then((guides) => {
            guideCategory.guides = guides;
          });
        });
      });
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

  ngOnInit() {
    console.log('on init');
    this.events.subscribe(this.guideCategoryBindingService.dbModelApi.TAG + ':update', (model) => {
      console.log('updating ' + this.guideCategoryBindingService.dbModelApi.TAG + ':update')
      this.findAllGuideCategories();
    });
    this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':update', (model) => {
      console.log('updating ' + this.guideCategoryService.dbModelApi.TAG + ':update')
      this.findAllGuideCategories();
    });
    this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':create', (model) => {
      console.log('updating ' + this.guideCategoryService.dbModelApi.TAG + ':create')
      this.findAllGuideCategories();
    });
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':update', (model) => {
      console.log('updating ' + this.guiderService.dbModelApi.TAG + ':update')
      this.setGuideInfo();
    });
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':create', (model) => {
      console.log('updating ' + this.guiderService.dbModelApi.TAG + ':create')
      this.setGuideInfo();
    });
    this.events.subscribe('network:online', (isNetwork) => {
      this.authService.checkAccess();
    });
  }
}
