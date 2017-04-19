import { Component } from '@angular/core';
import { mapUrl } from '../../config/config'
import * as L from 'leaflet';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  map;

  constructor() {
  }

  ionViewDidLoad() {
    this.show_map();
  }

  show_map() {
    this.map = L.map('map').setView([53.3, -6.3], 5);
    L.tileLayer(mapUrl, {'detectRetina': true})
      .addTo(this.map);
  }
}
