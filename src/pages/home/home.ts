import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Sim} from "@ionic-native/sim";
import {SimInsertPage} from "../sim-insert/sim-insert";
import {Network} from "@ionic-native/network";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public simInfo: any;
  public cards: any;
  public statusNetwork: any;

  constructor(public navCtrl: NavController,
              private sim: Sim,
              private network: Network) {

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
      this.statusNetwork = this.network.type;
    } catch (error) {
      console.log(error);
    }


    /*let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          this.statusNetwork = this.network.type;
          console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });*/
  }

}
