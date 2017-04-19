import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { baseUrl } from '../config/config'
import 'rxjs';

export class User {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  hey: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

@Injectable()
export class AuthService {
  currentUser: User;
  token: string;
  
  constructor(private http: Http) {
    this.http = http;
  }

  public login(credentials) {
    if (credentials.username === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!    
        let loginUrl = `${baseUrl}/tokenlogin/?username=${credentials.username}&password=${credentials.password}`;
        this.http.get(loginUrl)
        .map(res => res.json().token)
        .subscribe(token => {
          console.log(token);
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

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }

}
