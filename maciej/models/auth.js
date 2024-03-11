import Mysql from "../helpers/database.js";
import { errorHandler } from "../helpers/errorHandler.js";

export default class Model {
  static async checkTodaysVote(visitorId) {
    const pool = Mysql.getPromiseInstance();
    const [result, err] = await errorHandler(
      pool.query,
      pool,
      `
      SELECT 
      EXISTS(SELECT date_added FROM votes WHERE visitor_id=? AND date_added = CURDATE())
      as has_voted
    `,
      [visitorId]
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
    return result[0][0].has_voted;
  }
}
