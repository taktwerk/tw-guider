import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SyncService {

    syncMode = new BehaviorSubject<number>(null);
    resumeMode = new BehaviorSubject<boolean>(null);

    constructor() { }
}
