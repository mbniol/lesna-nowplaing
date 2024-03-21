import { Router } from "express";
import { renderViewChainable, renderView } from "../helpers/helpers.js";
import {
  checkAdmin,
  checkNotAdmin,
  loginSpotify,
} from "../middlewares/checkAdmin.js";

const router = new Router();

router.get(
  "/admin/login",
  checkNotAdmin,
  renderViewChainable("admin/login.html")
);

router.get(
  "/player",
  checkAdmin,
  loginSpotify,
  renderViewChainable("player.html")
);

router.get("/admin", checkAdmin, renderViewChainable("admin/index.html"));

router.get("/display", checkAdmin, renderViewChainable("admin/display.html"));

router.get(
  "/admin/pattern/:id",
  checkAdmin,
  renderViewChainable("admin/editpreset.html")
);

router.get("/", renderViewChainable("voting.html"));

router.get(
  "/admin/songs",
  checkAdmin,
  renderViewChainable("admin/song_control.html")
);

router.get("/display2", checkAdmin, renderViewChainable("admin/display2.html"));

router.get("/calendar", checkAdmin, renderViewChainable("admin/calendar.html"));

router.get("*", renderViewChainable("404.html"));

export default router;
