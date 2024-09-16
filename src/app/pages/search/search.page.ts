import { Component } from '@angular/core';
import { OpenTripMapService } from '../../services/opentripmap.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {
  searchTerm: string = '';
  searchResults: any[] = [];

  constructor(private opentripmapService: OpenTripMapService, private storage: Storage) {}

  async ngOnInit() {
    await this.storage.create();
  }

  async searchDestinos() {
    if (this.searchTerm.trim() === '') return;

    this.opentripmapService.searchDestinos(this.searchTerm).subscribe((res) => {
      this.searchResults = res;
      console.log(this.searchResults);
    });
  }

  addDestino(destino: any) {
    const nuevoDestino = {
      name: destino.name,
      country: destino.country || 'Desconocido',  
      price: 0,
      image: 'assets/img/default-destination.jpg' 
    };
  
    this.storage.get('destinos').then((destinos: any[]) => {
      destinos = destinos || [];
      destinos.push(nuevoDestino);
      this.storage.set('destinos', destinos);
    });
  }
  
}
