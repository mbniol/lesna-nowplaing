import { Router } from "express";
import { checkAdmin, checkNotAdmin } from "../middlewares/checkAdmin.js";
import AuthController from "../controllers/auth.js";
import BreakController from "../controllers/break.js";
import PatternController from "../controllers/pattern.js";
import PlayerController from "../controllers/player.js";
import DisplayController from "../controllers/display.js";
import PlaylistController from "../controllers/playlist.js";
import DayOffController from "../controllers/day_off.js";

const router = new Router();

router.get(
  "/token/sdk",
  checkAdmin,
  (req, res, next) => {
    next();
  },
  AuthController.getSDKToken
);

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

router.get("/player", checkAdmin, PlayerController.addNewClient);

router.post("/player", checkAdmin, PlayerController.addNewClient);

router.get("/display", checkAdmin, DisplayController.addNewClient);

router.post("/playlist", checkAdmin, PlayerController.setPlaylist);

router.get("/playlist", checkAdmin, PlaylistController.make);

router.get("/queue", checkAdmin, DisplayController.getQueue);

router.get("/days_off", checkAdmin, DayOffController.getMany);

router.get("/days_off", checkAdmin, DayOffController.exists);

router.delete("/days_off", checkAdmin, DayOffController.delete);

router.delete("/days_off/all", checkAdmin, DayOffController.deleteAll);

router.post("/days_off", checkAdmin, DayOffController.add);

export default router;
