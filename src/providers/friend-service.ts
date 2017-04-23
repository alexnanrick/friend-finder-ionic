import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { baseUrl } from '../config/config'
import { AuthService } from './auth-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the FriendService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FriendService {

  constructor(public http: Http, private auth: AuthService) {
    console.log('Hello FriendService Provider');
  }
  
  getFriends() {
    return Observable.create(observer => {
      return this.auth.getToken().subscribe(token => {
        let headers = new Headers();
        headers.append('authorization', token);            
        this.http.get(`${baseUrl}/friends/`, { headers: headers })
        .subscribe(res => {
          let friends = res.json().features; 
      
          if (friends == null) {
            observer.error(new Error('No friends found'));  
          } else {
            observer.next(friends);
          }
        })
      });
    });
  }

}
