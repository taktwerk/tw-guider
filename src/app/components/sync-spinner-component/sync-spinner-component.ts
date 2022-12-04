import { Component, Input, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
;
import { Subscription } from 'rxjs';
import { SyncService } from 'src/controller/services/sync.service';
import { StateService } from 'src/controller/state/state.service';

@Component({
    selector: 'sync-spinner-component',
    templateUrl: 'sync-spinner-component.html',
})
export class SyncSpinnerComponent implements OnInit {

    @Input() shouldOpenPopup = true;

    isNetwork = true;

    eventSubscription: Subscription = new Subscription;

    constructor(
        private navCtrl: NavController,
        private menu: MenuController,
        public stateService: StateService,
        public syncService: SyncService
    ) {

    }

    async openSyncModal() {
        this.navCtrl.navigateRoot('/sync-model');
        this.menu.close();
    }

    ngOnInit() {

    }
}
