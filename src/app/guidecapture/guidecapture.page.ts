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
  isLoadedContent = false;
  guides: GuiderModel[] = [];
  public params;

  constructor(private authService: AuthService,
    private guideCategoryService: GuideCategoryService,
  ) {
    // this.authService.checkAccess('feedback');
  }

  ngOnInit() { this.getGuides(); }

  async getGuides() {
    this.guides = await this.guideCategoryService.getGuides(null);
  }
}
