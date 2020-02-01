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
  // animations: [
    // trigger(
    //     'sideMenuFade', [
    //       transition(':enter', [
    //         style({opacity: 0}),
    //         animate('250ms', style({opacity: 1}))
    //       ]),
    //       transition(':leave', [
    //         style({opacity: 1}),
    //         animate('250ms', style({opacity: 0}))
    //       ])
    //     ]
    // ),
    // trigger('EnterLeave', [
    //   state('flyIn', style({ transform: 'translateX(0)' })),
    //   transition(':enter', [
    //     style({ transform: 'translateX(-100%)' }),
    //     animate('0.5s 300ms ease-in')
    //   ]),
    //   transition(':leave', [
    //     animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
    //   ])
    // ]),
    // trigger('fadeInOutResults', [
    //   state('void', style({
    //     opacity: 0,
    //   })),
    //   transition('void <=> *', animate(500)),
    // ]),
  // ],
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
