import { Router } from "express";
import { renderView } from "../helpers/helpers.js";
import { votes, vote } from "../models/song.js";
import Auth from "../helpers/auth.js";
import {
  checkAdmin,
  checkNotAdmin,
  loginSpotify,
} from "../middlewares/checkAdmin.js";

const router = new Router();

router.get("/admin/login", checkNotAdmin, async (req, res) => {
  // const code = req.query.code;
  // const token = await Auth.getInstance().getSDKToken(code);
  // req.session.logged_in = true;
  renderView(res, "admin/login.html");

  // res.redirect("/player");
});

router.get("/player", checkAdmin, loginSpotify, async (req, res) => {
  req.session.code = req.query.code;

  renderView(res, "player.html");
  return;
});

router.get("/admin", checkAdmin, (req, res) => {
  renderView(res, "admin/index.html");
});

router.get("/display", checkAdmin, (req, res) => {
  renderView(res, "admin/display.html");
});

router.get("/admin/pattern/:id", checkAdmin, (req, res) => {
  renderView(res, "admin/editpreset.html");
});

router.get("/", (req, res) => {
  renderView(res, "voting.html");
});

export default router;
