import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GuiderService } from 'src/providers/api/guider-service';
import { GuiderModel } from 'src/models/db/api/guider-model';
import { GuideAssetModel } from 'src/models/db/api/guide-asset-model';
import { GuideStepModel } from 'src/models/db/api/guide-step-model';
import { GuideAssetService } from 'src/providers/api/guide-asset-service';
import { GuideStepService } from 'src/providers/api/guide-step-service';

import { Events, ToastController } from '@ionic/angular';
import { ApiSync } from 'src/providers/api-sync';

@Component({
  selector: 'app-editguide',
  templateUrl: './editguide.page.html',
  styleUrls: ['./editguide.page.scss'],
})
export class EditguidePage implements OnInit, OnDestroy {
  constructor(private activatedRoute: ActivatedRoute,
    private guiderService: GuiderService,
    private guideStepService: GuideStepService,
    private guideAssetService: GuideAssetService,
    private router: Router,
    private toastController: ToastController,
    private apiSync: ApiSync,
    public events: Events,
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

    this.events.subscribe('user:login', () => {
      this.setGuideSteps(this.guideId);
    });
    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':update', async (model) => {
      this.setGuideSteps(this.guideId);
    });
    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':create', async (model) => {
      this.setGuideSteps(this.guideId);
    });
    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':delete', async (model) => {
      this.setGuideSteps(this.guideId);
    });
  }

  public setGuideSteps(id) {
    return this.guideStepService.dbModelApi.findAllWhere(['guide_id', id], 'order_number ASC').then(results => {
      this.guideSteps = results.filter(model => {
        return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT];
      });
    });
  }

  ngOnDestroy(): void {}
}
