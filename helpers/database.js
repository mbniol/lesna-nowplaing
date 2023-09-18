import mysql from "mysql2";

export default class Mysql {
  static #instance;

  static async setInstance(host, user, password, database) {
    if (Mysql.#instance === undefined) {
      Mysql.#instance = await mysql.createConnection({
        host,
        user,
        password,
        database,
      });
    }
  }

  static getInstance() {
    return Mysql.#instance;
  }

  static getPromiseInstance() {
    return Mysql.#instance.promise();
  }
}
