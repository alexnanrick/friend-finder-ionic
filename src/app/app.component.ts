import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { LoginPage } from "../pages/login/login";
import { HomePage } from '../pages/home/home';
import { FriendPage } from '../pages/friends/friends';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from "../providers/auth-service";
import { GeoService } from "../providers/geo-service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // Make LoginPage the root (or first) page
  rootPage = HomePage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public auth: AuthService,
    public geo: GeoService
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      {title: 'Home', component: HomePage},
      {title: 'Friend List', component: FriendPage},
      {title: 'Logout', component: null}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    if(page.component) {
        this.nav.setRoot(page.component);

    } else {
      this.auth.logout().subscribe(() => {
        this.geo.stopTracking();
        // Redirect to home
        this.nav.setRoot(LoginPage);
      });
    }
  }
}
