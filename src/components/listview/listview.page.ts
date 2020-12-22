import { Component, Input, OnInit, ElementRef, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { GuideStepModel } from 'src/models/db/api/guide-step-model';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { ItemReorderEventDetail } from '@ionic/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, Events, IonItem, ToastController } from '@ionic/angular';
import { ApiSync } from 'src/providers/api-sync';
import { GuideAssetService } from 'src/providers/api/guide-asset-service';
import { GuideStepService } from 'src/providers/api/guide-step-service';
import { GuiderService } from 'src/providers/api/guider-service';
import { TranslateConfigService } from 'src/services/translate-config.service';
import { HttpClient } from '../../services/http-client';
import { GuideChildService } from 'src/providers/api/guide-child-service';
import { GuideAssetModelFileMapIndexEnum } from 'src/models/db/api/guide-asset-model';
import { AuthService } from '../../services/auth-service';
import { GuideAssetPivotService } from 'src/providers/api/guide-asset-pivot-service';

@Component({
  selector: 'listview-component',
  templateUrl: './listview.page.html',
  styleUrls: ['./listview.page.scss'],
})
export class ListViewComponent implements OnInit {
  guideSteps: GuideStepModel[];
  guideStepsData: GuideStepModel[] = [];

  @Input() canReorder: boolean;
  @Input() guideId: string;

  @ViewChildren(IonItem, { read: ElementRef }) items: QueryList<ElementRef>;

  public params;
  public faFilePdf = faFilePdf;
  disableReorder = true;
  isScrolling = false;
  displayLimit: number = 10;

  guideAssetModelFileMapIndexEnum: typeof GuideAssetModelFileMapIndexEnum = GuideAssetModelFileMapIndexEnum;

  constructor(
    private guideStepService: GuideStepService,
    private router: Router,
    private toastController: ToastController,
    private apiSync: ApiSync,
    public alertController: AlertController,
    private translateConfigService: TranslateConfigService,
    public http: HttpClient,
    public events: Events,
    public changeDetectorRef: ChangeDetectorRef,
    public authService: AuthService,
    private guideAssetService: GuideAssetService,
    private guideAssetPivotService: GuideAssetPivotService,
  ) { }

  ngOnInit(): void {
    this.setGuideSteps(this.guideId);
    this.detectChanges();

    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':create', async () => {
      this.setGuideSteps(this.guideId);
      this.detectChanges();
    });

    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':delete', async () => {
      this.setGuideSteps(this.guideId);
      this.detectChanges();
    });

    this.events.subscribe(this.guideStepService.dbModelApi.TAG + ':update', async () => {
      this.setGuideSteps(this.guideId);
      this.detectChanges();
    });

    this.events.subscribe(this.guideAssetPivotService.dbModelApi.TAG + ':create', async () => {
      this.setGuideSteps(this.guideId);
      this.detectChanges();
    });

    this.events.subscribe('network:online', () => {
      this.authService.checkAccess('guide');
    });
  }

  public setGuideSteps(id) {
    return this.guideStepService.dbModelApi.findAllWhere(['guide_id', id], 'order_number ASC').then(results => {
      this.guideStepsData = results.filter(model => {
        return !model[model.COL_DELETED_AT] && !model[model.COL_LOCAL_DELETED_AT];
      });
      this.guideSteps = this.guideStepsData.slice(0, this.displayLimit)
    });
  }

  onEdit(step: GuideStepModel) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        guideId: step.guide_id,
        stepId: step.idApi,
        action: 'edit'
      }
    }
    this.router.navigate(["/", "guidestep-add-edit"], navigationExtras);
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
      this.guideStepService.save(step).then(async () => {
        this.apiSync.setIsPushAvailableData(true);
        const alertMessage = await this.translateConfigService.translate('alert.model_was_saved', { model: 'Entry' });
        this.http.showToast(alertMessage);
      }).catch((e) => console.log(e));
    })
    this.disableReorder = true;
  }

  async showToast(message) {
    const toast = await this.toastController.create({ message: message, duration: 800 });
    toast.present();
  }

  logScrollStart() { }

  logScrolling(event?) {
    this.isScrolling = true;
  }

  logScrollEnd() {
    this.isScrolling = false;
  }

  loadData(event) {
    setTimeout(() => {
      this.displayLimit += 10;
      this.guideSteps = this.guideStepsData.slice(0, this.displayLimit);
      event.target.complete();
      event.target.disabled = true;
      if (this.guideSteps.length == this.guideStepsData.length) {
        event.target.disabled = true;
      }
    }, 500)
  }

  delete(step: GuideStepModel) {
    this.guideStepService.remove(step).then(async () => {
      this.apiSync.setIsPushAvailableData(true);
      const alertMessage = await this.translateConfigService.translate('alert.model_was_deleted', { model: 'GuideStep' });
      this.http.showToast(alertMessage);

      // this.setGuideSteps(this.guideId).then(() => {
      this.guideSteps.map((step, index) => {
        step.order_number = index + 1;
        this.guideStepService.save(step).then(() => {
          this.apiSync.setIsPushAvailableData(true);
        })
        // })
      })
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

  tracklist(element: GuideStepModel) {
    return element.idApi;
  }

  getExtractText(html: string) {
    return html.replace(/(<([^>]+)>)/ig, '').replace('&nbsp;', '')
  }


  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }
}
