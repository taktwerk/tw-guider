import { Component, OnInit } from '@angular/core';
import { SyncService } from 'src/controller/services/sync.service';

@Component({
  selector: 'app-ion-menu-with-sync-indicator',
  templateUrl: './ion-menu-with-sync-indicator.component.html',
  styleUrls: ['./ion-menu-with-sync-indicator.component.scss'],
})
export class IonMenuWithSyncIndicatorComponent implements OnInit {

  constructor(public syncService: SyncService) { }

  ngOnInit() {}

}
