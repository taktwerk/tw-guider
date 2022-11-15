/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/member-ordering */
import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { GuideinfoPage } from '../../components/guideinfo/guideinfo.page';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { AppSetting } from 'local-server/models/app-setting';
import { GuideViewHistoryModel } from 'src/app/database/models/db/api/guide-view-history-model';
import { GuiderModel } from 'src/app/database/models/db/api/guider-model';
import { GuideViewHistoryService } from 'src/app/library/providers/api/guide-view-history-service';
import { GuiderService } from 'src/app/library/providers/api/guider-service';
import { AuthService } from 'src/app/library/services/auth-service';

@Component({
  selector: 'guide-list-component',
  templateUrl: 'guide-list-component.html',
  styleUrls: ['guide-list-component.scss'],
})
export class GuideListComponent implements OnInit {
  public haveProtocolPermissions = false;
  public params;
  @Input() guides: GuiderModel[];
  @Input() isCapture = false;
  @Input() parentCollectionId;
  @Input() guideCategoryId;

  guideList: GuiderModel[];
  displayLimit = 10;
  public guideId: number = null;
  public guideViewHistory: GuideViewHistoryModel = this.guideViewHistoryService.newModel();
  public guideHistories: GuideViewHistoryModel[] = [];

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private router: Router,
    public appSetting: AppSetting,
    public platform: Platform,
    public location: Location,
    private guideViewHistoryService: GuideViewHistoryService,
    private guiderService: GuiderService

  ) {
    this.authService.checkAccess('guide');
    if (this.authService.auth && this.authService.auth.additionalInfo && this.authService.auth.additionalInfo.roles) {
      if (this.authService.auth.additionalInfo.roles.includes('ProtocolViewer') || this.authService.auth.isAuthority) {
        this.haveProtocolPermissions = true;
      }
    }
  }

  ionViewDidLeave() {
    this.parentCollectionId = undefined;
  }

  ngOnInit(): void {
    this.guideList = this.guides.slice(0, this.displayLimit);
    // console.log("parentCollectionId", this.parentCollectionId)
  }

  loadData(event) {
    setTimeout(() => {
      this.displayLimit += 10;
      this.guideList = this.guides.slice(0, this.displayLimit);
      event.target.complete();
      event.target.disabled = true;
      if (this.guideList.length == this.guides.length) {
        event.target.disabled = true;
      }
    }, 500)
  }

  openProtocol(guide: GuiderModel) {
    const feedbackNavigationExtras: NavigationExtras = {
      queryParams: {
        templateId: guide.protocol_template_id,
        referenceModelAlias: 'guide',
        referenceId: guide.idApi,
        clientId: guide.client_id,
        backUrl: this.router.url,
      },
    };
    this.router.navigate(['/guider_protocol_template/' + guide.protocol_template_id], feedbackNavigationExtras);
  }

  openCollection(guide: GuiderModel) {
    const feedbackNavigationExtras: NavigationExtras = {
      queryParams: {
        guideId: guide.idApi,
        guideCategoryId: this.guideCategoryId
      },
    };
    this.router.navigate(['/guide-collection/' + guide.idApi], feedbackNavigationExtras);
  }

  openGuide(guide) {


    // if (guide.guide_collection.length) {
    //   this.openCollection(guide);
    //   return;
    // }
    // console.log("parentCollectionId", this.parentCollectionId)
    if (guide.guide_collection.length) {
      // console.log("check guide.guide_collection", guide);
      // this.guiderService.getById(this.guideId).then(res => {
      //   console.log("checkingg response", res);
      // })
      // console.log(guiderById);
      // this.router.navigate(['/guide/' + guide.idApi + '/' + this.parentCollectionId]);
      this.router.navigate(['/guide/' + guide.guide_collection[0].guide_id + '/' + guide.guide_collection[0].parent_guide_id]);
    }
    else {
      this.router.navigate(['/guide/' + guide.idApi]);
    }
  }

  openGuideSteps(guideId) {
    this.router.navigate(['/', 'editguide', guideId]);
  }

  trackByFn(item: GuiderModel) {
    return item.idApi;
  }

  async presentGuideInfo(guide) {
    this.guideHistories = await this.guideViewHistoryService.dbModelApi.findAllWhere(['guide_id', guide.idApi]);
    // in collection
    if (this.parentCollectionId) {
      this.guideViewHistory = this.guideHistories.filter((h) => h.parent_guide_id === this.parentCollectionId)[0];
      if (!this.guideViewHistory) {
        this.guideViewHistory = this.guideViewHistoryService.newModel();
      }
    } else {
      this.guideViewHistory = this.guideHistories.filter((h) => h.guide_id === guide.idApi)[0];
      if (!this.guideViewHistory) {
        this.guideViewHistory = this.guideViewHistoryService.newModel();
      }
    }

    const modal = await this.modalController.create({
      component: GuideinfoPage,
      componentProps: {
        'guideId': guide.idApi,
        'from': 'guide-list-component',
        'parentCollectionId': this.parentCollectionId
      },
      cssClass: "modal-fullscreen"
    });
    modal.present().then(re => {
      this.guideViewHistory.show_info = 1;
      this.saveStep(guide)
    });
  }

  public async saveStep(guide) {
    const user = await this.authService.getLastUser();
    if (!user) {
      return;
    }
    // update
    this.guideViewHistory.parent_guide_id = this.parentCollectionId;
    this.guideViewHistory.client_id = guide.client_id;
    this.guideViewHistory.user_id = user.userId;
    this.guideViewHistory.guide_id = guide.idApi;
    this.guideViewHistoryService.save(this.guideViewHistory).then(async () => { })
  }
}
