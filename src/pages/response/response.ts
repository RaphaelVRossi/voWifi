import {Component} from '@angular/core';
import {IonicPage, NavParams} from 'ionic-angular';

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
  cause: string = null;
  error: boolean = false;

  constructor(public navParams: NavParams) {
    this.response = this.navParams.get('response');
    let causeCache = this.navParams.get('cause');
    this.cause = causeCache ? causeCache : null;
    this.error = this.navParams.get('error');
  }
}
