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
  req.convertedIP = convertIP(req.socket.remoteAddress);
  const hasVoted = await AuthModel.checkTodaysVote(req.convertedIP);
  if (hasVoted) {
    return res.sendStatus(403);
  }
  // const lastVote = req.session.lastVote;

  // if (lastVote && new Date(formatedDate) >= new Date(lastVote)) {
  //   return res.sendStatus(403);
  // }
  // // res.locals.formatedDate = formatedDate;
  // req.session.lastVote = formatedDate;
  next();
}
async function checkVote(req, res, next) {
  req.convertedIP = convertIP(req.socket.remoteAddress);
  const hasVoted = await AuthModel.checkTodaysVote(req.convertedIP);
  return res.json({ vote: 0 });
  // res.locals.formatedDate = formatedDate;
}

function getCurrentDate() {
  const date = new Date();
  const formatedDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  return [date, formatedDate];
}

export { checkVoteRight, getCurrentDate, checkVote };
