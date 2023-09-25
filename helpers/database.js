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

  static getPromiseInstance() {
    if (!Mysql.#instance) {
      throw new Error(
        "Połączenie z bazą danych nie zostało jeszcze ustanowione."
      );
    }
    return Mysql.#instance.promise();
  }

  static async executeQuery(query, params = []) {
    const connection = Mysql.getPromiseInstance();
    try {
      const [rows, fields] = await connection.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}
