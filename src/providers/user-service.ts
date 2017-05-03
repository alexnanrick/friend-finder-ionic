import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { baseUrl } from '../config/config'
import 'rxjs/add/operator/map';

import { AuthService } from './auth-service';

/*
  Generated class for the FriendService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
export class User {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  latitude: number;
  longitude: number;

  constructor(username: string, email: string, firstname: string, lastname: string, latitude: number, longitude: number) {
    this.username = username;
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

@Injectable()
export class UserService {
  currentUser: User;

  constructor(private http: Http, private storage: Storage, private auth: AuthService) {}
  
  /*
    Get a user object. If none exists in local storage, make a request to the 
    api, store object in local storage and return object to user.
  */
  public getUserInfo() {
    return Observable.create(observer => {
      this.auth.getToken().subscribe(token => {
        let url = `${baseUrl}/userme/`;
        
        let headers = new Headers();
        headers.append('authorization', token);
                    
        this.http.get(url, { headers: headers })
        .subscribe(res => {
          let user = res.json();
          this.currentUser = new User(
            user.properties.username, 
            user.properties.email, 
            user.properties.first_name, 
            user.properties.last_name,
            user.geometry.coordinates[1], 
            user.geometry.coordinates[0]
          );
          observer.next(this.currentUser);
        })
        
      });
    })
  }
  
  public setUserInfo(user) {    
    return Observable.create(observer => {
      this.storage.ready().then(() => { 
        this.storage.set('user', this.currentUser).then(() => {
          observer.next(this.currentUser);
        });
      }).catch((err) => {
          console.log(err);
      });
    })
  }
  
  public updateUserPosition(coords) {
    this.currentUser.latitude = coords.lat;
    this.currentUser.longitude = coords.lng;
    
    this.storage.set('user', this.currentUser).then(() => {
      console.log("User location saved to local storage");
    });
    
    this.auth.getToken().subscribe(token => {
      let url = `${baseUrl}/position/`;
      
      let geo_data = {
        'lat': coords.lat,
        'lon': coords.lng
      }
      
      let headers = new Headers();
      headers.append('Authorization', token);
      headers.append("Content-Type", "application/json");
      
      this.http.patch(url, geo_data, { headers: headers }).subscribe();
    })
  }
  
  public getUsername() {
    return this.currentUser.username;
  }
  
  public getLatitude() {
    return this.currentUser.latitude;
  }
  
  public getLongitude() {
    return this.currentUser.longitude;
  }
}
