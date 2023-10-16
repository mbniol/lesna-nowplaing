import breakModel from "../models/break.js";

export default class Controller {
  static async getMany(req, res) {
    const pattern_id = req.params.pattern_id;
    const breaks = await breakModel.getMany(pattern_id);
    res.json(breaks);
  }

  static async updateMany(req, res) {
    const pattern_id = req.params.pattern_id;
    await breakModel.replace(pattern_id, req.body);
    res.sendStatus(200);
  }

  static async add(req, res) {
    const pattern_id = req.params.pattern_id;
    const { name, start, end, forRequested } = req.body;

    await breakModel.add(name, start, end, +Boolean(forRequested), pattern_id);
    res.sendStatus(200);
  }
}
