import {Injectable} from '@angular/core';
import {DatabaseProvider} from "../database/database";
import {SQLiteObject} from "@ionic-native/sqlite";

/*
  Generated class for the SimProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SimProvider {

  constructor(public dbProvider: DatabaseProvider) {
    console.log('Hello SimProvider Provider');
  }

  public save(product: SimCard) {
    if (product.id)
      return this.update(product);
    else
      return this.insert(product);
  }

  private insert(product: SimCard) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into sim_card (sim_number, status_id) values (?, ?)';
        let data = [product.sim_number, product.status_id];

        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
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
