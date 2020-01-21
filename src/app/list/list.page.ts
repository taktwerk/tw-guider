import { Component, OnInit } from '@angular/core';
import {GuideCategoryService} from '../../providers/api/guide-category-service';
import {GuiderService} from '../../providers/api/guider-service';
import {GuiderModel} from '../../models/db/api/guider-model';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../../services/auth-service';
import {GuideCategoryModel} from '../../models/db/api/guide-category-model';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  public guiders: GuiderModel[] = [];
  public guideCategories: GuideCategoryModel[] = [];

  public items: Array<{ title: string; note: string; icon: string }> = [];
  constructor(
      private guideCategoryService: GuideCategoryService,
      private guiderService: GuiderService,
      public authService: AuthService
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
    const searchValue = $event.detail.value;
    // this.guiderService.dbModelApi.findAllByTemporaryWhere(
    //     `${GuiderModel.COL_TITLE} LIKE "%${searchValue}%" OR ${GuiderModel.COL_DESCRIPTION} LIKE "%${searchValue}%"`
    // ).then(guiders => {
    //   console.log('guiders', guiders);
    //   this.guiders = guiders;
    // });
    this.guideCategoryService.findByGuides(searchValue).then(guideCategories => {
      this.guideCategories = guideCategories;
      this.guideCategories.map(guideCategory => {
        guideCategory.setGuides(searchValue);
      });
    });
  }

  ngOnInit() {
    this.guideCategoryService.dbModelApi.findAll('name ASC').then(guideCategories => {
      this.guideCategories = guideCategories;
      this.guideCategories.map(guideCategory => {
        guideCategory.setGuides();
      });
    });
    // this.guiderService.dbModelApi.dbReady().then(db => {
    //   this.guiderService.loadFromDb().then(guiders => {
    //       this.guiders = guiders.filter(model => {
    //         return !model[model.COL_DELETED_AT];
    //       });
    //   });
    // });
  }
}
