import express from "express";
import helmet from "helmet";
import "dotenv/config";
import Auth from "./helpers/auth.js";
import { fetchWebApi } from "./helpers/helpers.js";
import mainRouter from "./routes/router.js";
import bodyParser from "body-parser";
import session from "express-session";
import Mysql from "./helpers/database.js";
import fs from "fs";
import https from "https";
import cron from "node-cron";
import { errorHandler } from "./helpers/errorHandler.js";
import PlayerController from "./controllers/player.js";
import dayOffModel from "./models/day_off.js";
import DisplayController from "./controllers/display.js";
import {
  clearPlaylist,
  get_pattern,
  addToPlaylist,
} from "./helpers/playlist.js";
// import cron from "node-cron";
import patternModel from "./models/pattern.js";

// import {vote} from "./models/song.js";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const app = express();
const port = process.env.WEB_PORT || 3000;

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(mainRouter);

Mysql.setInstance(
  process.env.DB_HOST || "localhost",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  process.env.DB_NAME || "radio"
);

Auth.setInstance(client_id, client_secret);
//
https
  .createServer(
    {
      key: fs.readFileSync(process.env.SELF_ASSIGNED_CERT),
      cert: fs.readFileSync(process.env.CERT_KEY),
    },
    app
  )
  .listen(port);

async function updateSongs() {
  const SDKToken = await Auth.getInstance().getSDKToken();
  const pattern = get_pattern(await patternModel.withBreaks());
  const votesRequest = await fetch(
    `${process.env.VOTES_SERVER}/api/track_list`
  );
  const votesJSON = await votesRequest.json();

  let tracksLength = votesJSON.reduce(
    (accumulator, { length }) => (accumulator += length),
    0
  );

  const songsShortage =
    pattern.short_break_time + pattern.lunch_break_time - tracksLength;

  if (songsShortage > 0) {
    const deficitRequest = await fetch(
      `${process.env.VOTES_SERVER}/api/random_songs?l=` + songsShortage
    );
    const additionalSongs = await deficitRequest.json();
    console.log(
      "additional",
      additionalSongs.reduce(
        (accumulator, { length }) => (accumulator += length),
        0
      ),
      additionalSongs.length
    );
    votesJSON.push(...additionalSongs);
  }

  const mainSongs = [];
  const beginningSongs = [];
  let currentSong = votesJSON.shift();
  for (
    let remainingLunchTime = pattern.lunch_break_time;
    currentSong && remainingLunchTime > 0;

  ) {
    remainingLunchTime -= currentSong.length;
    mainSongs.push(currentSong);
    currentSong = votesJSON.shift();
  }
  for (
    let remainingBeginningTime =
      pattern.short_break_time /*- theTimeOfRemainingSongs*/;
    currentSong && remainingBeginningTime - currentSong.length > 0;

  ) {
    remainingBeginningTime -= currentSong.length;
    beginningSongs.push(currentSong);
    currentSong = votesJSON.shift();
  }
  console.log(beginningSongs.length, mainSongs.length, votesJSON.length);
  const finishingSongs = currentSong ? [currentSong, ...votesJSON] : votesJSON;
  const orderedSongArray = [...beginningSongs, ...mainSongs, ...finishingSongs];
  console.log(
    orderedSongArray.length,
    beginningSongs.reduce(
      (accumulator, { length }) => (accumulator += length),
      0
    ),
    mainSongs.reduce((accumulator, { length }) => (accumulator += length), 0),
    finishingSongs.reduce(
      (accumulator, { length }) => (accumulator += length),
      0
    ),
    mainSongs
  );
  const tracks_uris = orderedSongArray.map(
    (track) => "spotify:track:" + track["id"]
  );
  await clearPlaylist(SDKToken);
  await addToPlaylist(SDKToken, tracks_uris);
  await fetch(`${process.env.VOTES_SERVER}/api/reset_ranking`, {
    method: "PUT",
  });
}

