import Mysql from "../helpers/database.js";

export default class Model {
  static async checkTodaysVote(visitorIP, visitorId) {
    const users = await Mysql.handleRequest(
      `
      SELECT 
      EXISTS(SELECT date_added FROM votes WHERE (visitor_id=? OR ip=?) AND date_added = CURDATE())
      as has_voted`,
      [visitorId, visitorIP]
    );
    console.log(users);
    return users[0].has_voted;
  }
}
