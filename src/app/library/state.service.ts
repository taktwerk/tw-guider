import { Injectable, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StateService implements OnInit {

  constructor(private store: Storage) { }
  async ngOnInit() {
    await this.store.create();
  }

  async getState(key:any) {
    await this.store.create();
    await this.store.get(key);
  }

  async setState(key:any, value: any) {
    await this.store.create();
    return await this.store.set(key, value);
  }
}