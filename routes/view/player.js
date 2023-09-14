import { Router } from "express";
import { renderView } from "../../helpers/helpers.js";
import Auth from "../../helpers/auth.js";

const router = new Router();

router.get("/player", (req, res) => {
  if (req.session.logged_in) {
    req.session.logged_in = null;
    renderView("player.html")(res);
    return;
  }
  Auth.getInstance().loginUser(res);
});

router.get("/login", async (req, res) => {
  const code = req.query.code;
  const token = await Auth.getInstance().getSDKToken(code);
  req.session.logged_in = true;
  res.redirect("/player");
});

router.get("/api/token/sdk", async (req, res) => {
  const token = await Auth.getInstance().getSDKToken();
  res.json({
    token,
  });
});

export default router;
