import { Component } from '@angular/core';
import { mapUrl } from '../../config/config'
import { NavController, App } from 'ionic-angular';
import * as L from 'leaflet';

import { GeoService } from '../../providers/geo-service';
import { UserService } from '../../providers/user-service';
import { FriendService } from '../../providers/friend-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private map: L.Map;
  private userMarker;
  private friends: any;
  private friendMarkers: any[];
  private initialLoad: boolean;

  constructor(public nav: NavController, private geo: GeoService, private user: UserService, private friend: FriendService, private app: App) {
    this.friendMarkers = [];
    this.initialLoad = true;
  }

  ionViewDidLoad() {
    console.log("Logged in");
    this.showMap();
    this.showFriends();
    this.watchLocation();
  }
  
  watchLocation() {
    this.user.getUserInfo().subscribe(() => {
      this.geo.startTracking().subscribe(coords => {
        console.log(coords);
        
        if (this.userMarker) {
          this.map.removeLayer(this.userMarker);
        }
        
        var greenIcon = new L.Icon({
          iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        
        this.userMarker = L.marker(L.latLng(coords.lat, coords.lng), {icon: greenIcon})
          .addTo(this.map)
        
        if (this.initialLoad) {
          this.map.setView(L.latLng(coords.lat, coords.lng), 14);
          this.userMarker
          .bindPopup("Me")
          .openPopup();
          this.initialLoad = false;
        }
      });
    }); 
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
    console.log("Friend toggled");
    let currentLatLon = L.latLng(this.user.getLatitude(), this.user.getLongitude());
    let geom = L.latLng(friend.geometry.coordinates[1], friend.geometry.coordinates[0]);
    let distance = geom.distanceTo(currentLatLon) < 1000 ? Math.round(geom.distanceTo(currentLatLon)) + ' m' : Math.round(geom.distanceTo(currentLatLon) / 1000) + ' km';
    let info = "<dl>" + "<dt>" + friend.properties.first_name + ' ' + friend.properties.last_name + "</dt>" + "<dt>" + distance + "</dt>" + "</dl>";
    
    if (this.friendMarkers[friend.id]) {
        this.map.removeLayer(this.friendMarkers[friend.id]);
        this.friendMarkers[friend.id] = null;
    } else {
        this.friendMarkers[friend.id] = L.marker(geom)
        .addTo(this.map)
        .bindPopup(info)
        .openPopup();
        this.map.panTo(geom, 16);
    }
  }
}
