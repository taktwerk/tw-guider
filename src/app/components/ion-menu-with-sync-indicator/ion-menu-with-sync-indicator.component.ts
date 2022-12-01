import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ion-menu-with-sync-indicator',
  templateUrl: './ion-menu-with-sync-indicator.component.html',
  styleUrls: ['./ion-menu-with-sync-indicator.component.scss'],
})
export class IonMenuWithSyncIndicatorComponent implements OnInit {

  iconStatus = 'unsynced';
  isAvailableForSyncData = false;
  isAvailableForPushData = false;

  constructor() { }

  ngOnInit() {}

}
