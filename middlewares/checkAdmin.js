import Auth from "../helpers/auth.js";

function checkAdmin(req, res, next) {
  req.session.redirect = req.originalUrl;
  console.log(req.session);
  if (!req.session.loggedIn) {
    return res.redirect("/admin/login");
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
    return Auth.getInstance().loginUser(res, "http://localhost:3000/player");
  }
  next();
}

export { checkAdmin, checkNotAdmin, loginSpotify };