function runAtSpecificTimeOfDay(
  hour,
  minutes,
  seconds,
  func,
  alarm_offset = 0
) {
  const now = new Date();
  let eta_ms =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minutes,
      seconds,
      0
    ).getTime() - now;
  eta_ms += alarm_offset * 1000;
  if (eta_ms > 0) {
    console.log(eta_ms);
    setTimeout(func, eta_ms);
  }
}

// DisplayController.showAmountOfClients();

const setUpTimeouts = async () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const isDayOff = await dayOffModel.exists(month, day);
  if (Boolean(isDayOff)) {
    return;
  }
  const pool = Mysql.getPromiseInstance();
  const [data, err] = await errorHandler(
    pool.query,
    pool,
    `SELECT b.id, b.start, b.end, p.alarm_offset
        FROM breaks as b join patterns as p on p.id=b.pattern_id
        WHERE p.active=1
        ORDER BY b.start;`
  );
  const [rows] = data;
  console.log("Opóźnienie: ", rows[0].alarm_offset);
  console.log("Układ przerw:");
  const breaksTimes = rows.map(({ id, start, end, alarm_offset }) => {
    const startArr = start.split(":");
    const endArr = end.split(":");
    return { startArr, endArr, alarm_offset };
  });
  breaksTimes.forEach(({ startArr, endArr, alarm_offset }, i) => {
    if (i === 0) {
      runAtSpecificTimeOfDay(
        ...startArr,
        async () => {
          const tempDate = new Date();
          console.log(
            "Pierwsza przerwa dnia",
            `${tempDate.getHours()}:${tempDate.getMinutes()}`
          );
          const token = await Auth.getInstance().getSDKToken();
          const res = await fetchWebApi(token, "me/player/play", "PUT", {
            context_uri: `spotify:playlist:${process.env.PLAYLIST_ID}`,
            offset: {
              position: 0,
            },
            position_ms: 0,
          });
          // console.log(res);
          PlayerController.sendDataToClients({
            action: "resume",
          });
        },
        alarm_offset
      );
    } else {
      runAtSpecificTimeOfDay(
        ...startArr,
        async () => {
          const tempDate = new Date();
          console.log(
            "Inna przerwa dnia, uruchomienie",
            `${tempDate.getHours()}:${tempDate.getMinutes()}`
          );
          DisplayController.sendDataToClients({
            action: "resume",
            fromServer: true,
          });
          PlayerController.sendDataToClients({
            action: "resume",
          });
        },
        alarm_offset
      );
    }
    runAtSpecificTimeOfDay(
      ...endArr,
      async () => {
        const tempDate = new Date();
        console.log(
          "Pauzowanie przerwy",
          `${tempDate.getHours()}:${tempDate.getMinutes()}`
        );
        DisplayController.sendDataToClients({
          action: "pause",
          fromServer: true,
          tillNextBreak: breaksTimes[i + 1]
            ? [
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                ...breaksTimes[i + 1].startArr,
              ]
            : await getFirstBreakDateForNextDay(tempDate),
        });
        PlayerController.sendDataToClients({
          action: "pause",
        });
      },
      alarm_offset
    );
  });
};

async function getFirstBreakDateForNextDay(now) {
  let isDayOff = true;
  let currDate = now;
  while (isDayOff) {
    const newDay = now.getDate() + 1;
    currDate.setDate(newDay);
    const month = now.getMonth() + 1;
    isDayOff = Boolean(await dayOffModel.exists(month, newDay));
  }
  return [
    currDate.getFullYear(),
    currDate.getMonth(),
    currDate.getDate(),
    7,
    10,
    0,
  ];
}

setUpTimeouts();

cron.schedule("0 1 * * *", async () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const isDayOff = await dayOffModel.exists(month, day);
  if (!Boolean(isDayOff)) {
    updateSongs();
  }
});

cron.schedule("0 2 * * *", setUpTimeouts);
