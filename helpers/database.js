import mysql from "mysql2";

export default class Mysql {
  static #instance;

  static setInstance(host, user, password, database) {
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
