import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { mapUrl } from '../../config/config'
import * as L from 'leaflet';

import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private map;

  constructor(private auth: AuthService) {
    let user = this.auth.getUserInfo();
    console.log(user);
    let token = this.auth.getToken();
    console.log("Home token: " + token);
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
