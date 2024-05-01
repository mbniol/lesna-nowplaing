import { Router } from "express";
import viewRouter from "./view.js";
import apiRouter from "./api.js";

const router = new Router();

// router.get("*", (req, res) => {
//   res.send("PAGE NOT FOUND");
// });

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

router.use("/api", apiRouter).use(viewRouter);

export default router;
