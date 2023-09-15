import { Router } from "express";
import viewPlayerRouter from "./view/player.js";
import viewRequestRouter from "./view/request.js";
import apiPlayerRouter from "./api/player.js";
import apiRequestRouter from "./api/request.js";

const router = new Router();



// router.get("*", (req, res) => {
//   res.send("PAGE NOT FOUND");
// });

router.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

router
  .use(viewPlayerRouter)
  .use(viewRequestRouter)
  .use(apiPlayerRouter)
  .use(apiRequestRouter);



export default router;
