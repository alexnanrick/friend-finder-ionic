import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { mapUrl } from '../../config/config'
import { Observable } from "rxjs/Observable";
import { IonicPage, NavController } from 'ionic-angular';
import * as L from 'leaflet';

import { AuthService } from '../../providers/auth-service';
import { GeoService } from '../../providers/geo-service';
import { UserService } from '../../providers/user-service';
import { FriendService } from '../../providers/friend-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private map: L.Map;
  public friends: any;

  constructor(public nav: NavController, private auth: AuthService, private geo: GeoService, private user: UserService, private friend: FriendService) {
    this.auth.getToken().subscribe(token => {
      console.log("Home token: " + token);
    });
    
    this.user.getUserInfo().subscribe(user => {
      console.log("Home user: " + user);
    });
  }

  ionViewDidLoad() {
    this.showMap();
    this.updatePosition();
    this.showFriends();
  }

  showMap() {
    this.map = L.map('map').setView([53.3, -6.3], 5);
    L.tileLayer(mapUrl, {'detectRetina': true})
      .addTo(this.map);
  }
  
  showFriends() {
    this.friend.getFriends().subscribe(friends => {
      this.friends = friends;
    })
  }
  
  updatePosition() {
    this.geo.getCurrentLocation().subscribe((coords) => {
      let marker = L.marker(L.latLng(coords.lat, coords.lng))
        .addTo(this.map)
        .bindPopup("Me")
        .openPopup();
        
      this.map.setView(L.latLng(coords.lat, coords.lng), 14);
      this.user.updateUserPosition(coords);
    }, (error) => {
      console.log('An error occurred tracking location');
    })
  }
}
