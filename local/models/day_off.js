import Mysql from "../helpers/database.js";
import { errorHandler } from "../helpers/errorHandler.js";

export default class Model {
  static async exists(month, day) {
    const pool = Mysql.getPromiseInstance();
    const [[rows], err] = await errorHandler(
      pool.query,
      pool,
      `
      SELECT 
      EXISTS(SELECT * FROM days_off WHERE month=? AND day=?)
      as exists`,
      [month, day]
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
				SELECT month, day FROM days_off`
    );
    if (err) {
      throw new Error("Nie udało się wykonać zapytania", { cause: err });
    }
    return rows;
  }
  static async add(month, day) {
    console.log("a");
    const pool = Mysql.getPromiseInstance();
    const [[rows], err] = await errorHandler(
      pool.query,
      pool,
      `
        INSERT IGNORE INTO days_off (month, day) VALUES (?, ?)`,
      [month, day]
    );
    if (err) {
      throw new Error("Nie udało się wykonać zapytania", { cause: err });
    }
    return rows;
  }
  static async delete(month, day) {
    const pool = Mysql.getPromiseInstance();
    const [[rows], err] = await errorHandler(
      pool.query,
      pool,
      `
        DELETE FROM days_off where month=? AND day=?`,
      [month, day]
    );
    if (err) {
      throw new Error("Nie udało się wykonać zapytania", { cause: err });
    }
    return rows;
  }
}
