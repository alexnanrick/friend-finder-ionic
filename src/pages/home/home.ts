import { Component } from '@angular/core';
import { mapUrl } from '../../config/config'
import { NavController } from 'ionic-angular';
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
  private friends: any;
  private markers: any[];

  constructor(public nav: NavController, private auth: AuthService, private geo: GeoService, private user: UserService, private friend: FriendService) {
    this.markers = [];
    
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
  
  toggleFriend(friend) {
    let geom = L.latLng(friend.geometry.coordinates[1], friend.geometry.coordinates[0]);
    //let distance = geom.distanceTo(myLatLon) < 1000 ? Math.round(geom.distanceTo(myLatLon)) + ' m' : Math.round(geom.distanceTo(myLatLon) / 1000) + ' km';
    //let info = "<dl><dt>" + friend.properties.firstname + ' ' + friend.properties.lastname + "</dt>" + "<dd>" + distance + "</dd>";
    
    if (this.markers[friend.id]) {
        this.map.removeLayer(this.markers[friend.id]);
        this.markers[friend.id] = null;
    } else {
        this.markers[friend.id] = L.marker(geom)
        .addTo(this.map)
        //.bindPopup(this.info)
        .openPopup();

        this.map.panTo(geom, 16);
    }
  }
  
  updatePosition() {
    this.geo.getCurrentLocation().subscribe((coords) => {
      L.marker(L.latLng(coords.lat, coords.lng))
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
