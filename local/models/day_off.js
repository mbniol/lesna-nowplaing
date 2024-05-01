import Mysql from "../helpers/database.js";

export default class Model {
  static async exists(month, day) {
    const rows = await Mysql.handleRequest(
      `
      SELECT 
      EXISTS(SELECT * FROM days_off WHERE month=? AND day=?)
      as existence`,
      [month, day]
    );
    return rows[0].existence;
  }
  static async getMany() {
    const rows = await Mysql.handleRequest(
      `
      SELECT month, day FROM days_off`
    );
    return rows;
  }
  static async add(month, day) {
    const rows = await Mysql.handleRequest(
      `
      INSERT IGNORE INTO days_off (month, day) VALUES (?, ?)`,
      [month, day]
    );
    return rows;
  }
  static async delete(month, day) {
    const rows = await Mysql.handleRequest(
      `
      DELETE FROM days_off where month=? AND day=?`,
      [month, day]
    );
    return rows;
  }
  static async deleteAll() {
    const rows = await Mysql.handleRequest(
      `
      DELETE FROM days_off`
    );
    return rows;
  }
}
