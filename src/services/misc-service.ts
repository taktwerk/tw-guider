import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Storage } from '@ionic/storage';

/**
 * Service has no dependants nor does it depend on any class 
 * service
 */
@Injectable()
export class MiscService {
    constructor(private storage: Storage) { }

    onSlideRestart = new Subject<boolean>();

    guideInfo_by_id = [];

    set_guideShown(guideId) {
        this.storage.set(guideId, true);
    }

    get_guideShown(guideId) {
        return this.storage.get(guideId)
    }

}