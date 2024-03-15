import Auth from "../helpers/auth.js";
import "dotenv/config";

export default class Controller {
  static async getSDKToken(req, res) {
    req.session.code = req.query.code;
    const token = await Auth.getInstance().getSDKToken(
      req.session.code,
      `https://${process.env.WEB_HOST}:${process.env.WEB_PORT}/player`
    );
    res.json({
      token,
    });
  }

  static async loginAdmin(req, res) {
    const password = req.body.password;
    if (password !== process.env.ADMIN_PASS) {
      return res.sendStatus(403);
    }
    req.session.loggedIn = true;

    res.redirect(req.body.pathname);
  }
}
