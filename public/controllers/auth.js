import Auth from "../helpers/auth.js";
import "dotenv/config";

export default class Controller {
  static async loginAdmin(req, res) {
    const password = req.body.password;
    if (password !== process.env.ADMIN_PASS) {
      return res.sendStatus(403);
    }
    req.session.loggedIn = true;

    res.redirect(req.body.pathname);
  }
}
