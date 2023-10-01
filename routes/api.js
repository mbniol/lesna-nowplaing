import { Router } from "express";
import Auth from "../helpers/auth.js";
import patternModel from "../models/pattern.js";
import breakModel from "../models/break.js";
import {
  checkAdmin,
  checkNotAdmin,
  loginSpotify,
} from "../middlewares/checkAdmin.js";
import { checkVoteRight } from "../middlewares/voting.js";
import { vote, votes } from "../models/song.js";
import { fetchWebApi } from "../helpers/helpers.js";

const router = new Router();

router.get("/token/sdk", checkAdmin, async (req, res) => {
  const token = await Auth.getInstance().getSDKToken(
    req.session.code,
    "http://localhost:3000/player"
  );
  res.json({
    token,
  });
});

// router.get("/token/sdk", checkAdmin, async (req, res) => {
//   const token = await Auth.getInstance().getSDKToken();
//   res.json({
//     token,
//   });
// });

router.get("/pattern/:pattern_id/break", checkAdmin, async (req, res) => {
  const pattern_id = req.params.pattern_id;
  const breaks = await breakModel.getMany(pattern_id, req.body);
  res.json(breaks);
});

router.put("/pattern/:pattern_id/break", checkAdmin, async (req, res) => {
  const pattern_id = req.params.pattern_id;
  await breakModel.replace(pattern_id, req.body);
  res.sendStatus(200);
});

// router.delete("/pattern/:pattern_id/break/:id", async (req, res) => {
//   const { id, pattern_id } = req.params;
//   await breakModel.delete(id, pattern_id);
//   res.sendStatus(200);
// });

router.post("/pattern/:pattern_id/break", checkAdmin, async (req, res) => {
  const pattern_id = req.params.pattern_id;
  const { name, start, end, forRequested } = req.body;

  await breakModel.add(name, start, end, +Boolean(forRequested), pattern_id);
  res.sendStatus(200);
});

router.get("/pattern", checkAdmin, async (req, res) => {
  const patterns = await patternModel.getMany();
  res.json(patterns);
});

router.get("/pattern/:id", checkAdmin, async (req, res) => {
  const id = req.params.id;
  const patterns = await patternModel.getOne(id);
  res.json(patterns);
});

router.post("/pattern", checkAdmin, async (req, res) => {
  const { offset, name } = req.body;
  await patternModel.add(name, offset);
  res.sendStatus(200);
});

router.delete("/pattern/:id", checkAdmin, async (req, res) => {
  const id = req.params.id;
  await patternModel.delete(id);
  res.sendStatus(200);
});

router.put("/pattern/:id", checkAdmin, async (req, res) => {
  const id = req.params.id;
  const { offset, name, is_active } = req.body;
  await patternModel.edit(id, offset, name, +Boolean(is_active));
  res.sendStatus(200);
});

router.put("/pattern/:id/active", checkAdmin, async (req, res) => {
  const id = req.params.id;
  await patternModel.toggleActive(id);
  res.sendStatus(200);
});

router.post("/login", checkNotAdmin, async (req, res) => {
  const password = req.body.password;
  if (password !== process.env.ADMIN_PASS) {
    return res.sendStatus(403);
  }
  req.session.loggedIn = true;
  const redirect = req.session.redirect;
  req.session.redirect = null;

  //
  res.redirect(redirect);
});

router.get("/track_list", async (req, res) => {
  const track_list = await votes();
  //
  res.json(track_list);
});

router.post("/votes", checkVoteRight, async (req, res) => {
  res.sendStatus(200);
  //
  //
  // req.session.lastVote =
  // if (password !== process.env.ADMIN_PASS) {
  //   return res.sendStatus(403);
  // }
  // req.session.loggedIn = true;
  // //
  // res.redirect("/admin");
});

router.put("/play", async (req, res) => {
  const token = await Auth.getInstance().getSDKToken(
    req.session.code,
    "http://localhost:3000/player"
  );
  await fetchWebApi(token, "me/player/play", "PUT");
  res.sendStatus(200);
});

// router.put("/device", async (req, res) => {
//   const token = await Auth.getInstance().getSDKToken(
//     req.session.code,
//     "http://localhost:3000/player"
//   );
//   console.log(req.body.device_id);
//   const dane = await fetchWebApi(token, "me/player", "PUT", {
//     device_ids: [req.body.device_id],
//     play: true,
//   });
//   console.log(dane);
//   res.sendStatus(200);
// });

router.get("/queue", async (req, res) => {
  const token = await Auth.getInstance().getSDKToken(
    req.session.code,
    "http://localhost:3000/player"
  );
  function getTheEssence(track, imageSize) {
    const image = track.album.images.find(
      (image) => image.height === imageSize
    ).url;
    const artists = track.artists.map((artist) => artist.name).join`, `;
    const minutes = Math.floor(track.duration_ms / 60000);
    const seconds = Math.floor((track.duration_ms - minutes * 60000) / 1000);
    const duration = minutes + ":" + String(seconds).padStart(2, "0");
    const name = track.name;
    return { image, artists, duration, name };
  }
  const data = await fetchWebApi(token, "me/player/queue");
  console.log("kurwaaa");
  if (data.queue && data.currently_playing) {
    // console.log(data.queue.length);
    const tracks = data.queue.map((track) => getTheEssence(track, 300));
    const current_track = getTheEssence(data.currently_playing, 640);
    res.json({ current_track, queue: tracks });
  } else {
    console.log(data);
  }

  // if (dane.queue?.length > 0) {
  //   const image = dane.queue[0].album.images[0];
  //   const artists = dane.queue[0].artists.map((artist) => artist.name).join`, `;
  //   const minutes = Math.floor(dane.queue[0].duration_ms / 60000);
  //   const seconds = Math.floor(
  //     (dane.queue[0].duration_ms - seconds * 60000) / 1000
  //   );
  //   const duration = minutes + ":" + seconds.padStart(2, "0");
  //   const name = dane.queue[0].name;
  //   console.log(image, artists, duration, name);
  // }
  // dane.queue.forEach()
  // dane.currently_playing.forEach((el) => {
  //   console.log(el);
  // });

  // const track_list = await votes();
  //
  // res.json(track_list);
});

export default router;
