import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { GuideinfoPage } from 'src/components/guideinfo/guideinfo.page';

import { AuthService } from '../../services/auth-service';
import { AppSetting } from '../../services/app-setting';
import { GuiderModel } from '../../models/db/api/guider-model';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';

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

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private router: Router,
    public appSetting: AppSetting,
    public platform: Platform,
    public location: Location
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
    console.log("parentCollectionId", this.parentCollectionId)
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

  openGuide(guide: GuiderModel) {
    if (guide.guide_collection.length) {
      this.openCollection(guide);
      return;
    }
    console.log("parentCollectionId", this.parentCollectionId)
    if (this.parentCollectionId) {
      this.router.navigate(['/guide/' + guide.idApi + '/' + this.parentCollectionId]);
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

  async presentGuideInfo(guideId) {
    const modal = await this.modalController.create({
      component: GuideinfoPage,
      componentProps: {
        'guideId': guideId,
        'from': 'guide-list-component',
        'parentCollectionId': this.parentCollectionId
      },
      cssClass: "modal-fullscreen"
    });
    return await modal.present();
  }
}
