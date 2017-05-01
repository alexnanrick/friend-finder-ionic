import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { FriendService } from '../../providers/friend-service';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendPage {
  private friends: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public friend: FriendService, private alertCtrl: AlertController) {}

  ionViewDidLoad() {
    this.showFriends();
  }
  
  addFriend() {
    let alert = this.alertCtrl.create({
      title: 'Add Friend',
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            this.friend.addFriend(data).subscribe( {
              
            });
          }
        }
      ]
    });
    alert.present();
  }
  
  showFriends() {
    this.friend.getFriends().subscribe(friends => {
      this.friends = friends;
    })
  }
  
  deleteFriend(Friend) {
    
  }
}
