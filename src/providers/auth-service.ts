import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { baseUrl } from '../config/config'
import 'rxjs';

export class User {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;

  constructor(username: string, email: string, firstname: string, 
    lastname: string, password: string) {
    this.username = username;
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = password;
  }
}

@Injectable()
export class AuthService {
  currentUser: User;
  currentToken: string;
  
  constructor(private http: Http) {}

  public login(credentials) {
    if (credentials.username === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!    
        let loginUrl = `${baseUrl}/tokenlogin/?username=${credentials.username}&password=${credentials.password}`;
        let userUrl = `${baseUrl}/userme/`;
        this.http.get(loginUrl)
        .map(res => res.json().token)
        .subscribe(token => {
          console.log("Auth service token: " + token);
          this.currentToken = `Token ${token}`;
          
          let headers = new Headers();
          headers.append("Authorization", this.currentToken);
          
          this.http.get(userUrl, { headers: headers })
          .map(res => res.json())
          .subscribe(user => {
            console.log(user);
          });
          
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
  
  public getToken() : String {
    return this.currentToken;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }

}
