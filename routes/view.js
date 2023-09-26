import { Router } from "express";
import { renderView } from "../helpers/helpers.js";
import Auth from "../helpers/auth.js";
import { checkAdmin, checkNotAdmin } from "../middlewares/checkAdmin.js";

const router = new Router();

router.get("/admin/login", checkNotAdmin, async (req, res) => {
  // const code = req.query.code;
  // const token = await Auth.getInstance().getSDKToken(code);
  // req.session.logged_in = true;
  renderView(res, "admin/login.html");
  // res.redirect("/player");
});

router.get("/login", checkAdmin, async (req, res) => {
  const code = req.query.code;
  const token = await Auth.getInstance().getSDKToken(code);
  req.session.logged_in = true;
  res.redirect("/player");
});

router.get("/player", checkAdmin, (req, res) => {
  if (req.session.logged_in) {
    req.session.logged_in = null;
    renderView(res, "player.html");
    return;
  }
  Auth.getInstance().loginUser(res);
});

router.get("/admin", checkAdmin, (req, res) => {
  renderView(res, "admin/index.html");
});

router.get("/admin/pattern/:id", checkAdmin, (req, res) => {
  renderView(res, "admin/editpreset.html");
});

router.get("/", (req, res) => {
  renderView(res, "voting.html");
});

export default router;
