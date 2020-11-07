import { Component, Input, OnInit } from '@angular/core';
import { GuideStepModel } from 'src/models/db/api/guide-step-model';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { ItemReorderEventDetail } from '@ionic/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiSync } from 'src/providers/api-sync';
import { GuideAssetService } from 'src/providers/api/guide-asset-service';
import { GuideStepService } from 'src/providers/api/guide-step-service';
import { GuiderService } from 'src/providers/api/guider-service';

@Component({
  selector: 'listview-component',
  templateUrl: './listview.page.html',
  styleUrls: ['./listview.page.scss'],
})
export class ListViewComponent implements OnInit {
  @Input() guideSteps: GuideStepModel[];
  @Input() canReorder: boolean;
  @Input() guideId: string;

  public params;
  public faFilePdf = faFilePdf;
  disableReorder = true;

  constructor(
    private guiderService: GuiderService,
    private guideStepService: GuideStepService,
    private guideAssetService: GuideAssetService,
    private router: Router,
    private toastController: ToastController,
    private apiSync: ApiSync) { }

  ngOnInit() { }

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
    this.guideSteps = ev.detail.complete(this.guideSteps);
    this.reOrderStep();
  }

  reOrderStep() {
    this.guideSteps.map((step, index) => {
      step.order_number = index + 1;
    })
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
    const toast = await this.toastController.create({ message: message, duration: 800 });
    toast.present();
  }
}
