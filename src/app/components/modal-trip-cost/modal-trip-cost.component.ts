import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-trip-cost',
  templateUrl: './modal-trip-cost.component.html',
  styleUrls: ['./modal-trip-cost.component.scss'],
})
export class ModalTripCostComponent {
  @Input() currentPrice: number; 
  newPrice: number;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.newPrice = this.currentPrice;
  }

  async save() {
    await this.modalCtrl.dismiss({ price: this.newPrice });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
