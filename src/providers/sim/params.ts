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
export class ParamsProvider {

  constructor(public dbProvider: DatabaseProvider, private toast: ToastController) {
  }

  public save(product: Params) {
    if (product.id) {
      return this.update(product);
    } else {
      return this.insert(product);
    }
  }

  private insert(simCard: Params) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into params (key_param, value_param) values (?, ?)';
        let data = [simCard.key_param, simCard.value_param];

        return db.executeSql(sql, data).then(() => console.log('sql OK'))
          .catch((e) => console.log('Erro sql'));
      })
      .catch((e) => console.error(e));
  }

  private update(product: Params) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'update params set key_param = ?, value_param = ? where id = ?';
        let data = [product.key_param, product.value_param, product.id];

        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public remove(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from params where id = ?';
        let data = [id];

        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getByKey(key: string) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select * from params where key_param = ?';
        let data = [key];

        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let product = new Params();
              if (item) {
                product.id = item.id;
                product.key_param = item.key_param;
                product.value_param = item.value_param;
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
        let sql = 'select * from params where id = ?';
        let data = [id];

        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let product = new Params();
              product.id = item.id;
              product.key_param = item.key_param;
              product.value_param = item.value_param;

              return product;
            }

            return null;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
}

export class Params {
  id: number;
  key_param: string;
  value_param: string;
}
