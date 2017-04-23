import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { baseUrl } from '../config/config'
import 'rxjs/add/operator/map';

import { AuthService } from './auth-service';

export class User {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  latitude: string;
  longitude: string;

  constructor(username: string, email: string, firstname: string, lastname: string, latitude: string, longitude: string) {
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
  private currentUser: User;

  constructor(private http: Http, private storage: Storage, private auth: AuthService) {}
  
  /*
    Get a user object. If none exists in local storage, make a request to the 
    api, store object in local storage and return object to user.
  */
  public getUserInfo() : any {
    return Observable.create(observer => {
      this.storage.get('user').then(value => { 
        if (value === null) {
          this.auth.getToken().subscribe(token => {
            
            let headers = new Headers();
            headers.append('authorization', token);            
            this.http.get(`${baseUrl}/userme/`, { headers: headers })
            .subscribe(res => {
              let user = res.json();
              this.setUserInfo(user).subscribe(newUser => {
                observer.next(newUser);
                observer.complete(); 
              })
            })
            
          });
        } else {
          observer.next(value);
        }
      },
      err => { 
        observer.error(err);
      });
    })
  }
  
  public setUserInfo(user) {    
    return Observable.create(observer => {
      this.storage.ready().then(() => { 
        this.currentUser = new User(
          user.properties.username, 
          user.properties.email, 
          user.properties.first_name, 
          user.properties.last_name,
          user.geometry.coordinates[1], 
          user.geometry.coordinates[0]
        );
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
    
    this.storage.set('user', this.currentUser);
    
    this.auth.getToken().subscribe(token => {
      let url = `${baseUrl}/updateposition/`;
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.append('lat', coords.lat);
      urlSearchParams.append('lon', coords.lng);
      let headers = new Headers();
      headers.append('Authorization', token);
      headers.append("Content-Type", "application/x-www-form-urlencoded")
      this.http.patch(url, urlSearchParams, { headers: headers }).subscribe()
    })
  }

}
