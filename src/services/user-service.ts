import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {UserDb} from '../models/db/user-db';
import {Events, Platform} from '@ionic/angular';
import {DbProvider} from '../providers/db-provider';
import {DownloadService} from './download-service';

@Injectable()
export class UserService {

    user = new Subject<any>();

    userDb: UserDb;

    constructor(private platform: Platform,
                public events: Events,
                private db: DbProvider,
                private downloadService: DownloadService) {}

    saveUser(data: UserDb) {
        this.user.next(data);
    }

    getUser() {
        if (this.userDb) {
            return new Promise(resolve => {
                resolve(true);
            });
        }

        return new Promise(resolve => {
            new UserDb(this.platform, this.db, this.events, this.downloadService).getCurrent().then((userDb) => {
                if (userDb) {
                    this.userDb = userDb;

                    resolve(true);
                }

                resolve(false);
            });
        });
    }
}

