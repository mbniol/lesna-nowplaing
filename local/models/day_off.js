import Mysql from "../helpers/database.js";
import { errorHandler } from "../helpers/errorHandler.js";

export default class Model {
  static async exists(date) {
    const pool = Mysql.getPromiseInstance();
    const [[rows], err] = await errorHandler(
      pool.query,
      pool,
      `
      SELECT 
      EXISTS(SELECT * FROM days_off WHERE date=?)
      as exists`,
      [date]
    );
    if (err) {
      throw new Error("Nie udało się wykonać zapytania", { cause: err });
    }
    return rows[0][0].exists;
  }
  static async getMany() {
    const pool = Mysql.getPromiseInstance();
    const [[rows], err] = await errorHandler(
      pool.query,
      pool,
      `
				SELECT weekday, date FROM days_off`
    );
    if (err) {
      throw new Error("Nie udało się wykonać zapytania", { cause: err });
    }
    return rows[0];
  }
  static async add(date, weekday) {
    const pool = Mysql.getPromiseInstance();
    const [[rows], err] = await errorHandler(
      pool.query,
      pool,
      `
        INSERT INTO days_off (date, weekday) VALUES (?, ?)`,
      [date, weekday]
    );
    if (err) {
      throw new Error("Nie udało się wykonać zapytania", { cause: err });
    }
    return rows;
  }
  static async delete(date) {
    const pool = Mysql.getPromiseInstance();
    const [[rows], err] = await errorHandler(
      pool.query,
      pool,
      `
        DELETE FROM days_off where date=?`,
      [date]
    );
    if (err) {
      throw new Error("Nie udało się wykonać zapytania", { cause: err });
    }
    return rows;
  }
}
