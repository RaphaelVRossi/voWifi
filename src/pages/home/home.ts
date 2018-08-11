import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Sim } from "@ionic-native/sim";

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

  async join() {
    /*
        let simInfo = await this.sim.getSimInfo();

        let hasPermission = await this.sim.hasReadPermission();

        let prompt = this.alert.create({
          title: simInfo.countryCode,
          subTitle: 'qtd:' + simInfo.cards.size +
            ' Permission: ' + hasPermission +
            ' Index0: ' + simInfo.cards[0].simSlotIndex +
            ' DisplayName0: '+ simInfo.cards[0].displayName +
            ' PhoneNumber0: ' + simInfo.cards[0].phoneNumber +
            ' PhoneNumberSim: ' + simInfo.phoneNumber +
            ' SimSerialNumber0: ' + simInfo.simSerialNumber +
            ' CarrierName0: '+ simInfo.cards[0].carrierName
          ,
          buttons: ['OK']
        });

        prompt.present();*/
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
