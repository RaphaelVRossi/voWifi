import {Injectable} from '@angular/core';
import {DatabaseProvider} from "../database/database";
import {SQLiteObject} from "@ionic-native/sqlite";
import {ToastController} from "ionic-angular";

/*
  Generated class for the SimProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SimProvider {

  constructor(public dbProvider: DatabaseProvider, private toast: ToastController) {
    console.log('Hello SimProvider Provider');
  }

  public save(product: SimCard) {
    if (product.id) {
      this.toast.create({message: 'Update.', duration: 3000, position: 'botton'}).present();
      return this.update(product);
    } else {
      this.toast.create({message: 'Save.', duration: 3000, position: 'botton'}).present();
      return this.insert(product);
    }

  }

  private insert(simCard: SimCard) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into sim_card (sim_number, status_id) values (?, ?)';
        let data = [simCard.sim_number, simCard.status_id];

        return db.executeSql(sql, data).then(() => this.toast.create({message: 'insert sql.', duration: 3000, position: 'botton'}).present())
          .catch((e) => this.toast.create({message: 'erro insert sql.', duration: 3000, position: 'botton'}).present());
      })
      .catch((e) => console.error(e));
  }

  private update(product: SimCard) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'update sim_card set sim_number = ?, status_id = ? where id = ?';
        let data = [product.sim_number, product.status_id, product.id];

        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public remove(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from sim_card where id = ?';
        let data = [id];

        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getBySimNumber(sim_number: string) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select * from sim_card where sim_number = ?';
        let data = [sim_number];

        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let product = new SimCard();
              if (item) {
                product.id = item.id;
                product.sim_number = item.sim_number;
                product.status_id = item.status_id;
              }

              return product;
            }

            return null;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getById(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select * from sim_card where id = ?';
        let data = [id];

        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let product = new SimCard();
              product.id = item.id;
              product.sim_number = item.sim_number;
              product.status_id = item.status_id;

              return product;
            }

            return null;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
}

export class SimCard {
  id: number;
  sim_number: string;
  status_id: number;
}
