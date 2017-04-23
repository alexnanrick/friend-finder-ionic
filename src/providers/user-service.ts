import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { baseUrl } from '../config/config'
import 'rxjs/add/operator/map';

import { User } from '../models/user'
import { Geometry } from '../models/geometry'

import { AuthService } from './auth-service';

/*
  Generated class for the UserService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserService {

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
        let newGeometry = new Geometry(user.geometry.coordinates[0], user.geometry.coordinates[1]);
        let newUser = new User(user.properties.username, user.properties.email, user.properties.first_name, user.properties.last_name, newGeometry);
        this.storage.set('user', newUser).then(() => {
          observer.next(newUser);
        });
      }).catch((err) => {
          console.log(err);
      });
    })
  }
  
  public updateUserPosition(coords) {
    this.getUserInfo().subscribe(user => {
      this.storage.ready().then(() => { 
        let geometry = new Geometry(coords.lat, coords.lng);
        user.geometry = geometry;
        this.storage.set('user', user);
        
        this.auth.getToken().subscribe(token => {
          let url = `${baseUrl}/updateposition/`;
          let urlSearchParams = new URLSearchParams();
          urlSearchParams.append('lat', coords.lat);
          urlSearchParams.append('lon', coords.lng);
          let headers = new Headers();
          headers.append('Authorization', token);
          headers.append("Content-Type", "application/x-www-form-urlencoded")
          this.http.patch(url, urlSearchParams, { headers: headers })
          .subscribe()
          })
        
      });
    }).catch((err) => {
        console.log(err);
    });
  }

}
