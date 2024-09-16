import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private storage: Storage) {}

  async getDestinos() {
    return await this.storage.get('destinos') || [];
  }

  async saveDestinos(destinos: any[]) {
    return await this.storage.set('destinos', destinos);
  }
}
