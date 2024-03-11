import mysql from "mysql2";

export default class Mysql {
  static #instance;

  static setInstance(host, user, password, database) {
    Mysql.#instance = mysql.createPool({
      host,
      user,
      password,
      database,
    });
  }

  static getPromiseInstance() {
    if (Mysql.#instance) {
      return Mysql.#instance.promise();
    }
    throw new Error(
      "Połączenie z bazą danych nie zostało jeszcze ustanowione."
    );
  }
}
