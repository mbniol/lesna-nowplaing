function checkAdmin(req, res, next) {
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

export { checkAdmin, checkNotAdmin };
