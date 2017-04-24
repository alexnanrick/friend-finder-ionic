import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Observable } from "rxjs/Observable";
import 'rxjs';

import { UserService } from './user-service';

/*
  Generated class for the GeoService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GeoService {
  public watch: any;    
  public lat: number = 0;
  public lng: number = 0;

  constructor(public http: Http, public geolocation: Geolocation, public backgroundGeolocation: BackgroundGeolocation, public zone: NgZone, public user: UserService) {}
  
  startTracking() {
    return Observable.create(observer => {
      // Background Tracking
      let config = {
        desiredAccuracy: 0,
        stationaryRadius: 20,
        distanceFilter: 10, 
        debug: true,
        interval: 2000 
      };
     
      this.backgroundGeolocation.configure(config).subscribe((location) => {
        console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
        // Run update inside of Angular's zone
        this.zone.run(() => {
          this.lat = location.latitude;
          this.lng = location.longitude;
        });
     
      }, (err) => {
        console.log(err);
      });
      // Turn ON the background-geolocation system.
      this.backgroundGeolocation.start();
     
      // Foreground Tracking
      let options = {
        frequency: 3000, 
        enableHighAccuracy: true
      };
       
      this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
        console.log(position);
        observer.next({lat: position.coords.latitude, lng: position.coords.longitude});
        this.user.updateUserPosition({lat: position.coords.latitude, lng: position.coords.longitude});
        // Run update inside of Angular's zone
        this.zone.run(() => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        });
      });
    });
  }
 
  stopTracking() {
    console.log('stopTracking');
    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
  }

}
