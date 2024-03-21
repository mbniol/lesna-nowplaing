import Mysql from "../helpers/database.js";
import { errorHandler } from "../helpers/errorHandler.js";

export default class Model {
  static async withBreaks() {
    const pool = Mysql.getPromiseInstance();
    const [data, err] = await errorHandler(
      pool.query,
      pool,
      `SELECT breaks.id ,time_to_sec(TIMEDIFF(end, start)) * 1000 time, breaks.for_requested as main 
      FROM breaks join patterns on patterns.id=breaks.pattern_id
      WHERE patterns.active=1
      ORDER BY breaks.start;`
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
    return data;
  }
  static async getOne(id) {
    const pool = Mysql.getPromiseInstance();
    const [[rows], err] = await errorHandler(
      pool.query,
      pool,
      `
				SELECT name, alarm_offset, active FROM patterns WHERE id=?`,
      [id]
    );
    if (err) {
      throw new Error("Nie udało się wykonać zapytania", { cause: err });
    }
    return rows[0];
  }
  static async getMany() {
    const pool = Mysql.getPromiseInstance();
    const [[rows], err] = await errorHandler(
      pool.query,
      pool,
      `
				SELECT id, name, alarm_offset, active,
				(SELECT COUNT(*) FROM breaks WHERE pattern_id=p.id) as breaks_count
				FROM patterns as p`
    );
    if (err) {
      throw new Error("Nie udało się wykonać zapytania", { cause: err });
    }
    return rows;
  }
  static async add(name, offset) {
    const pool = Mysql.getPromiseInstance();
    const [, err] = await errorHandler(
      pool.query,
      pool,
      `INSERT INTO patterns (name, alarm_offset) VALUES (?, ?)`,
      [name, offset]
    );
    if (err) {
      throw new Error("Nie udało się wykonać zapytania", { cause: err });
    }
  }
  static async delete(id) {
    const pool = Mysql.getPromiseInstance();
    const [, err] = await errorHandler(
      pool.query,
      pool,
      `DELETE FROM patterns WHERE id=?`,
      [id]
    );
    if (err) {
      throw new Error("Nie udało się wykonać zapytania", { cause: err });
    }
  }
  static async toggleActive(id) {
    const pool = Mysql.getPromiseInstance();
    const [, untoggleErr] = await errorHandler(
      pool.query,
      pool,
      `UPDATE patterns SET active=0 WHERE active=1 AND id!=?`,
      [id]
    );
    if (untoggleErr) {
      throw new Error("Nie udało się wykonać zapytania", {
        cause: untoggleErr,
      });
    }
    const [, toggleErr] = await errorHandler(
      pool.query,
      pool,
      `UPDATE patterns SET active=IF(active=1,0,1) WHERE id=?`,
      [id]
    );
    if (toggleErr) {
      throw new Error("Nie udało się wykonać zapytania", { cause: toggleErr });
    }
  }
  static async edit(id, offset, name, is_active) {
    const pool = Mysql.getPromiseInstance();
    if (is_active) {
      const [, unactivateError] = await errorHandler(
        pool.query,
        pool,
        `UPDATE patterns SET active=0 WHERE active=1 AND id!=?`,
        [id]
      );
      if (unactivateError) {
        throw new Error("Nie udało się wykonać zapytania", {
          cause: unactivateError,
        });
      }
    }
    const [, updateError] = await errorHandler(
      pool.query,
      pool,
      `UPDATE patterns SET name=?, alarm_offset=?, active=? WHERE id=?`,
      [name, offset, is_active, id]
    );
    if (updateError) {
      throw new Error("Nie udało się wykonać zapytania", {
        cause: updateError,
      });
    }
  }
}
