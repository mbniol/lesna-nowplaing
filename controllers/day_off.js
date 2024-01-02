import Mysql from "../helpers/database.js";
import { errorHandler } from "../helpers/errorHandler.js";
import dayOffModel from "../models/day_off.js";

export default class Controller {
  static async add(req, res) {
    const { weekday, date } = req.body;
    await dayOffModel.add(date, weekday);
    res.sendStatus(200);
  }
  static async delete(req, res) {
    const { date } = req.body;
    await dayOffModel.delete(date);
    res.sendStatus(200);
  }
  static async getMany(req, res) {
    const daysOff = await dayOffModel.getMany();
    res.json({ daysOff });
  }
  static async exists(req, res) {
    const date = req.params.date;
    const doesExist = await dayOffModel.exists(date);
    res.sendStatus({ doesExist: Boolean(doesExist) });
  }
}
