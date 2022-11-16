import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserDb } from 'app/database/models/db/user-db';

@Injectable()
export class UserService {

    user = new Subject<any>();

    userDb: UserDb = new UserDb();

    constructor() {
    }

    async saveUser(data: UserDb) {
        await this.getUser();
        if (!this.userDb) {
            return false;
        }
        this.userDb.save();
        return true;
    }

    setUser(userDb: UserDb) {
        this.userDb = userDb;
    }

    getUser(): Promise<UserDb| null> {
        if (this.userDb) {
            return new Promise(resolve => {
                resolve(this.userDb);
            });
        }
        return new Promise(resolve => {
            new UserDb().getCurrent().then((userDb) => {
                if (userDb) {
                    this.userDb = userDb;
                    resolve(this.userDb);
                }
                resolve(null);
            });
        });
    }
}

