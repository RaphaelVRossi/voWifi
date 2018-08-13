import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {SimCard, SimProvider} from "../../providers/sim/sim";
import {ResponsePage} from "../response/response";

/**
 * Generated class for the SimInsertPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sim-insert',
  templateUrl: 'sim-insert.html',
})
export class SimInsertPage {
  model: SimCard;
  showActivate: boolean;
  validPrefixs = ['(21) 98113', '(11) 98523', '(11) 98113'];

  constructor(public navCtrl: NavController, public navParams: NavParams, private simProvider: SimProvider,
              private toast: ToastController) {
  }

  ionViewDidLoad() {
    this.model = new SimCard();
    console.log('ionViewDidLoad SimInsertPage');
  }

  async simValueChange(number: any) {
    if (this.showActivate) {
      this.showActivate = null;
      this.model = new SimCard();
    }
    console.log(number.value);

    if (number.value && number.value.length == 15) {
      let isValid: boolean;
      for (let prefix in this.validPrefixs) {
        isValid = number.value.startsWith(this.validPrefixs[prefix]);
        if (isValid)
          break;
      }

      if (isValid) {
        await this.simProvider.getBySimNumber(number.value).then(
          (result: SimCard) => {
            console.log('Select');
            if (result)
              this.model = result;
            else {
              this.model.sim_number = number.value;
              this.model.status_id = 1;
            }

            this.showActivate = this.model && this.model.status_id === 1;

            this.toast.create({
              message: 'ID ' + this.model.id + ' Sim number ' + this.model.sim_number + ' Status do sim ' + this.model.status_id,
              duration: 3000,
              position: 'botton'
            }).present();
          }
        );
      } else {
        this.navCtrl.push(ResponsePage, {
          'response': 'ERROR!\nAvailable only for TIM Brasil Employees',
          'error': true
        });
      }
    }
  }

  async activateSim() {
    this.model.status_id = 2;

    this.simProvider.save(this.model).then(
      () => {
        this.navCtrl.push(ResponsePage, {
          'response': 'Numero ativado'
        });
        this.showActivate = this.model && this.model.status_id === 1;
        this.toast.create({message: 'Ativado.', duration: 3000, position: 'botton'}).present();
      }
    ).catch(
      () => {
        this.toast.create({message: 'Erro ao ativar.', duration: 3000, position: 'botton'}).present();
      }
    );
  }

  async deactivateSim() {
    this.model.status_id = 1;

    this.simProvider.save(this.model).then(
      () => {
        this.navCtrl.push(ResponsePage, {
          'response': 'Numero desativado'
        });
        this.showActivate = this.model && this.model.status_id === 1;
        this.toast.create({message: 'Desativado.', duration: 3000, position: 'botton'}).present();
      }
    ).catch(
      () => {
        this.toast.create({message: 'Erro ao desativado.', duration: 3000, position: 'botton'}).present();
      }
    );
  }

}
