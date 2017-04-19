import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html'
})
export class LandingPage {
  mapUrlLive = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiem9udHppcCIsImEiOiJjajFtbGJrYjEwMDAxMzNvdGs4OXByM2dhIn0.hzPQNENTIuVgt7fPXsUD5Q';
  mapUrlDev = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
  map;

  constructor() {
  }

  ionViewDidLoad() {
    this.show_map();
  }

  show_map() {
    this.map = L.map('map').setView([53.3, -6.3], 5);
    L.tileLayer(this.mapUrlDev, {'detectRetina': true})
      .addTo(this.map);
  }
}
