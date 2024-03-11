import { Router } from "express";
import { checkAdmin, checkNotAdmin } from "../middlewares/checkAdmin.js";
import { checkVoteRight, checkVote } from "../middlewares/voting.js";
import AuthController from "../controllers/auth.js";
import SongController from "../controllers/song.js";
import NewsController from "../controllers/news.js";

const router = new Router();

router.get(
  "/token/sdk",
  checkAdmin,
  (req, res, next) => {
    next();
  },
  AuthController.getSDKToken
);

router.post("/login", checkNotAdmin, AuthController.loginAdmin);

router.post("/votes", checkVoteRight, SongController.vote);

router.get("/live_votes", SongController.addNewClient);

router.get("/songs", checkAdmin, SongController.getMany);

router.post("/check_vote_status", checkVote);

router.post("/check_track", SongController.check_track);

router.get("/track_list", SongController.votes);

router.get("/get_news", NewsController.show_news);

router.get("/verified_tracks", checkAdmin, SongController.getVerifiedTracks);

router.get("/banned_tracks", checkAdmin, SongController.getBannedTracks);

router.post("/songs_ban", checkAdmin, SongController.ban);

router.post("/verified_songs_ban", checkAdmin, SongController.verifiedBan);

router.post("/songs_verify", checkAdmin, SongController.verify);

router.post("/songs_unban", checkAdmin, SongController.unban);
