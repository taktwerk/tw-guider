import {Injectable} from '@angular/core';
import {Platform, LoadingController} from '@ionic/angular';
import {ApiSync} from '../providers/api-sync';
import {Subject} from 'rxjs';
import {UserDb} from '../models/db/user-db';

@Injectable()
export class UserService {

    user = new Subject<any>();

    constructor(public platform: Platform,
                public loadingController: LoadingController,
                public apiSync: ApiSync
    ) {}

    saveUser(data: UserDb) {
        this.user.next(data);
    }
}

