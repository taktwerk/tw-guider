import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { config } from 'src/environments/config';
import { App } from '@capacitor/app';

@Component({
  selector: 'about-page',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss'],
})
export class AboutPage implements OnInit {

  versionNumber = '0.0.1';
  apiVersionNumber = '0.0.1';

  currDate: Date = new Date();

  constructor(private platform: Platform) { }

  ngOnInit(): void {

    if (this.platform.is('capacitor')) {
      App.getInfo().then(res => {
        this.versionNumber = res.version;
      });
    }

    if (config) {
      if (config.apiVersion) {
        this.apiVersionNumber = config.apiVersion;
      }
    }
  }
}
