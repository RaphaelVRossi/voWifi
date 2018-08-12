import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ResponsePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-response',
  templateUrl: 'response.html',
})
export class ResponsePage {
  response: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.response = this.navParams.get('response');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResponsePage');
  }

}
