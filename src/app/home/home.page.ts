import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ModalTripCostComponent } from '../components/modal-trip-cost/modal-trip-cost.component';
import { ModalDeleteComponent } from '../components/modal-delete/modal-delete.component';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { OpenTripMapService } from '../services/opentripmap.service';
import { Destino } from '../interfaces/destino';
import { AutosuggestResult } from '../interfaces/autosuggest-result';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  toggleTheme(shouldEnableDarkMode: boolean) {
    document.body.classList.toggle('dark', shouldEnableDarkMode);
  }
  
  destinos: Destino[] = [];
  filteredDestinos: Destino[] = [];
  searchResultsApi: any[] = []; 
  searchTerm: string = '';

  constructor(
    private storage: Storage,
    private modalCtrl: ModalController,
    private opentripmapService: OpenTripMapService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.destinos = await this.storage.get('destinos') || this.getDefaultDestinos();
    this.filteredDestinos = [...this.destinos]; 
  }

  filterDestinos() {
    const searchTermLower = this.searchTerm.toLowerCase();

    this.filteredDestinos = this.destinos.filter(destino =>
      destino.name.toLowerCase().includes(searchTermLower) ||
      destino.country.toLowerCase().includes(searchTermLower)
    );

    if (this.searchTerm.length >= 3) {
      this.searchInApi();
    } else {
      this.searchResultsApi = []; 
    }
  }

  openInGoogleMaps(lat: number, lon: number) {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    window.open(url, '_blank');
  }

  searchInApi() {
    this.opentripmapService.searchDestinos(this.searchTerm).subscribe((res) => {
      this.searchResultsApi = [];
      const autosuggestResults: AutosuggestResult[] = res.features || res;
      
      autosuggestResults.forEach((result: AutosuggestResult) => {
        if (result.properties?.xid) { 
          this.opentripmapService.getPlaceDetails(result.properties.xid).subscribe((details) => {
            const placeWithDetails = {
              name: result.properties.name || 'Sin nombre',
              country: details.address?.country || 'Desconocido',
              image: details.preview?.source || 'assets/img/default-destination.jpg',
              lat: result.properties["point"]?.lat || details.point?.lat, 
              lon: result.properties["point"]?.lon || details.point?.lon, 
              xid: result.properties.xid 
            };
  
            this.searchResultsApi.push(placeWithDetails);
          });
        }
      });
    });
  }
  
  getDefaultDestinos(): Destino[] {
    return [
      { 
        name: 'Playa Gemelas', 
        country: 'Costa Rica', 
        price: 400, 
        image: 'assets/img/playa-gemelas.jpg', 
        lat: 9.448963, 
        lon: -83.994003 
      },
      { 
        name: 'Montaña de Comayagua National Park', 
        country: 'Honduras', 
        price: 300, 
        image: 'assets/img/comayagua.jpg', 
        lat: 14.509206, 
        lon: -87.636187
      },
      { 
        name: 'Pichilemu Historical Area', 
        country: 'Chile', 
        price: 70, 
        image: 'assets/img/pichilemu.jpg', 
        lat: -34.386097,
        lon: -72.004614 
      },
      { 
        name: 'Holy Cross Church, Hanga Roa', 
        country: 'Chile', 
        price: 800, 
        image: 'assets/img/hanga-roa.jpg', 
        lat: -27.148500, 
        lon: -109.432413 
      }
    ];
    
  }


    formatPrice(price: number): string {
      if (price == null) {
        return '$0 CLP';
      }
  
      const formattedValue = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
  
      return formattedValue.replace(',', '.');
    }

    async openTripCostModal(destino: any) {
      const modal = await this.modalCtrl.create({
        component: ModalTripCostComponent,
        componentProps: {
          destino, 
          currentPrice: destino.price
        }
      });
    
      modal.onWillDismiss().then(async (res) => {
        if (res.data) {
          destino.price = res.data.price;
          await this.storage.set('destinos', this.destinos); 
        }
      });
    
      return await modal.present();
    }

  async confirmDelete(destino: Destino) {
    const modal = await this.modalCtrl.create({
      component: ModalDeleteComponent,
      componentProps: { destino }
    });
  
    modal.onWillDismiss().then(async (res) => {
      if (res.data) {
        this.destinos = this.destinos.filter(d => d !== destino);
        this.filteredDestinos = this.filteredDestinos.filter(d => d !== destino);
        await this.storage.set('destinos', this.destinos); 
      }
    });
  
    return await modal.present();
  }

  async changeImage(destino: Destino) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      saveToGallery: true,
      correctOrientation: true,
    });
  
    if (image.dataUrl) {
      destino.image = image.dataUrl;
      await this.storage.set('destinos', this.destinos);
    } else {
      console.log('La imagen no fue capturada correctamente');
    }
  }

  async addDestinoFromApi(destino: any) {
    const nuevoDestino = {
      name: destino.name,
      country: destino.country || 'Desconocido',
      price: 0, 
      image: destino.image || 'assets/img/default-destination.jpg',
      lat: destino.lat,
      lon: destino.lon
    };

    this.destinos.push(nuevoDestino);
    await this.storage.set('destinos', this.destinos);
  }
}
