import Mysql from "../helpers/database.js";

export default class Model {
  static async getOne(id) {
    const pool = Mysql.getPromiseInstance();
    const [rows] = await pool.query(
      `
				SELECT name, alarm_offset, active FROM patterns WHERE id=?`,
      [id]
    );
    return rows[0];
  }
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
      await pool.query(`DELETE FROM patterns WHERE id=?`, [id]);
    } catch (e) {
      throw e;
    }
  }
  static async toggleActive(id) {
    const pool = Mysql.getPromiseInstance();
    console.log(id);
    try {
      await pool.query(
        `UPDATE patterns SET active=0 WHERE active=1 AND id!=?`,
        [id]
      );
      await pool.query(
        `UPDATE patterns SET active=IF(active=1,0,1) WHERE id=?`,
        [id]
      );
    } catch (e) {
      throw e;
    }
  }
}
