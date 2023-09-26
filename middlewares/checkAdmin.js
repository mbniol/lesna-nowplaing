export default function (req, res, next) {
  if (!req.session.loggedIn) {
    res.sendStatus(403);
  }
  next();
}
