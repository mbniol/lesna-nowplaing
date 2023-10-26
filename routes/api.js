import { Router } from "express";
import { checkAdmin, checkNotAdmin } from "../middlewares/checkAdmin.js";
import AuthController from "../controllers/auth.js";
import BreakController from "../controllers/break.js";
import PatternController from "../controllers/pattern.js";
import PlayerController from "../controllers/player.js";
import PlaylistController from "../controllers/playlist.js";
import SongController from "../controllers/song.js";
import { checkVoteRight } from "../middlewares/voting.js";

const router = new Router();

router.get("/token/sdk", checkAdmin, AuthController.getSDKToken);

router.get("/pattern/:pattern_id/break", checkAdmin, BreakController.getMany);

router.put(
  "/pattern/:pattern_id/break",
  checkAdmin,
  BreakController.updateMany
);

router.post("/pattern/:pattern_id/break", checkAdmin, BreakController.add);

router.get("/pattern", checkAdmin, PatternController.getMany);

router.get("/pattern/:id", checkAdmin, PatternController.get);

router.post("/pattern", checkAdmin, PatternController.add);

router.delete("/pattern/:id", checkAdmin, PatternController.delete);

router.put("/pattern/:id", checkAdmin, PatternController.update);

router.put("/pattern/:id/active", checkAdmin, PatternController.makeActive);

router.post("/login", checkNotAdmin, AuthController.loginAdmin);

router.post("/votes", checkVoteRight, SongController.vote);

router.post("/check_track", SongController.check_track);

router.get("/track_list", SongController.votes);

router.get("/player", checkAdmin, PlayerController.addNewClient);

router.post("/player", checkAdmin, PlayerController.sendDataToClients);

router.get("/playlist", checkAdmin, PlaylistController.make);

router.get("/queue", checkAdmin, PlayerController.getQueue);

router.get("/songs", checkAdmin, SongController.getMany);

router.get("/verified_tracks", checkAdmin, SongController.getVerifiedTracks);

router.get("/banned_tracks", checkAdmin, SongController.getBannedTracks);

router.post("/songs_ban", checkAdmin, SongController.ban);

router.post("/verified_songs_ban", checkAdmin, SongController.verifiedBan);

router.post("/songs_verify", checkAdmin, SongController.verify);

router.post("/songs_unban", checkAdmin, SongController.unban);

export default router;
