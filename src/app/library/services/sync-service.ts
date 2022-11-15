import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SyncService {

    syncMode = new BehaviorSubject<number | null>(null);
    resumeMode = new BehaviorSubject<boolean| null>(null);

    constructor() { }
}
