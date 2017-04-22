import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { baseUrl } from '../config/config'
import 'rxjs';

import { User } from '../models/user'

@Injectable()
export class AuthService {
  
  constructor(private http: Http, private storage: Storage) {}
  
  /*
    Using the details provided by the user, attempt to get a token from the api.
    If a token is successfuly retrieved, get the user information and store both
    the user and their token in local storage.
  */
  public login(credentials) {
    if (credentials.username === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        let loginUrl = `${baseUrl}/tokenlogin/?username=${credentials.username}&password=${credentials.password}`;
        this.http.get(loginUrl)
        .map(res => res.json().token)
        .subscribe(token => {
          this.setToken(`Token ${token}`).subscribe(done => {
            observer.next(true);
            observer.complete(); 
          });                  
        }, err => {
          observer.next(false);
        })
      });
    }
  }

  public register(credentials) {
    if (credentials.username === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }
  
  /*
    Get a user object. If none exists in local storage, make a request to the 
    api, store object in local storage and return object to user.
  */
  public getUserInfo() : any {
    return Observable.create(observer => {
      this.storage.get('user').then(value => { 
        if (value === null) {
          this.getToken().subscribe(token => {
            let headers = new Headers();
            headers.append('authorization', token)
            
            this.http.get(`${baseUrl}/userme/`, { headers: headers })
            .subscribe(res => {
              let user = res.json();
              this.setUserInfo(user).subscribe(done => {
                observer.next(user);
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
        this.storage.set('user', user).then(() => {
          observer.next(true);
        });
      }).catch((err) => {
          console.log(err);
      });
    })
  }
  
  public getToken() : any {
    return Observable.create(observer => {
      this.storage.get('token').then(value => { 
        if (value === null) {
          observer.error(new Error('No token found'));  
        } else {
          observer.next(value);
        }
      },
      err => { 
        observer.error(err);
      });
    })
  }
  
  public setToken(token) {
    return Observable.create(observer => {
      this.storage.ready().then(() => { 
        this.storage.set('token', token).then(() => {
          observer.next(true);
        });
      }).catch((err) => {
          console.log(err);
      });
    })
  }

  public logout() {
    return Observable.create(observer => {
      this.setUserInfo('');
      observer.next(true);
      observer.complete();
    });
  }

}
