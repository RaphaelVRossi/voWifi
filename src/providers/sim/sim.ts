import {Injectable} from '@angular/core';
import {DatabaseProvider} from "../database/database";
import {SQLiteObject} from "@ionic-native/sqlite";
import {consoleLogSqlError, consoleLogSqlSuccess, generateError} from "../../utils/StringUtils";

/*
  Generated class for the SimProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SimProvider {

  constructor(public dbProvider: DatabaseProvider) {
  }

  public save(product: SimCard) {
    if (product.id) {
      return this.update(product);
    } else {
      return this.insert(product);
    }
  }

  private insert(simCard: SimCard) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into sim_card (sim_number, sim_subscriber_id, status_id) values (?, ?, ?)';
        let data = [simCard.sim_number, simCard.sim_subscriber_id, simCard.status_id];

        return db.executeSql(sql, data).then(() => consoleLogSqlSuccess(sql, data))
          .catch((e) => consoleLogSqlError(sql, data, e));
      })
      .catch((e) =>console.log(generateError(e)));
  }

  private update(product: SimCard) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'update sim_card set sim_number = ?, sim_subscriber_id = ?, status_id = ? where id = ?';
        let data = [product.sim_number, product.sim_subscriber_id, product.status_id, product.id];

        return db.executeSql(sql, data).then(() => consoleLogSqlSuccess(sql, data))
          .catch((e) => consoleLogSqlError(sql, data, e));
      })
      .catch((e) => console.log(generateError(e)));
  }

  public remove(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from sim_card where id = ?';
        let data = [id];

        return db.executeSql(sql, data).then(() => consoleLogSqlSuccess(sql, data))
          .catch((e) => consoleLogSqlError(sql, data, e));
      })
      .catch((e) => console.log(generateError(e)));
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
                product.sim_subscriber_id = item.sim_subscriber_id;
                product.status_id = item.status_id;
              }

              return product;
            }

            return null;
          })
          .catch((e) => consoleLogSqlError(sql, data, e));
      })
      .catch((e) => console.log(generateError(e)));
  }

  public getBySimSubscriberId(sim_subcriber_id: string) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select * from sim_card where sim_subscriber_id = ?';
        let data = [sim_subcriber_id];

        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let product = new SimCard();
              if (item) {
                product.id = item.id;
                product.sim_number = item.sim_number;
                product.sim_subscriber_id = item.sim_subscriber_id;
                product.status_id = item.status_id;
              }

              return product;
            }

            return null;
          })
          .catch((e) => consoleLogSqlError(sql, data, e));
      })
      .catch((e) => console.log(generateError(e)));
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
              product.sim_subscriber_id = item.sim_subscriber_id;
              product.status_id = item.status_id;

              return product;
            }

            return null;
          })
          .catch((e) => consoleLogSqlError(sql, data, e));
      })
      .catch((e) => console.log(generateError(e)));
  }
}

export class SimCard {
  public id: number;
  public sim_number: string;
  public sim_subscriber_id: string;
  public status_id: number;

  constructor() {
    this.status_id = 1;
  }
}
