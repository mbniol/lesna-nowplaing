import Mysql from "../helpers/database.js";

export default class Model {
  static async clear() {
    await Mysql.handleRequest(
      `
      DELETE FROM votes`
    );
  }
  static async add(id, ip, visitorId) {
    await Mysql.handleRequest(
      "INSERT INTO votes (id, track_id, date_added, ip, visitor_id) VALUES (NULL, ?, current_timestamp(), ?, ?)",
      [id, ip, visitorId]
    );
  }
  static async addArtificial(id) {
    return Model.add(id, "artificial", "artificial");
  }
}
