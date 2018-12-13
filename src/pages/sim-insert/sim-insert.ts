import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {SimCard, SimProvider} from "../../providers/sim/sim";
import {ResponsePage} from "../response/response";
import {Params, ParamsProvider} from "../../providers/sim/params";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {
  generateError,
  getXmlValueFromStatusMessageTag,
  getXmlValueFromStatusTag,
  prepareXmlData
} from "../../utils/StringUtils";

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
  // validPrefixs = ['(21) 98113', '(11) 98523', '(11) 98113'];

  ACTIVATE: string = 'PROVIDE';
  CEASE: string = 'CEASE';

  simInfo: any;

  params: Params;

  response: any = '';
  status: any = '';
  message: any = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private simProvider: SimProvider,
              private http: HttpClient, private loadingCtrl: LoadingController,
              private paramsProvider: ParamsProvider) {
    this.simInfo = this.navParams.get('simInfo') ? JSON.parse(this.navParams.get('simInfo')) : null;
    this.model = new SimCard();

    if (this.simInfo && this.simInfo.subscriberId) {
      this.simProvider.getBySimSubscriberId(this.simInfo.subscriberId).then((value: SimCard) => {
        if (value) {
          this.model = value;
          this.showActivate = this.model && this.model.status_id === 1;
        } else {
          this.model = new SimCard();
          this.model.sim_subscriber_id = this.simInfo.subscriberId;
        }
      });
    }

    this.paramsProvider.getByKey('url').then(value => {
      if (value)
        this.params = value;
    });
  }

  activateSimSoap() {
    this.sendRequestSoap(this.ACTIVATE);
  }

  deactivateSimSoap() {
    this.sendRequestSoap(this.CEASE);
  }

  sendRequestSoap(action: string) {
    let body = this.generateRequestBody(action);

    let loading = this.loadingCtrl.create({
      content: 'Carregando...',
      spinner: 'dots'
    });

    loading.present().catch((err) => console.log(err));

    console.log('sending request to ' + this.params.value_param + ' with body ' + body);

    this.http.post(this.params.value_param, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/soap+xml'
      }),
      responseType: 'text'
    }).toPromise().then((response) => {
        let isActivate = action == this.ACTIVATE;

        this.response = response;

        loading.dismiss().catch((err) => console.log(err));
        console.log(response);
        this.model.status_id = isActivate ? 2 : 1;

        let responseXml = prepareXmlData(response);

        this.status = getXmlValueFromStatusTag(responseXml);
        this.message = getXmlValueFromStatusMessageTag(responseXml);

        if (this.status == '9') {
          this.simProvider.save(this.model).then(() => {
              this.navCtrl.push(ResponsePage, {
                'response': (isActivate ? 'Parabéns: Seu serviço VoWIFI está ativo e pronto para uso' : 'Seu serviço VoWIFI foi desativado')
              }).catch((err) => console.log(err));
              this.showActivate = this.model && this.model.status_id === 1;
            }
          ).catch(() => {
              this.navCtrl.push(ResponsePage, {
                'response': 'Erro ao salvar os dados.',
                'error': true
              }).catch((err) => console.log(err));
            }
          );
        } else
          this.navCtrl.push(ResponsePage, {
            'response': this.message,
            'error': true
          }).catch((err) => console.log(err));
      }
    ).catch((err) => {
        loading.dismiss().catch((err) => console.log(err));
        console.log('ERROR ' + JSON.stringify(err));
        console.log('ERROR type' + typeof err);
        this.navCtrl.push(ResponsePage, {
          'response': 'Erro ao acessar os dados',
          'error': true,
          'cause': generateError(err)
        }).catch((err) => console.log(err));
      }
    );
  }

  private generateRequestBody(action: string): string {
    let body: string = '';

    // noinspection XmlUnusedNamespaceDeclaration
    body = body
      .concat('<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ins="http://soa.comptel.com/2011/02/instantlink">')
      .concat('<soap:Header/>')
      .concat('<soap:Body>')
      .concat('<ins:CreateRequest>')
      .concat('<ins:RequestHeader>')
      .concat('<ins:NeType>APP</ins:NeType>')
      .concat('<ins:OrderNo>123</ins:OrderNo>')
      .concat('<ins:ReqUser>APP</ins:ReqUser>')
      .concat('</ins:RequestHeader>')
      .concat('<ins:RequestParameters>')
      .concat('<ins:Parameter name="ACTION" value="').concat(action).concat('"/>')
      .concat('<ins:Parameter name="IMSI1" value="').concat(this.model.sim_subscriber_id).concat('"/>')
      .concat('<ins:Parameter name="SERVICE_NAME" value="CFS_VOWIFI"/>')
      .concat('</ins:RequestParameters>')
      .concat('</ins:CreateRequest>')
      .concat('</soap:Body>')
      .concat('</soap:Envelope>');

    return body
  }

  // async simValueChange(number: any) {
  //   if (this.showActivate) {
  //     this.showActivate = null;
  //     this.model = new SimCard();
  //   }
  //   console.log(number.value);
  //
  //   if (number.value && number.value.length == 15) {
  //     await this.simProvider.getBySimNumber(number.value).then(
  //       (result: SimCard) => {
  //         console.log('Select');
  //         if (result)
  //           this.model = result;
  //         else {
  //           this.model.sim_number = number.value;
  //           this.model.status_id = 1;
  //         }
  //
  //         this.showActivate = this.model && this.model.status_id === 1;
  //
  //         /*this.toast.create({
  //           message: 'ID ' + this.model.id + ' Sim number ' + this.model.sim_number + ' Status do sim ' + this.model.status_id,
  //           duration: 3000,
  //           position: 'botton'
  //         }).present();*/
  //       }
  //     );
  //   }
  // }
  //
  // async activateSim() {
  //   // let isValid: boolean = true;
  //   // for (let prefix in this.validPrefixs) {
  //   //   isValid = this.model.sim_number.startsWith(this.validPrefixs[prefix]);
  //   //   if (isValid)
  //   //     break;
  //   // }
  //
  //   // if (isValid) {
  //   let data = {
  //     serviceSpecification: {
  //       id: "vowifi"
  //     },
  //     serviceCharacteristic: [
  //       {
  //         // name: "msisdn", value: SimInsertPage.clearSimNumber(this.model.sim_subscriber_id)
  //         name: "msisdn", value: this.model.sim_subscriber_id
  //       }
  //     ]
  //   };
  //
  //   let loading = this.loadingCtrl.create({
  //     content: 'Carregando...',
  //     spinner: 'dots'
  //   });
  //
  //   loading.present();
  //   await this.http.post('http://' + this.params.value_param + '/api/v1/activation/service', data).toPromise().then(
  //     (response) => {
  //       loading.dismiss();
  //       console.log(response);
  //       this.model.status_id = 2;
  //
  //       this.simProvider.save(this.model).then(
  //         () => {
  //           this.navCtrl.push(ResponsePage, {
  //             'response': 'Parabéns: Seu serviço VoWIFI está ativo e pronto para uso'
  //           });
  //           this.showActivate = this.model && this.model.status_id === 1;
  //           // this.toast.create({message: 'Ativado.', duration: 3000, position: 'botton'}).present();
  //         }
  //       ).catch(
  //         () => {
  //           // this.toast.create({message: 'Erro ao ativar.', duration: 3000, position: 'botton'}).present();
  //         }
  //       );
  //     }
  //   ).catch(
  //     () => {
  //       loading.dismiss();
  //       this.navCtrl.push(ResponsePage, {
  //         'response': 'Erro ao acessar os dados',
  //         'error': true
  //       })
  //     }
  //   );
  //   // } else {
  //   //   this.navCtrl.push(ResponsePage, {
  //   //     'response': 'Serviço disponível somente para colaboradores da TIM',
  //   //     'error': true
  //   //   });
  // }
  //
  // async deactivateSim() {
  //   let loading = this.loadingCtrl.create({
  //     content: 'Carregando...',
  //     spinner: 'dots'
  //
  //   });
  //   loading.present();
  //   // await this.http.delete('http://135.109.210.53:5000/api/v1/activation/service/vowifi-', {params: {'MSISDN': SimInsertPage.clearSimNumber(this.model.sim_number)}}).toPromise().then(
  //   // await this.http.delete('http://135.109.210.53:5000/api/v1/activation/service/vowifi-' + SimInsertPage.clearSimNumber(this.model.sim_number)).toPromise().then(
  //   await this.http.delete('http://' + this.params.value_param + '/api/v1/activation/service/vowifi-' + this.model.sim_number).toPromise().then(
  //     () => {
  //       loading.dismiss();
  //       this.model.status_id = 1;
  //
  //       this.simProvider.save(this.model).then(
  //         () => {
  //           this.navCtrl.push(ResponsePage, {
  //             'response': 'Seu serviço VoWIFI foi desativado'
  //           });
  //           this.showActivate = this.model && this.model.status_id === 1;
  //           // this.toast.create({message: 'Desativado.', duration: 3000, position: 'botton'}).present();
  //         }
  //       ).catch(
  //         () => {
  //           // this.toast.create({message: 'Erro ao desativado.', duration: 3000, position: 'botton'}).present();
  //         }
  //       );
  //     }
  //   ).catch(
  //     () => {
  //       loading.dismiss();
  //       this.navCtrl.push(ResponsePage, {
  //         'response': 'Erro ao acessar os dados',
  //         'error': true
  //       })
  //     }
  //   );
  // }
  //
  // static clearSimNumber(sim_number: string) {
  //   return sim_number.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
  // }
}
