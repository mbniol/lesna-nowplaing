import Mysql from "../helpers/database.js";

export default class Model {
  static async getMany() {
    const pool = Mysql.getPromiseInstance();
    const [rows] = await pool.query(
      `
				SELECT id, name alarm_offset, active,
				(SELECT COUNT(*) FROM breaks WHERE pattern_id=p.id) as breaks_count
				FROM patterns as p`
    );
    return rows;
  }
  static async add(name, offset) {
    const pool = Mysql.getPromiseInstance();
    try {
      await pool.query(
        `INSERT INTO patterns (name, alarm_offset) VALUES (?, ?)`,
        [name, offset]
      );
    } catch (e) {
      throw e;
    }
  }
}
