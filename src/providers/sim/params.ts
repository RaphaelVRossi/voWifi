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
export class ParamsProvider {

  constructor(public dbProvider: DatabaseProvider) {
  }

  public save(params: Params) {
    if (params.id)
      return this.update(params);
    else
      return this.insert(params);
  }

  private insert(simCard: Params) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into params (key_param, value_param) values (?, ?)';
        let data = [simCard.key_param, simCard.value_param];

        return db.executeSql(sql, data).then(() => consoleLogSqlSuccess(sql, data))
          .catch((e) => consoleLogSqlError(sql, data, e));
      })
      .catch((e) => console.log(generateError(e)));
  }

  private update(product: Params) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'update params set key_param = ?, value_param = ? where id = ?';
        let data = [product.key_param, product.value_param, product.id];

        return db.executeSql(sql, data).then(() => consoleLogSqlSuccess(sql, data))
          .catch((e) => consoleLogSqlError(sql, data, e));
      })
      .catch((e) => console.log(generateError(e)));
  }

  public remove(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from params where id = ?';
        let data = [id];

        return db.executeSql(sql, data).then(() => consoleLogSqlSuccess(sql, data))
          .catch((e) => consoleLogSqlError(sql, data, e));
      })
      .catch((e) => console.log(generateError(e)));
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
              return new Params(item);
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
        let sql = 'select * from params where id = ?';
        let data = [id];

        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              return new Params(item);
            }

            return null;
          })
          .catch((e) => consoleLogSqlError(sql, data, e));
      })
      .catch((e) => console.log(generateError(e)));
  }
}

export class Params {
  id: number;
  key_param: string;
  value_param: string;

  constructor(item: any) {
    if (item) {
      this.id = item.id;
      this.key_param = item.key_param;
      this.value_param = item.value_param;
    }
  }
}
