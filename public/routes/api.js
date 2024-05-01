import { Router } from "express";
import { checkAdmin, checkNotAdmin } from "../middlewares/checkAdmin.js";
import { checkVoteRight, checkVote } from "../middlewares/voting.js";
import AuthController from "../controllers/auth.js";
import SongController from "../controllers/song.js";
import voteController from "../controllers/vote.js";
import { EventTarget } from "../helpers/eventTarget.js";

const eventTarget = EventTarget.createInstance("voters");

const router = new Router();

router.get(
  "/random_songs",
  /* checkIfMainframe, */ SongController.getRandomSongs
);

router.put(
  "/reset_ranking",
  /* checkIfMainframe, */
  SongController.resetRanking
);

router.post("/login", checkNotAdmin, AuthController.loginAdmin);

router.post("/votes", checkVoteRight, voteController.processVote);

router.get("/live_votes", (req, res) =>
  eventTarget.addNewClient.call(eventTarget, req, res)
);

router.get("/songs", checkAdmin, SongController.getMany);

router.post("/check_vote_status", checkVote);

router.post("/check_track", SongController.check_track);

router.get("/track_list", SongController.getTracksRanking);

router.get("/verified_tracks", checkAdmin, SongController.getVerifiedTracks);

router.get("/banned_tracks", checkAdmin, SongController.getBannedTracks);

router.post("/songs_ban", checkAdmin, SongController.ban);

router.post("/verified_songs_ban", checkAdmin, SongController.verifiedBan);

router.post("/songs_verify", checkAdmin, SongController.verify);

router.post("/songs_unban", checkAdmin, SongController.unban);

export default router;
