import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { GuiderModel } from '../../models/db/api/guider-model';
import { GuideCategoryService } from '../../providers/api/guide-category-service';

@Component({
  selector: 'app-guidecapture',
  templateUrl: './guidecapture.page.html',
  styleUrls: ['./guidecapture.page.scss'],
})
export class GuidecapturePage implements OnInit {
  guidesData: GuiderModel[] = [];
  guidesList: GuiderModel[] = [];
  public params;

  displayLimit: number = 10;

  isLoading = true;

  constructor(private authService: AuthService,
    private guideCategoryService: GuideCategoryService,
  ) {
    this.authService.checkAccess('guidecapture');
  }

  ngOnInit() { this.getGuides(); }

  async getGuides() {
    this.guideCategoryService.getGuides(null).then((res) => {
      this.guidesData = res;
      this.guidesList = this.guidesData.slice(0, this.displayLimit);
      this.isLoading = false;
    })
  }

  loadData(event) {
    setTimeout(() => {
      this.displayLimit += 10;
      this.guidesList = this.guidesData.slice(0, this.displayLimit);
      event.target.complete();
      event.target.disabled = true;
      if (this.guidesList.length == this.guidesData.length) {
        event.target.disabled = true;
      }
    }, 500)
  }
}
