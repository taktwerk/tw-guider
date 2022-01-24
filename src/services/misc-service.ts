/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class MiscService implements OnInit {

    public onSlideRestart = new Subject<boolean>();
    public refreshAppData = new Subject<boolean>();
    public events = new Subject<any>();
    public guideInfo_by_id = [];

    constructor(private storage: Storage) {
        console.log('Misc Service is Ready');
    }

    async ngOnInit() {
        await this.storage.create();
    }

    public set_guideShown(guideId) {
        this.storage.create();
        this.storage.set(guideId, true);
    }

    public unset_guideShown(value) {
        this.storage.create();
        this.storage.set(value, false);
    }

    public get_guideShown(guideId) {
        this.storage.create();
        return this.storage.get(guideId);
    }
}
