import Mysql from "../helpers/database.js";

export default class Model {
  static async withBreaks() {
    const rows = await Mysql.handleRequest(
      `
      SELECT breaks.id ,time_to_sec(TIMEDIFF(end, start)) * 1000 time, breaks.for_requested as main 
      FROM breaks join patterns on patterns.id=breaks.pattern_id
      WHERE patterns.active=1
      ORDER BY breaks.start;`
    );
    return rows;
  }
  static async getOne(id) {
    const rows = await Mysql.handleRequest(
      `
      SELECT name, alarm_offset, active FROM patterns WHERE id=?`,
      [id]
    );
    return rows[0];
  }
  static async getMany() {
    const rows = await Mysql.handleRequest(
      `
      SELECT id, name, alarm_offset, active,
				(SELECT COUNT(*) FROM breaks WHERE pattern_id=p.id) as breaks_count
				FROM patterns as p`
    );
    return rows;
  }
  static async add(name, offset) {
    await Mysql.handleRequest(
      `INSERT INTO patterns (name, alarm_offset) VALUES (?, ?)`,
      [name, offset]
    );
  }
  static async delete(id) {
    await Mysql.handleRequest(`DELETE FROM patterns WHERE id=?`, [id]);
  }
  static async toggleActive(id) {
    await Mysql.handleRequest(
      `UPDATE patterns SET active=0 WHERE active=1 AND id!=?`,
      [id]
    );
    await Mysql.handleRequest(
      `UPDATE patterns SET active=IF(active=1,0,1) WHERE id=?`,
      [id]
    );
  }
  static async edit(id, offset, name, is_active) {
    if (is_active) {
      await Mysql.handleRequest(
        `UPDATE patterns SET active=0 WHERE active=1 AND id!=?`,
        [id]
      );
    }
    await Mysql.handleRequest(
      `UPDATE patterns SET name=?, alarm_offset=?, active=? WHERE id=?`,
      [name, offset, is_active, id]
    );
  }
}
