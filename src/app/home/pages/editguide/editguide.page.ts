import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { Location } from '@angular/common';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GuideStepModel } from 'src/app/database/models/db/api/guide-step-model';
import { GuideStepService } from 'src/app/library/providers/api/guide-step-service';
import { AuthService } from 'src/app/library/services/auth-service';

@Component({
  selector: 'app-editguide',
  templateUrl: './editguide.page.html',
  styleUrls: ['./editguide.page.scss'],
})
export class EditguidePage implements OnInit, OnDestroy {

  guideId: string;
  public guideSteps: GuideStepModel[] = [];
  refreshSub: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
    private guideStepService: GuideStepService,
    private router: Router,
    public authService: AuthService,
    public changeDetectorRef: ChangeDetectorRef,
    public platform: Platform,
    public location: Location
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.has('id')) {
        this.guideId = paramMap.get('id');
        this.setGuideSteps(this.guideId);
      }
    });
  }

  ionViewWillEnter() {}


  public setGuideSteps(id) {
    return this.guideStepService.dbModelApi.findAllWhere(['guide_id', id], 'order_number ASC').then(results => {
      this.guideSteps = results.filter(model => !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT]);
    });
  }

  addStep(guide, action) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        guideId: guide,
        action
      }
    };
    this.router.navigate(['/', 'guidestep-add-edit'], navigationExtras);
  }

  ngOnDestroy(): void { }

  detectChanges() {
      this.changeDetectorRef.detectChanges();
  }
}
