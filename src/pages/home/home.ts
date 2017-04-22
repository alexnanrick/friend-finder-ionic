import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { mapUrl } from '../../config/config'
import * as L from 'leaflet';

import { AuthService } from '../../providers/auth-service';
import { User } from '../../models/user'
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private user: User;
  private map: L.Map;
  private center: L.PointTuple;

  constructor(private auth: AuthService, public geolocation: Geolocation) {
    this.auth.getToken().subscribe(token => {
      console.log("Home token: " + token);
    });
    
    /*this.auth.getUserInfo().subscribe(user => {
      console.log("Home token: " + user);
    });*/
  }

  ionViewDidLoad() {
    this.show_map();
    
    this.getCurrentLocation()
      .subscribe((geo) => {
        this.map.panTo(L.latLng(geo.lat, geo.lng));
    }, (error) => {
      console.log('An error occurred tracking location');
    })
  }

  show_map() {
    this.map = L.map('map').setView([53.3, -6.3], 5);
    L.tileLayer(mapUrl, {'detectRetina': true})
      .addTo(this.map);
  }
  
  updatePosition() {
    
  }
  
  getCurrentLocation() {
    return Observable.create(observer => {
      this.geolocation.getCurrentPosition().then(location => {
        observer.next({
          lat: location.coords.latitude, 
          lng: location.coords.longitude 
        });
      }).catch(err => observer.error(err));
    });
  }
}
