import { Component} from '@angular/core';
import { SyncService } from 'src/controller/services/sync.service';
import { StateService } from 'src/controller/state/state.service';

@Component({
    selector: 'sync-spinner-component',
    templateUrl: 'sync-spinner-component.html',
})
export class SyncSpinnerComponent {

    isNetwork = true;

    constructor( public syncService: SyncService, public stateService: StateService ) {}
}
