import Mysql from "../helpers/database.js";
import { errorHandler } from "../helpers/errorHandler.js";

export default class Model {
  static async clear() {
    const pool = Mysql.getPromiseInstance();
    const [data, err] = await errorHandler(
      pool.query,
      pool,
      "DELETE FROM votes"
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
    return data;
  }
  static async add(id, ip, visitorId) {
    const pool = Mysql.getPromiseInstance();
    const [, err] = await errorHandler(
      pool.query,
      pool,
      "INSERT INTO votes (id, track_id, date_added, ip, visitor_id) VALUES (NULL, ?, current_timestamp(), ?, ?)",
      [id, ip, visitorId]
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
  }
  static async addArtificial(id) {
    return Model.add(id, "artificial", "artificial");
  }
}
