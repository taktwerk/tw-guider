import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {UserDb} from '../models/db/user-db';

@Injectable()
export class UserService {

    user = new Subject<any>();

    constructor() {}

    saveUser(data: UserDb) {
        this.user.next(data);
    }
}

