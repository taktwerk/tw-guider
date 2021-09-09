import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';

import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { GuideStepModel } from '../../models/db/api/guide-step-model';
import { GuideStepService } from '../../providers/api/guide-step-service';

import { AuthService } from '../../services/auth-service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-editguide',
  templateUrl: './editguide.page.html',
  styleUrls: ['./editguide.page.scss'],
})
export class EditguidePage implements OnInit, OnDestroy {
  constructor(private activatedRoute: ActivatedRoute,
    private guideStepService: GuideStepService,
    private router: Router,
    public authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
    public platform: Platform,
    public location: Location
  ) { }

  guideId: string;
  public guideSteps: GuideStepModel[] = [];
  refreshSub: Subscription

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.has('id')) {
        this.guideId = paramMap.get("id");
        this.setGuideSteps(this.guideId);
      }
    })
  }

  ionViewWillEnter() {}


  public setGuideSteps(id) {
    return this.guideStepService.dbModelApi.findAllWhere(['guide_id', id], 'order_number ASC').then(results => {
      this.guideSteps = results.filter(model => {
        return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT];
      });
    });
  }

  addStep(guide, action) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        guideId: guide,
        action: action
      }
    }
    this.router.navigate(["/", "guidestep-add-edit"], navigationExtras);
  }

  ngOnDestroy(): void { }

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }
}
