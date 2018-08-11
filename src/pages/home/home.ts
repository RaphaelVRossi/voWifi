import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Sim } from "@ionic-native/sim";
import {SimInsertPage} from "../sim-insert/sim-insert";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public simInfo: any;
  public cards: any;

  constructor(public navCtrl: NavController, private sim: Sim, private alert: AlertController) {

    /*this.sim.requestReadPermission().then(
      () => console.log('Permission granted'),
      () => console.log('Permission denied')
    );*/
  }

  async moveToSimPage() {
    console.log('TESTE');
    this.navCtrl.push(SimInsertPage)
  }

  async getSimData() {
    try {
      let simPermission = await this.sim.requestReadPermission();
      if (simPermission == "OK") {
        let simData = await this.sim.getSimInfo();
        this.simInfo = simData;
        this.cards = simData.cards;
        console.log(simData);
      }
    } catch (error) {
      console.log(error);
    }
  }

}
