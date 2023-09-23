import { Router } from "express";
import { renderView } from "../helpers/helpers.js";
import Auth from "../helpers/auth.js";

const router = new Router();

router.get("/login", async (req, res) => {
  const code = req.query.code;
  const token = await Auth.getInstance().getSDKToken(code);
  req.session.logged_in = true;
  res.redirect("/player");
});

router.get("/player", (req, res) => {
  if (req.session.logged_in) {
    req.session.logged_in = null;
    renderView(res, "player.html");
    return;
  }
  Auth.getInstance().loginUser(res);
});

router.get("/admin", (req, res) => {
  renderView(res, "admin/index.html");
});

router.get("/admin/pattern/:id", (req, res) => {
  renderView(res, "admin/editpreset.html");
});

router.get("/", (req, res) => {
  renderView(res, "voting.html");
});

export default router;
