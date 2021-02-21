import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable()
export class MiscService {
    constructor(private storage: Storage) { }

    public onSlideRestart = new Subject<boolean>();

    public guideInfo_by_id = [];

    public set_guideShown(guideId) {
        this.storage.set(guideId, true);
    }

    public get_guideShown(guideId) {
        return this.storage.get(guideId)
    }

    public events = new Subject<{ TAG, data?}>();
}