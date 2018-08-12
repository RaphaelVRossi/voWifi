import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {ToastController} from "ionic-angular";

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  constructor(public sqlite: SQLite, private toast: ToastController) {
  }

  public getDB() {
    return this.sqlite.create({
      name: 'voWifi.db',
      location: 'default'
    });
  }

  public createDatabase() {
    return this.getDB()
      .then((db: SQLiteObject) => {
        // this.toast.create({ message: 'Dados OK getDB', duration: 3000, position: 'botton' }).present();
        // Criando as tabelas
        this.createTables(db);

        // Inserindo dados padrão
        this.insertDefaultItems(db);

      })
      .catch(e => {
        console.log(e);
        // this.toast.create({ message: 'Dados erro getDB', duration: 3000, position: 'botton' }).present();
      });
  }

  private async createTables(db: SQLiteObject) {
    // Criando as tabelas

    db.sqlBatch([
      ['create table if not exists status(id integer primary key autoincrement, description text)'],
      ['create table if not exists sim_card(id integer primary key autoincrement, sim_number text, status_id integer, foreign key(status_id) references status(id))']
    ])
      .then(() => this.toast.create({message: 'TABELA OK', duration: 3000, position: 'botton'}).present())
      .catch(e => this.toast.create({message: 'TABELA ERRO', duration: 3000, position: 'botton'}).present());
  }

  private async insertDefaultItems(db: SQLiteObject) {
    await db.executeSql('select count(id) as "qtd" from status', [])
      .then((data: any) => {
        //Se não existe nenhum registro
        this.toast.create({
          message: 'Select status OK ' + data.rows.item(0).qtd,
          duration: 3000,
          position: 'botton'
        }).present();
        if (data.rows.item(0).qtd == 0) {
          // Criando as tabelas
          db.sqlBatch([
            ['insert into status (description) values (?)', ['Ativo']],
            ['insert into status (description) values (?)', ['Desativado']]
          ])
            .then(() => this.toast.create({message: 'insert status OK', duration: 3000, position: 'botton'}).present())
            .catch(e => this.toast.create({
              message: 'insert status NOK',
              duration: 3000,
              position: 'botton'
            }).present());
        }
      })
      .catch(e => this.toast.create({
        message: 'Erro ao consultar a qtd de status',
        duration: 3000,
        position: 'botton'
      }).present());

    await db.executeSql('select count(id) as "qtd" from sim_card', [])
      .then((data: any) => {
        //Se não existe nenhum registro
        this.toast.create({
          message: 'Select sim_card OK ' + data.rows.item(0).qtd,
          duration: 3000,
          position: 'botton'
        }).present();
        if (data.rows.item(0).qtd == 0) {
          // Criando as tabelas
          db.sqlBatch([
            ['insert into sim_card (sim_number, status_id) values (?, ?)', ['(11) 11111-1111', '1']],
            ['insert into sim_card (sim_number, status_id) values (?, ?)', ['(22) 22222-2222', '1']]
          ])
            .then(() => this.toast.create({
              message: 'insert sim_card OK',
              duration: 3000,
              position: 'botton'
            }).present())
            .catch(e => this.toast.create({
              message: 'insert sim_card NOK',
              duration: 3000,
              position: 'botton'
            }).present());
        }
      })
      .catch(e => this.toast.create({
        message: 'Erro ao consultar a qtd de sim_card',
        duration: 3000,
        position: 'botton'
      }).present());

  }
}
