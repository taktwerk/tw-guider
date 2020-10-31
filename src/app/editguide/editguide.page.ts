import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GuiderService } from 'src/providers/api/guider-service';
import { GuiderModel } from 'src/models/db/api/guider-model';
import { GuideAssetModel } from 'src/models/db/api/guide-asset-model';
import { GuideStepModel } from 'src/models/db/api/guide-step-model';
import { GuideAssetService } from 'src/providers/api/guide-asset-service';
import { GuideStepService } from 'src/providers/api/guide-step-service';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

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
  ) { }

  public faFilePdf = faFilePdf;

  guideId: string;
  guide: GuiderModel
  public guideSteps: GuideStepModel[] = [];
  public guideAssets: GuideAssetModel[] = [];
  public virtualGuideStepSlides = [];

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.has('id')) {
        this.guideId = paramMap.get("id");
        // this.guide = this.guiderService.getById(this.guideId)[0];
        // console.log(this.guide)
        this.setGuideSteps(this.guideId);
        this.setAssets(this.guideId);
      }
    })
  }

  public setGuideSteps(id) {
    return this.guideStepService.dbModelApi.findAllWhere(['guide_id', id], 'order_number ASC').then(results => {
      this.guideSteps = results.filter(model => {
        return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT];
      });
      this.guideSteps.sort((a, b) => a.order_number - b.order_number);
      console.log('this.guideSteps')
      console.log(this.guideSteps)
    });
  }

  public setAssets(id) {
    return this.guiderService.dbModelApi.setAssets(id).then(results => {
      this.guideAssets = results.filter(model => {
        return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT];
      });

      // console.log(this.guideAssets)
    });
  }

  onCreate() {}
}
