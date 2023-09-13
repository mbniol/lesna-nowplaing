import { Router } from "express";
import viewPlayerRouter from "./view/player.js";
import viewRequestRouter from "./view/request.js";
import apiPlayerRouter from "./api/player.js";
import apiRequestRouter from "./api/request.js";

const router = new Router();

router
  .use(viewPlayerRouter)
  .use(viewRequestRouter)
  .use(apiPlayerRouter)
  .use(apiRequestRouter);

export default router;
