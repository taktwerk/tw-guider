import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GuiderService } from 'src/providers/api/guider-service';
import { GuiderModel } from 'src/models/db/api/guider-model';
import { GuideAssetModel } from 'src/models/db/api/guide-asset-model';
import { GuideStepModel } from 'src/models/db/api/guide-step-model';
import { GuideAssetService } from 'src/providers/api/guide-asset-service';
import { GuideStepService } from 'src/providers/api/guide-step-service';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { ItemReorderEventDetail } from '@ionic/core';
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

  public faFilePdf = faFilePdf;

  guideId: string;
  public guideSteps: GuideStepModel[] = [];
  public virtualGuideStepSlides = [];

  disableReorder = true;

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.has('id')) {
        this.guideId = paramMap.get("id");
        console.log("Retrieved Guide ID >>>>>>>>>>>>>>>>>>>>>>>>")
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
      console.log("Retrieved Guide Steps >>>>>>>>>>>>>>>>>>>>>>>>")
      console.log(this.guideSteps)
    });
  }
 
  onEdit(step: GuideStepModel) {
    console.log(step)
    let navigationExtras: NavigationExtras = {
      queryParams: {
        guideId: this.guideId,
        stepId: step.idApi
      }
    }
    this.router.navigate(["/", "editguidestep"], navigationExtras);
  }

  Reorder(ev: CustomEvent<ItemReorderEventDetail>) {
    console.log("before index " + this.guideSteps);
    this.guideSteps = ev.detail.complete(this.guideSteps);
    console.log("after index " + this.guideSteps);
    this.reOrderStep();
  }

  reOrderStep() {
    this.guideSteps.map((step, index) => {
      step.order_number = index + 1;
    })
    console.log("after step reorder >>>>>>>>>>>>");
    console.log(this.guideSteps)
  }

  onReorder() {
    this.disableReorder = false;
  }

  async save() {
    this.guideSteps.map((step) => {
      this.guideStepService.save(step).then(() => {
        this.apiSync.setIsPushAvailableData(true);
        this.showToast(`${step.title} saved`);
      }).catch((e) => console.log(e));
    })
    this.disableReorder = true;
  }

  async showToast(message) {
    const toast = await this.toastController.create({ message: message, duration: 500 });
    toast.present();
  }
}
