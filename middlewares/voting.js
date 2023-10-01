function checkVoteRight(req, res, next) {
  const [date, formatedDate] = getCurrentDate();
  const lastVote = req.session.lastVote;

  if (lastVote && new Date(formatedDate) >= new Date(lastVote)) {
    return res.sendStatus(403);
  }
  // res.locals.formatedDate = formatedDate;
  req.session.lastVote = formatedDate;
  next();
}

function getCurrentDate() {
  const date = new Date();
  const formatedDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  return [date, formatedDate];
}

export { checkVoteRight, getCurrentDate };
