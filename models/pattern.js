import Mysql from "../helpers/database.js";

export default class Model {
  static async getMany() {
    const pool = Mysql.getPromiseInstance();
    const [rows] = await pool.query(
      `
				SELECT id, name, alarm_offset, active,
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
	static async delete(id) {
    const pool = Mysql.getPromiseInstance();
    try {
      await pool.query(
        `DELETE FROM patterns WHERE id = ?`,
        [id]
      );
    } catch (e) {
      throw e;
    }
  }
	static async makeActive(id) {
    const pool = Mysql.getPromiseInstance();
    try {
      await pool.query(
        `UPDATE patterns SET active = 1 WHERE id = ?`,
        [id]
      );
			await pool.query(
        `UPDATE patterns SET active = 0 WHERE active = 1`
      );
    } catch (e) {
      throw e;
    }
  }
}
