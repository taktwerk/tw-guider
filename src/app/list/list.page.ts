import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {GuideCategoryService} from '../../providers/api/guide-category-service';
import {GuiderService} from '../../providers/api/guider-service';
import {GuiderModel} from '../../models/db/api/guider-model';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../../services/auth-service';
import {GuideCategoryModel} from '../../models/db/api/guide-category-model';
import {Events} from '@ionic/angular';
import {DbApiModel} from '../../models/base/db-api-model';
import {GuideCategoryBindingService} from '../../providers/api/guide-category-binding-service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss'],
})
export class ListPage implements OnInit {
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
    this.authService.checkAccess();
    this.findAllGuideCategories();
  }

  public getModels() {
    this.guiderService.data.filter(model => {
      return !model[model.COL_DELETED_AT];
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
        console.log('in find all now', guideCategories);
        this.guideCategories = guideCategories;
        this.guideCategories.map((guideCategory) => {
          this.guideCategoryService.getGuides(guideCategory.idApi, this.searchValue).then((guides) => {
            console.log('guides in category', guides);
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
    this.events.subscribe(this.guideCategoryBindingService.dbModelApi.TAG + ':update', (model) => {
      this.findAllGuideCategories();
    });
    this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':update', (model) => {
      this.findAllGuideCategories();
    });
    this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':create', (model) => {
      this.findAllGuideCategories();
    });
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':update', (model) => {
      this.setGuideInfo();
    });
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':create', (model) => {
      this.setGuideInfo();
    });
    this.events.subscribe('network:online', (isNetwork) => {
      this.authService.checkAccess();
    });
  }
}
