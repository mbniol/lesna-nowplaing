import mysql from "mysql";

export default class Mysql {
  static #instance;

  static setInstance(host, user, password, database) {
    console.log(host, user, password, database);
    if (Mysql.#instance === undefined) {
      Mysql.#instance = mysql.createConnection({
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
}
