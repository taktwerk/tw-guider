import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GuiderService } from 'src/providers/api/guider-service';
import { GuiderModel } from 'src/models/db/api/guider-model';
import { GuideAssetModel } from 'src/models/db/api/guide-asset-model';
import { GuideStepModel } from 'src/models/db/api/guide-step-model';
import { GuideAssetService } from 'src/providers/api/guide-asset-service';
import { GuideStepService } from 'src/providers/api/guide-step-service';

import { ToastController } from '@ionic/angular';
import { ApiSync } from 'src/providers/api-sync';

@Component({
  selector: 'app-editguide',
  templateUrl: './editguide.page.html',
  styleUrls: ['./editguide.page.scss'],
})
export class EditguidePage implements OnInit {
  constructor(private activatedRoute: ActivatedRoute,
    private guiderService: GuiderService,
    private guideStepService: GuideStepService,
    private guideAssetService: GuideAssetService,
    private router: Router,
    private toastController: ToastController,
    private apiSync: ApiSync
  ) { }

  guideId: string;
  public guideSteps: GuideStepModel[] = [];

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.has('id')) {
        this.guideId = paramMap.get("id");
        console.log(this.guideId)
        this.setGuideSteps(this.guideId);
      }
    })
  }

  public setGuideSteps(id) {
    return this.guideStepService.dbModelApi.findAllWhere(['guide_id', id], 'order_number ASC').then(results => {
      this.guideSteps = results.filter(model => {
        return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT];
      });
    });
  }
 



}
