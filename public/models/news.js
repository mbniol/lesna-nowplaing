import Mysql from "../helpers/database.js";

export default class Model {
  static async get_news() {
    const news = await Mysql.handleRequest(
      `
            SELECT topic, content, date FROM news WHERE date>=CURRENT_DATE() ORDER by date;`
    );
    return news;
  }
}
