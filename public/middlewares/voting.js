import ipaddr from "ipaddr.js";
import AuthModel from "../models/auth.js";

function convertIP(remoteAddress) {
  if (ipaddr.isValid(remoteAddress)) {
    const addr = ipaddr.parse(remoteAddress);
    return addr.kind() === "ipv6" && addr.isIPv4MappedAddress()
      ? addr.toIPv4Address().toString()
      : remoteAddress;
  }
}
async function checkVoteRight(req, res, next) {
  const [date, formatedDate] = getCurrentDate();
  const lastVote = req.session.lastVote;
  // console.log('checkowanie: previousDate ', lastVote, ' currentDate ', formatedDate)
  if (lastVote && new Date(formatedDate) <= new Date(lastVote)) {
    return res.sendStatus(403);
  }
  req.convertedIP = convertIP(req.socket.remoteAddress);
  const hasVoted = await AuthModel.checkTodaysVote(
    req.convertedIP,
    req.body.visitorId
  );
  // if (hasVoted) {
  //   return res.sendStatus(403);
  // }

  req.session.lastVote = formatedDate;
  next();
}
async function checkVote(req, res, next) {
  const [date, formatedDate] = getCurrentDate();
  const lastVote = req.session.lastVote;
  // console.log('checkowanie: previousDate ', lastVote, ' currentDate ', formatedDate)
  if (lastVote && new Date(formatedDate) <= new Date(lastVote)) {
    return res.json({ vote: 1 });
  }
  req.convertedIP = convertIP(req.socket.remoteAddress);
  // console.log('visitorID', req.body.visitorId)
  const hasVoted = await AuthModel.checkTodaysVote(
    req.convertedIP,
    req.body.visitorId
  );
  // if (hasVoted) {
  //   return res.json({ vote: hasVoted });
  // }
  // console.log("hija");
  res.locals.formatedDate = formatedDate;
  return res.json({ vote: false });
}

function getCurrentDate() {
  const date = new Date();
  const formatedDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  return [date, formatedDate];
}

export { checkVoteRight, getCurrentDate, checkVote };
