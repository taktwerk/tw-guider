import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(private store:Storage) { }

  async getState(key) {
    await this.store.get(key);
  }

  async setState(key, value) {
    return await this.store.set(key,value);
  }
}
