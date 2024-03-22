import Mysql from "../helpers/database.js";
import { errorHandler } from "../helpers/errorHandler.js";
import dayOffModel from "../models/day_off.js";

export default class Controller {
  static async add(req, res) {
    console.log(req.body);
    await req.body.dates.forEach(async ({ day, month }) => {
      await dayOffModel.add(month, day);
    });
    res.sendStatus(200);
  }
  static async delete(req, res) {
    await req.body.dates.forEach(async ({ day, month }) => {
      await dayOffModel.delete(month, day);
    });
    res.sendStatus(200);
  }
  static async deleteAll(req, res) {
    await dayOffModel.deleteAll();
    res.sendStatus(200);
  }
  static async getMany(req, res) {
    const daysOff = await dayOffModel.getMany();

    res.json(daysOff);
  }
  static async exists(req, res) {
    const { month, day } = req.params;
    const doesExist = await dayOffModel.exists(month, day);
    res.sendStatus({ doesExist: Boolean(doesExist) });
  }
}
