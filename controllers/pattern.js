import patternModel from "../models/pattern.js";

export default class Controller {
  static async getMany(req, res) {
    const patterns = await patternModel.getMany();
    res.json(patterns);
  }

  static async get(req, res) {
    const id = req.params.id;
    const pattern = await patternModel.getOne(id);
    res.json(pattern);
  }

  static async add(req, res) {
    const { offset, name } = req.body;
    await patternModel.add(name, offset);
    res.sendStatus(200);
  }

  static async delete(req, res) {
    const id = req.params.id;
    await patternModel.delete(id);
    res.sendStatus(200);
  }

  static async update(req, res) {
    const id = req.params.id;
    const { offset, name, is_active } = req.body;
    await patternModel.edit(id, offset, name, +Boolean(is_active));
    res.sendStatus(200);
  }

  static async makeActive(req, res) {
    const id = req.params.id;
    await patternModel.toggleActive(id);
    res.sendStatus(200);
  }
}
