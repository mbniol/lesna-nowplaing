import newsModel from "../models/news.js";

export default class Controller {
    static async show_news(req,res){
        const news = await newsModel.get_news();
        res.json(news[0]);
    }
}
