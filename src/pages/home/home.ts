import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { mapUrl } from '../../config/config'
import * as L from 'leaflet';

import { AuthService } from '../../providers/auth-service';
import { User } from '../../models/user'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private map;
  private user: User;

  constructor(private auth: AuthService) {
    let token = this.auth.getToken();
    console.log("Home token: " + token);
    this.user = this.auth.getUserInfo();
    console.log("Home user: " + this.user.username);
  }

  ionViewDidLoad() {
    this.show_map();
  }

  show_map() {
    this.map = L.map('map').setView([53.3, -6.3], 5);
    L.tileLayer(mapUrl, {'detectRetina': true})
      .addTo(this.map);
  }
  
  updatePosition() {
    
  }
}
