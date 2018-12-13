import {Component} from '@angular/core';
import {LoadingController, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {Sim} from "@ionic-native/sim";
import {SimInsertPage} from "../sim-insert/sim-insert";
import {Network} from "@ionic-native/network";
import {Params, ParamsProvider} from "../../providers/sim/params";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public simInfo: any;
  public cards: any;
  public statusNetwork: any;

  public teste: string;

  constructor(public navCtrl: NavController,
              private sim: Sim,
              private network: Network,
              private loadingCtrl: LoadingController,
              private modalCtrl: ModalController) {
  }

  async moveToSimPage() {
    let loading = this.loadingCtrl.create({
      content: 'Carregando...',
      spinner: 'dots'
    });
    loading.present().catch((err) => console.log(err));
    this.sim.requestReadPermission().then(
      () => console.log('Permission granted'),
    ).catch(() => console.log('Permission denied'));
    await this.getSimData().then(() => loading.dismiss()).catch(err => {
      console.log(JSON.stringify(err));
      loading.dismiss().catch((err) => console.log(err));
    });

    console.log('TESTE ' + JSON.stringify(this.simInfo));

    this.navCtrl.push(SimInsertPage, {
      'simInfo': JSON.stringify(this.simInfo)
    }).then(() => loading.dismiss())
      .catch(err => console.log(JSON.stringify(err)));

    // if (this.simInfo) {
    //
    // } else {
    //   this.navCtrl.push(ResponsePage, {
    //     'response': 'Erro ao ler dados do SIM',
    //     'error': true
    //   })
    // }
  }

  async getSimData() {
    try {
      let simPermission = await this.sim.requestReadPermission();
      if (simPermission == "OK") {
        let simData = await this.sim.getSimInfo();
        this.simInfo = simData;
        this.teste = JSON.stringify(this.simInfo);
        this.cards = simData.cards;
        console.log(this.teste);
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

  openModal() {
    let profileModal = this.modalCtrl.create(Options, {userId: 8675309});
    profileModal.present().catch((err) => console.log(err));

  }
}

@Component({
  selector: 'export-tool-kit',
  template: `
    <div style="padding-top: 50px;">
      <ion-card style="position: relative; text-align: center;">
        <ion-card-header>
          <h2>Configurações</h2>
        </ion-card-header>

        <ion-card-content>
          <ion-list>
            <ion-item>
              <ion-label color="primary" floating>URL de acesso</ion-label>
              <ion-input [(ngModel)]="url" type="text"></ion-input>
            </ion-item>
          </ion-list>
        </ion-card-content>

        <ion-row>
          <ion-col>
            <button ion-button clear small (click)="save()">
              <div>Salvar</div>
            </button>
          </ion-col>
          <ion-col>
            <button ion-button clear small color="danger" (click)="cancel()">
              <div>Cancelar</div>
            </button>
          </ion-col>
        </ion-row>
      </ion-card>
    </div>
  `
})
export class Options {
  url: string = '';
  params: Params;

  constructor(params: NavParams, private viewController: ViewController,
              private paramsProvider: ParamsProvider) {
    console.log('UserId', params.get('userId'));
    this.paramsProvider.getByKey('url').then(value => {
      if (value) {
        this.url = value.value_param;
        this.params = value;
      }
    })
  }

  cancel() {
    this.viewController.dismiss().catch((err) => console.log(err));
  }

  save() {
    if (!this.params) {
      this.params = new Params(null);
      this.params.key_param = 'url';
    }

    this.params.value_param = this.url;
    this.paramsProvider.save(this.params).catch((err) => console.log(err));
    this.cancel();
  }
}
