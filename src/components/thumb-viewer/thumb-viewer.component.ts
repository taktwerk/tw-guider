import { Component, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AppSetting } from 'src/app/library/services/app-setting';

@Component({
  selector: 'app-thumb-viewer',
  templateUrl: './thumb-viewer.component.html',
  styleUrls: ['./thumb-viewer.component.scss'],
})
export class ThumbViewerComponent implements OnInit {

  @Input() obj: any;

  constructor(public appSetting: AppSetting, public platform: Platform) { }

  ngOnInit() {
    console.log(this.obj)
  }

}
