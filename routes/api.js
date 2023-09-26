import { Router } from "express";
import Auth from "../helpers/auth.js";
import patternModel from "../models/pattern.js";
import breakModel from "../models/break.js";

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

router.get("/pattern/:pattern_id/break", async (req, res) => {
  const pattern_id = req.params.pattern_id;
  console.log(req.body);
  const breaks = await breakModel.getMany(pattern_id, req.body);
  res.json(breaks);
});

router.put("/pattern/:pattern_id/break", async (req, res) => {
  const pattern_id = req.params.pattern_id;
  await breakModel.replace(pattern_id, req.body);
  res.sendStatus(200);
});

// router.delete("/pattern/:pattern_id/break/:id", async (req, res) => {
//   const { id, pattern_id } = req.params;
//   await breakModel.delete(id, pattern_id);
//   res.sendStatus(200);
// });

router.post("/pattern/:pattern_id/break", async (req, res) => {
  const pattern_id = req.params.pattern_id;
  const { name, start, end, forRequested } = req.body;
  console.log(+Boolean(forRequested));
  await breakModel.add(name, start, end, +Boolean(forRequested), pattern_id);
  res.sendStatus(200);
});

router.get("/pattern", async (req, res) => {
  const patterns = await patternModel.getMany();
  res.json(patterns);
});

router.get("/pattern/:id", async (req, res) => {
  const id = req.params.id;
  const patterns = await patternModel.getOne(id);
  res.json(patterns);
});

router.post("/pattern", async (req, res) => {
  console.log(req.body);
  const { offset, name } = req.body;
  await patternModel.add(name, offset);
  res.sendStatus(200);
});

router.delete("/pattern/:id", async (req, res) => {
  const id = req.params.id;
  await patternModel.delete(id);
  res.sendStatus(200);
});

router.put("/pattern/:id", async (req, res) => {
  const id = req.params.id;
  const { offset, name, is_active } = req.body;
  await patternModel.edit(id, offset, name, +Boolean(is_active));
  res.sendStatus(200);
});

router.put("/pattern/:id/active", async (req, res) => {
  const id = req.params.id;
  await patternModel.toggleActive(id);
  res.sendStatus(200);
});

router.post("/login", async (req, res) => {
  const password = req.body.password;
  if (password !== process.env.ADMIN_PASS) {
    res.sendStatus(403);
  }
  req.session.loggedIn = true;
  res.sendStatus(200);
});

export default router;
