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
function checkVote(req, res, next) {
  const [date, formatedDate] = getCurrentDate();
  const lastVote = req.session.lastVote;
  if (lastVote && new Date(formatedDate) >= new Date(lastVote)) {
    return res.json({vote:1});
  }
  else{
    return res.json({vote:0});
  }
  // res.locals.formatedDate = formatedDate;

}

function getCurrentDate() {
  const date = new Date();
  const formatedDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  return [date, formatedDate];
}


export { checkVoteRight, getCurrentDate, checkVote};
