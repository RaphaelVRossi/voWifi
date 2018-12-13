import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  constructor(public sqlite: SQLite) {
  }

  public getDB() {
    return this.sqlite.create({
      name: 'voWifi.db',
      location: 'default'
    });
  }

  public async createDatabase() {
    return this.getDB()
      .then((db: SQLiteObject) => {

        // Criando as tabelas
        this.createTables(db).catch((err) => console.log(JSON.stringify(err)));

        // Inserindo dados padrão
        this.insertDefaultItems(db).catch((err) => console.log(JSON.stringify(err)));

      })
      .catch(e => console.log(JSON.stringify(e)));
  }

  private async createTables(db: SQLiteObject) {
    await db.sqlBatch([
      ['create table if not exists status(id integer primary key autoincrement, description text)'],
      ['create table if not exists sim_card(id integer primary key autoincrement, sim_number text, sim_subscriber_id text, status_id integer, foreign key(status_id) references status(id))'],
      ['create table if not exists params(id integer primary key autoincrement, key_param text, value_param text)'],
    ])
      .then(() => console.log('Created default tables'))
      .catch(e => console.log(`Error creating tables, error [${JSON.stringify(e)}])`));
  }

  private async insertDefaultItems(db: SQLiteObject) {
    await db.executeSql('select count(id) as "qtd" from status', [])
      .then((data: any) => {
        //Se não existe nenhum registro
        /*this.toast.create({
          message: 'Select status OK ' + data.rows.item(0).qtd,
          duration: 3000,
          position: 'botton'
        }).present();*/
        if (data.rows.item(0).qtd == 0) {
          // Inserindo dados
          db.sqlBatch([
            ['insert into status (description) values (?)', ['Ativo']],
            ['insert into status (description) values (?)', ['Desativado']]
          ])
            .then(() => console.log('Insert status OK'))
            .catch(e => console.log(`Error inserting status ${JSON.stringify(e)}`));
        }
      })
      .catch(e => console.log(JSON.stringify(e)));

    await db.executeSql('select count(id) as "qtd" from sim_card', [])
      .then((data: any) => {
        //Se não existe nenhum registro
        if (data.rows.item(0).qtd == 0) {
          // Criando as tabelas
          db.sqlBatch([
            ['insert into sim_card (sim_number, sim_subscriber_id, status_id) values (?, ?, ?)', ['(11) 11111-1111', '777555222111', '1']],
            ['insert into sim_card (sim_number, sim_subscriber_id, status_id) values (?, ?, ?)', ['(22) 22222-2222', '777555222112', '1']]
          ])
            .then(() => console.log('Insert OK'))
            .catch(e => console.log(JSON.stringify(e)));
        }
      })
      .catch(e => console.log(JSON.stringify(e)));

    await db.executeSql('select count(id) as "qtd" from params', [])
      .then((data: any) => {
        //Se não existe nenhum registro
        if (data.rows.item(0).qtd == 0) {
          // Criando as tabelas
          db.sqlBatch([
            ['insert into params (key_param, value_param) values (?, ?)', ['url', '135.109.210.53:5000']]
          ])
            .then(() => console.log('Insert OK'))
            .catch(e => console.log(JSON.stringify(e)));
        }
      })
      .catch(e => console.log(JSON.stringify(e)));
  }
}
