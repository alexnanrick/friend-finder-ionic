import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
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
        let url = `${baseUrl}/friends/`;
        
        let friend_data = {
          "username": username['username']
        }
        
        let headers = new Headers();
        headers.append('authorization', token);       
        headers.append("Content-Type", "application/json");
             
        this.http.post(url, friend_data, { headers: headers })
          .subscribe(res => {})
      });
    })
  }
  
  deleteFriend(friend) {
    return Observable.create(observer => {
      return this.auth.getToken().subscribe(token => {
        let url = `${baseUrl}/friends/`;
        
        let friend_data = {
          "username": friend.properties.username
        }
        
        let headers = new Headers();
        headers.append('authorization', token);       
        headers.append("Content-Type", "application/json");
        
        let options = new RequestOptions({ body: friend_data, headers: headers });
        
        this.http.delete(url, options)
          .subscribe(res => {
            observer.next();
          })
      });
    })
  }

}
