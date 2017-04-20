import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/*
  Generated class for the TokenService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TokenService {

  constructor(public http: Http, private storage: Storage) {}
  
  public setToken(token) {
    this.storage.ready().then(() => {
      this.storage.set('token', token);
      console.log("Token logged");
    })
  }
  
  public getToken() {
    console.log("GetToken called");
    
    this.storage.get('token').then((token) => {
      console.log(token);
      return token;
    });
  }

}
