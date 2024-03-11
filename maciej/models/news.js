import Mysql from "../helpers/database.js";
import {errorHandler} from "../helpers/errorHandler.js";

export default class Model {
    static async get_news() {
        const pool = Mysql.getPromiseInstance();
        const [data, err] = await errorHandler(
            pool.query,
            pool,
            "SELECT topic, content, date FROM news WHERE date>=CURRENT_DATE() ORDER by date;"
        );
        if (err) {
            throw new Error("Nie udało isę wykonać zapytania", { cause: err });
        }
        return data;
    }
}
