import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {GuideCategoryService} from '../../providers/api/guide-category-service';
import {GuiderService} from '../../providers/api/guider-service';
import {GuiderModel} from '../../models/db/api/guider-model';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../../services/auth-service';
import {GuideCategoryModel} from '../../models/db/api/guide-category-model';
import {Events} from '@ionic/angular';
import {DbApiModel} from '../../models/base/db-api-model';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  public guiders: GuiderModel[] = [];
  public guideCategories: GuideCategoryModel[] = [];
  public searchValue: string;

  public items: Array<{ title: string; note: string; icon: string }> = [];
  constructor(
      private guideCategoryService: GuideCategoryService,
      private guiderService: GuiderService,
      public authService: AuthService,
      public events: Events,
      public changeDetectorRef: ChangeDetectorRef
  ) {
    this.authService.checkAccess();
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
      this.setGuideInfo(guideCategories);
    });
  }

  findAllGuideCategories() {
    if (this.searchValue) {
      this.guideCategoryService.findByGuides(this.searchValue).then(guideCategories => {
        this.setGuideInfo(guideCategories);
      });
    } else {
      this.guideCategoryService.findAll().then(guideCategories => {
        this.setGuideInfo(guideCategories);
      });
    }
  }

  setGuideInfo(guideCategories) {
    guideCategories.map(guideCategory => {
      this.addToList(guideCategory);
      guideCategory.setGuides(this.searchValue).then(() => {
        this.addToList(guideCategory);
       });
    });
  }

  public addToList(newData) {
    const indexApi = this.guideCategories.findIndex(record => newData.idApi && record.idApi === newData.idApi);
    const indexDB = this.guideCategories.findIndex(record => newData.id && record.id === newData.id);

    if (indexApi !== -1) {
      this.guideCategories[indexApi] = newData;
    } else if (indexDB !== -1) {
      this.guideCategories[indexDB] = newData;
    } else {
      this.guideCategories.push(newData);
    }
  }

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnInit() {
    this.findAllGuideCategories();
    this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':update', (model) => {
      this.setGuideInfo([model]);
      this.detectChanges();
    });
    this.events.subscribe(this.guideCategoryService.dbModelApi.TAG + ':create', (model) => {
      this.setGuideInfo([model]);
      this.detectChanges();
    });
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':update', (model) => {
      console.log('change guide image');
      this.guideCategories.map(guideCategory => {
        guideCategory.setGuides(this.searchValue);
        this.detectChanges();
      });
    });
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':create', (model) => {
      console.log('change guide image');
      this.guideCategories.map(guideCategory => {
        guideCategory.setGuides(this.searchValue);
        this.detectChanges();
      });
    });
  }
}
