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

  constructor(public http: Http, private auth: AuthService) {}
  
  getFriends() {
    return Observable.create(observer => {
      return this.auth.getToken().subscribe(token => {
        let url = `${baseUrl}/friendlist/`;
        
        let headers = new Headers();
        headers.append('authorization', token);     
               
        this.http.get(url, { headers: headers })
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
  
  addFriend(username) {
    return Observable.create(observer => {
      return this.auth.getToken().subscribe(token => {
        let headers = new Headers();
        headers.append('authorization', token);       
        headers.append("Content-Type", "application/json");
             
        this.http.post(`${baseUrl}/addfriend/`, { headers: headers })
        .subscribe(res => {
          
        })
      });
    })
  }
  
  removeFriend() {
    
  }

}
