import Auth from "../helpers/auth.js";

export default class Controller {
  static async getSDKToken(req, res) {
    const token = await Auth.getInstance().getSDKToken(
      req.session.code,
      "http://localhost:3000/player"
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
