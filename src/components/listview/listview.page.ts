import { Component, Input, OnInit, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { GuideStepModel } from 'src/models/db/api/guide-step-model';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { ItemReorderEventDetail } from '@ionic/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, IonItem, ToastController } from '@ionic/angular';
import { ApiSync } from 'src/providers/api-sync';
import { GuideAssetService } from 'src/providers/api/guide-asset-service';
import { GuideStepService } from 'src/providers/api/guide-step-service';
import { GuiderService } from 'src/providers/api/guider-service';
import { async } from 'rxjs/internal/scheduler/async';
import { TranslateConfigService } from 'src/services/translate-config.service';
import { HttpClient } from '../../services/http-client';

@Component({
  selector: 'listview-component',
  templateUrl: './listview.page.html',
  styleUrls: ['./listview.page.scss'],
})
export class ListViewComponent {
  @Input() guideSteps: GuideStepModel[];
  @Input() canReorder: boolean;
  @Input() guideId: string;

  @ViewChildren(IonItem, { read: ElementRef }) items: QueryList<ElementRef>;

  public params;
  public faFilePdf = faFilePdf;
  disableReorder = true;
  isScrolling = false;

  constructor(
    private guiderService: GuiderService,
    private guideStepService: GuideStepService,
    private guideAssetService: GuideAssetService,
    private router: Router,
    private toastController: ToastController,
    private apiSync: ApiSync,
    public alertController: AlertController,
    private translateConfigService: TranslateConfigService,
    public http: HttpClient,
  ) { }

  onEdit(step: GuideStepModel) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        guideId: step.guide_id,
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

  logScrollStart() { }

  logScrolling(event) {
    this.isScrolling = true;
  }

  logScrollEnd() {
    this.isScrolling = false;
  }

  delete(step: GuideStepModel) {
    this.guideStepService.remove(step).then(async (res) => {
      this.apiSync.setIsPushAvailableData(true);
      this.apiSync.refreshData();
      const alertMessage = await this.translateConfigService.translate('alert.model_was_deleted', { model: 'GuideStep' });
      this.http.showToast(alertMessage);
    });
  }

  async showDeleteAlert(step: GuideStepModel) {
    const alertMessage = await this.translateConfigService.translate('alert.are_you_sure_delete_model', { model: 'GuideStep' });
    const alert = await this.alertController.create({
      message: alertMessage,
      buttons: [
        {
          text: 'Yes',
          cssClass: 'primary',
          handler: () => this.delete(step),
        },
        {
          text: 'No',
        },
      ],
    });
    await alert.present();
  }
}
