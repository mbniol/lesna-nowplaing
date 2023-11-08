import Mysql from "../helpers/database.js";
import { errorHandler } from "../helpers/errorHandler.js";

export default class Model {
  static async getMany(pattern_id) {
    const pool = Mysql.getPromiseInstance();
    const [[rows], err] = await errorHandler(
      pool.query,
      pool,
      `
				SELECT id, name, position, start, end, for_requested
				FROM breaks WHERE pattern_id=?`,
      [pattern_id]
    );
    if (err) {
      throw new Error("Nie udało się wykonać zapytania", { cause: err });
    }
    return rows;
  }
  static async add(name, start, end, for_requested, pattern_id) {
    const pool = Mysql.getPromiseInstance();
    const [[rows], err] = await errorHandler(
      pool.query,
      pool,
      `
				INSERT INTO breaks (name, start, end, for_requested, pattern_id, position) 
        SELECT ?, ?, ?, ?, ?, COUNT(*) FROM breaks WHERE pattern_id=?`,
      [name, start, end, for_requested, pattern_id, pattern_id]
    );
    if (err) {
      throw new Error("Nie udało się wykonać zapytania", { cause: err });
    }
    return rows;
  }
  static async replace(pattern_id, breaks) {
    const pool = Mysql.getPromiseInstance();
    const [, deleteErr] = await errorHandler(
      pool.query,
      pool,
      `DELETE FROM breaks WHERE pattern_id=?`,
      [pattern_id]
    );
    if (deleteErr) {
      throw new Error("Nie udało się wykonać zapytania", { cause: deleteErr });
    }
    breaks.forEach(async ({ name, position, start, end, forRequested }) => {
      const [, insertError] = await errorHandler(
        pool.query,
        pool,
        `
          INSERT INTO breaks (name, start, end, for_requested, pattern_id, position) VALUES
          (?, ?, ?, ?, ?, ?)`,
        [name, start, end, +forRequested, pattern_id, position]
      );
      if (insertError) {
        throw new Error("Nie udało się wykonać zapytania", {
          cause: insertError,
        });
      }
    });
  }
  // static async delete(id, pattern_id) {
  //   const pool = Mysql.getPromiseInstance();
  //   try {
  //     const [row] = await errorHandler(pool.query, pool,`SELECT position FROM breaks WHERE id=?`, [
  //       id,
  //     ]);
  //     const position = row[0].position;
  //     await errorHandler(pool.query, pool,`DELETE FROM breaks WHERE id=?`, [id]);
  //
  //
  //       await errorHandler(pool.query, pool,
  //         `UPDATE breaks SET position=position-1 WHERE pattern_id=? AND position>?`,
  //         [pattern_id, position]
  //       )
  //     );
  //   } catch (e) {
  //     throw e;
  //   }
  // }
}
