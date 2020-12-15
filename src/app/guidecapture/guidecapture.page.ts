import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { GuiderModel } from '../../models/db/api/guider-model';
import { GuideCategoryService } from '../../providers/api/guide-category-service';
import { Events, LoadingController } from '@ionic/angular';
import { GuiderService } from 'src/providers/api/guider-service';
import { GuideCategoryModel } from 'src/models/db/api/guide-category-model';
import { Router } from '@angular/router';
import { GuideCategoryBindingService } from 'src/providers/api/guide-category-binding-service';
import { GuideChildService } from 'src/providers/api/guide-child-service';
import { ProtocolTemplateService } from 'src/providers/api/protocol-template-service';

@Component({
  selector: 'app-guidecapture',
  templateUrl: './guidecapture.page.html',
  styleUrls: ['./guidecapture.page.scss'],
})
export class GuidecapturePage implements OnInit {
  public guideCategories: GuideCategoryModel[] = [];
  public searchValue: string;
  public haveProtocolPermissions = false;
  public isLoadedContent = false;
  public guides: GuiderModel[] = [];
  public guideItemsLimit = 20;
  public params;

  public items: Array<{ title: string; note: string; icon: string }> = [];
  public type: string;

  constructor(
    private guideCategoryService: GuideCategoryService,
    private guiderService: GuiderService,
    private guideChildService: GuideChildService,
    public authService: AuthService,
    public events: Events,
    public changeDetectorRef: ChangeDetectorRef,
    private loader: LoadingController
  ) {
    this.authService.checkAccess('guide');
    this.showAllGuides();
  }

  async showAllGuides() {
    const loader = await this.loader.create();
    loader.present();
    await this.setGuides();
    loader.dismiss();
    this.isLoadedContent = true;
  }

  async setGuides() {
    this.guides = await this.guideCategoryService.getGuides();
  }

  async searchGuides($event) {
    this.searchValue = $event.detail.value;
    this.guides = await this.guideCategoryService.getGuides(null, this.searchValue);
  }

  detectChanges() {
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnInit() {
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':update', () => {
      this.setGuides();
      this.detectChanges();
    });
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':create', () => {
      this.setGuides();
      this.detectChanges();
    });
    this.events.subscribe(this.guiderService.dbModelApi.TAG + ':delete', () => {
      this.setGuides();
      this.detectChanges();
    });
    this.events.subscribe(this.guideChildService.dbModelApi.TAG + ':update', () => {
      this.setGuides();
      this.detectChanges();
    });
    this.events.subscribe(this.guideChildService.dbModelApi.TAG + ':delete', () => {
      this.setGuides();
      this.detectChanges();
    });
    this.events.subscribe(this.guideChildService.dbModelApi.TAG + ':create', () => {
      this.setGuides();
      this.detectChanges();
    });
    this.events.subscribe('network:online', () => {
      this.authService.checkAccess('guide');
    });
  }
}


