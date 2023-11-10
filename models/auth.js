import Mysql from "../helpers/database.js";
import { errorHandler } from "../helpers/errorHandler.js";

export default class Model {
  static async checkTodaysVote(id) {
    const pool = Mysql.getPromiseInstance();
    const [result, err] = await errorHandler(
      pool.query,
      pool,
      `
      SELECT EXISTS(SELECT date_added = CURDATE() FROM votes WHERE ip = ?) as has_voted
    `,
      [id]
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
    console.log(result, id);
    return result[0][0].has_voted;
  }
}
