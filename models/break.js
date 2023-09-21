import Mysql from "../helpers/database.js";

export default class Model {
  static async getMany(pattern_id) {
    const pool = Mysql.getPromiseInstance();
    const [rows] = await pool.query(
      `
				SELECT id, name, position, start, end, for_requested
				FROM breaks WHERE pattern_id=?`,
      [pattern_id]
    );
    return rows;
  }
  static async add(name, start, end, for_requested, pattern_id) {
    const pool = Mysql.getPromiseInstance();
    const [rows] = await pool.query(
      `
				INSERT INTO breaks (name, start, end, for_requested, pattern_id, position) 
        SELECT ?, ?, ?, ?, ?, COUNT(*) FROM breaks WHERE pattern_id=?`,
      [name, start, end, for_requested, pattern_id, pattern_id]
    );
    return rows;
  }
}
