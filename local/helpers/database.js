import mysql from "mysql2";
import { errorHandler } from "./errorHandler.js";

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

  static async handleRequest(
    query,
    variables = [],
    errMessage = "Nie udało się wykonać zapytania"
  ) {
    const pool = Mysql.getPromiseInstance();
    const [res, err] = await errorHandler(pool.query, pool, query, variables);
    if (err) {
      throw new Error(errMessage, { cause: err });
    }
    return Array.isArray(res) ? res[0] : res;
  }
}
