import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {SimCard, SimProvider} from "../../providers/sim/sim";
import {ResponsePage} from "../response/response";
import {Http} from "@angular/http";
import {Params, ParamsProvider} from "../../providers/sim/params";

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
  showActivate: boolean = true;
  validPrefixs = ['(21) 98113', '(11) 98523', '(11) 98113'];

  simInfo: any;

  params: Params;

  constructor(public navCtrl: NavController, public navParams: NavParams, private simProvider: SimProvider,
              private toast: ToastController, private http: Http, private loadingCtrl: LoadingController,
              private paramsProvider: ParamsProvider) {
    this.simInfo = this.navParams.get('simInfo');
    this.model = new SimCard();
    if (this.simInfo)
      this.model.sim_subscriber_id = this.simInfo.simSubscriberId;

    this.paramsProvider.getByKey('url').then(value => {
      if (value)
        this.params = value;
    })
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

          /*this.toast.create({
            message: 'ID ' + this.model.id + ' Sim number ' + this.model.sim_number + ' Status do sim ' + this.model.status_id,
            duration: 3000,
            position: 'botton'
          }).present();*/
        }
      );
    }
  }

  async activateSim() {
    // let isValid: boolean = true;
    // for (let prefix in this.validPrefixs) {
    //   isValid = this.model.sim_number.startsWith(this.validPrefixs[prefix]);
    //   if (isValid)
    //     break;
    // }

    // if (isValid) {
    let data = {
      serviceSpecification: {
        id: "vowifi"
      },
      serviceCharacteristic: [
        {
          // name: "msisdn", value: SimInsertPage.clearSimNumber(this.model.sim_subscriber_id)
          name: "msisdn", value: this.model.sim_subscriber_id
        }
      ]
    };

    let loading = this.loadingCtrl.create({
      content: 'Carregando...',
      spinner: 'dots'
    });

    loading.present();
    await this.http.post('http://' + this.params.value_param + '/api/v1/activation/service', data).toPromise().then(
      (response) => {
        loading.dismiss();
        console.log(response);
        this.model.status_id = 2;

        this.simProvider.save(this.model).then(
          () => {
            this.navCtrl.push(ResponsePage, {
              'response': 'Parabéns: Seu serviço VoWIFI está ativo e pronto para uso'
            });
            this.showActivate = this.model && this.model.status_id === 1;
            // this.toast.create({message: 'Ativado.', duration: 3000, position: 'botton'}).present();
          }
        ).catch(
          () => {
            // this.toast.create({message: 'Erro ao ativar.', duration: 3000, position: 'botton'}).present();
          }
        );
      }
    ).catch(
      () => {
        loading.dismiss();
        this.navCtrl.push(ResponsePage, {
          'response': 'Erro ao acessar os dados',
          'error': true
        })
      }
    );
    // } else {
    //   this.navCtrl.push(ResponsePage, {
    //     'response': 'Serviço disponível somente para colaboradores da TIM',
    //     'error': true
    //   });
  }

  async deactivateSim() {
    let loading = this.loadingCtrl.create({
      content: 'Carregando...',
      spinner: 'dots'

    });
    loading.present();
    // await this.http.delete('http://135.109.210.53:5000/api/v1/activation/service/vowifi-', {params: {'MSISDN': SimInsertPage.clearSimNumber(this.model.sim_number)}}).toPromise().then(
    // await this.http.delete('http://135.109.210.53:5000/api/v1/activation/service/vowifi-' + SimInsertPage.clearSimNumber(this.model.sim_number)).toPromise().then(
    await this.http.delete('http://' + this.params.value_param + '/api/v1/activation/service/vowifi-' + this.model.sim_number).toPromise().then(
      () => {
        loading.dismiss();
        this.model.status_id = 1;

        this.simProvider.save(this.model).then(
          () => {
            this.navCtrl.push(ResponsePage, {
              'response': 'Seu serviço VoWIFI foi desativado'
            });
            this.showActivate = this.model && this.model.status_id === 1;
            // this.toast.create({message: 'Desativado.', duration: 3000, position: 'botton'}).present();
          }
        ).catch(
          () => {
            // this.toast.create({message: 'Erro ao desativado.', duration: 3000, position: 'botton'}).present();
          }
        );
      }
    ).catch(
      () => {
        loading.dismiss();
        this.navCtrl.push(ResponsePage, {
          'response': 'Erro ao acessar os dados',
          'error': true
        })
      }
    );
  }

  static clearSimNumber(sim_number: string) {
    return sim_number.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
  }
}
