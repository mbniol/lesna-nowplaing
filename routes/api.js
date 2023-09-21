import { Router } from "express";
import Auth from "../helpers/auth.js";
import patternModel from "../models/pattern.js";

const router = new Router();

router.get("/token/sdk", async (req, res) => {
  const token = await Auth.getInstance().getSDKToken();
  res.json({
    token,
  });
});

router.get("/token/sdk", async (req, res) => {
  const token = await Auth.getInstance().getSDKToken();
  res.json({
    token,
  });
});

router.get("/pattern", async (req, res) => {
  const patterns = await patternModel.getMany();
  res.json(patterns);
});

router.post("/pattern", async (req, res) => {
  console.log(req.body);
  const { offset, name } = req.body;
  await patternModel.add(name, offset);
  res.sendStatus(200);
});

router.delete("/pattern/:id", async (req, res) => {
  const id = req.params.id
  await patternModel.delete(id);
  res.sendStatus(200);
});

router.put("/pattern/:id/active", async (req, res) => {
  const id = req.params.id
  await patternModel.makeActive(id);
  res.sendStatus(200);
});

export default router;
