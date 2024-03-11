import Auth from "../helpers/auth.js";
import { renderView } from "../helpers/helpers.js";
import "dotenv/config";

function checkAdmin(req, res, next) {
  req.session.redirect = req.originalUrl;

  if (!req.session.loggedIn) {
    return renderView(res, "admin/login.html");
    // return res.redirect("/admin/login");
  }
  next();
}

function checkNotAdmin(req, res, next) {
  if (req.session.loggedIn) {
    return res.redirect("/admin");
  }
  next();
}

function loginSpotify(req, res, next) {
  if (!req.session.triedLogging) {
    req.session.triedLogging = true;
    return Auth.getInstance().loginUser(
      res,
      `https://${process.env.WEB_HOST}:${process.env.WEB_PORT}/player`
    );
  }
  req.session.triedLogging = false;
  next();
}

export { checkAdmin, checkNotAdmin, loginSpotify };
