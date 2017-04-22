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
  currentUser: User;
  currentToken: string;
  
  constructor(private http: Http, private storage: Storage) {
    if (this.currentToken == null) {
      this.storage.ready().then(() => {
        this.storage.get('token').then(token => {
          this.currentToken = token;
        });
      })
    }
    
    if (this.currentUser == null) {
      this.storage.ready().then(() => {
        this.storage.get('user').then(user => {
          this.currentUser = user;
        });
      })
    }
  }
  
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
        let userUrl = `${baseUrl}/userme/`;
        this.http.get(loginUrl)
        .map(res => res.json().token)
        .subscribe(token => {
          let user = new User(credentials.username);
          this.setUserInfo(user);
          this.setToken(`Token ${token}`);
                            
          observer.next(true);
          observer.complete(); 
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

  public getUserInfo() : User {
    return this.currentUser;
  }
  
  public setUserInfo(user) {
    this.storage.ready().then(() => {
      this.storage.set('user', user);
      console.log("User logged");
    })
  }
  
  public getToken() : string {
    return this.currentToken;
  }
  
  public setToken(token) {
    this.storage.ready().then(() => {
      this.storage.set('token', token);
      console.log("Token logged");
    });
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }

}
