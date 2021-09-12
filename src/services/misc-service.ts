import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({ providedIn: 'root' })
export class MiscService {
    constructor(private storage: Storage) { 
        console.log("Misc Service is Ready");
    }

    public onSlideRestart = new Subject<boolean>();
    public refreshAppData = new Subject<boolean>()

    public guideInfo_by_id = [];

    public set_guideShown(guideId) {
        this.storage.set(guideId, true);
    }

    public unset_guideShown(value) {
        this.storage.set(value, false);
    }

    public get_guideShown(guideId) {
        return this.storage.get(guideId)
    }

    public events = new Subject<{ TAG, data?}>();
}