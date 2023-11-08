import Auth from "../helpers/auth.js";

export default class Controller {
  static async getSDKToken(req, res) {
    console.log(req.query.code);
    req.session.code = req.query.code;
    const token = await Auth.getInstance().getSDKToken(
      req.session.code,
      "https://192.168.17.15:3000/player"
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
