import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';


@Component({
  templateUrl: 'verify-uber.html'
})
export class VerifyUber {
  constructor(public navCtrl: NavController) {
  }

  openApplyPromo() {
    InAppBrowser.open("https://get.uber.com/invite/BITBAR", '_system', 'location=true');
    this.navCtrl.pop();
  }
}
