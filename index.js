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

// import {vote} from "./models/song.js";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const app = express();
const port = process.env.WEB_PORT || 3000;
// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", "*");

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   // Pass to next layer of middleware
//   next();
// });
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "sekret",
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
    // resave: false,
    // saveUninitialized: false,
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(mainRouter);
//ustawienie połączenia z baza danych
Mysql.setInstance(
  process.env.DB_HOST || "localhost",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  process.env.DB_NAME || "radio"
);
//ustawienie połączenia z api spotify
Auth.setInstance(client_id, client_secret);
const token = await Auth.getInstance().getAPIToken();

// const dane = await fetchWebApi(token, "search?q=choppa&type=track");

//
//   await vote("https://open.spotify.com/track/2tpWsVSb9UEmDRxAl1zhX1")
// );
//
// Mysql.getInstance().query(
//   "SELECT * FROM tracks where id = ?",
//   [1],
//   (err, result, fields) => {
//     if (err) throw err;
//
//   }
// );
https
  .createServer(
    {
      key: fs.readFileSync("./private.key"),
      cert: fs.readFileSync("./merge_certificate.crt"),
    },
    app
  )
  .listen(port);

//
//   "TEST API QUERY: ",
//   (await fetchWebApi(token, "search?q=choppa&type=track")).tracks.items
// );

// import("./models/song.js").then(({ newTruck, vote, votes }) => {
//   //testy pobierania danych piosenki z api
//   const track_id = "2LBqCSwhJGcFQeTHMVGwy3";
//   //
//   // votes();
// });

/* 
  'track',track['name']
)

  'typ',track['type']
)

  'exp', track['explicit']
)

  'zdj',track['album']['images'][0]['url']
)

  'czas', Number((track['duration_ms']/1000).toFixed(2)),'s'
) */
function votingtest() {
  vote("https://open.spotify.com/track/0fYVliAYKHuPmECRs1pbRf");
  vote("https://open.spotify.com/track/0DrDcqWpokMlhKYJSwoT4B");
  vote("https://open.spotify.com/track/0DrDcqWpokMlhKYJSwoT4B");
  vote("https://open.spotify.com/track/0DrDcqWpokMlhKYJSwoT4B");
  vote("https://open.spotify.com/track/0DrDcqWpokMlhKYJSwoT4B");
  vote("https://open.spotify.com/track/3K00Ib1shkOEiAXU5pec6e");
  vote("https://open.spotify.com/track/2LBqCSwhJGcFQeTHMVGwy3");
  vote("https://open.spotify.com/track/2LBqCSwhJGcFQeTHMVGwy3");
  vote("https://open.spotify.com/track/2LBqCSwhJGcFQeTHMVGwy3");
  vote("https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b");
  vote("https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b");
  vote("https://open.spotify.com/track/0OI7AFifLSoGzpb8bdBLLV");
  vote("https://open.spotify.com/track/54ipXppHLA8U4yqpOFTUhr");
  vote("https://open.spotify.com/track/0AUyNF6iFxMNQsNx2nhtrw");
  vote("https://open.spotify.com/track/0AUyNF6iFxMNQsNx2nhtrw");
  vote("https://open.spotify.com/track/7lGKEWMXVWWTt3X71Bv44I");
  vote("https://open.spotify.com/track/0fYVliAYKHuPmECRs1pbRf");
  vote("https://open.spotify.com/track/4h9wh7iOZ0GGn8QVp4RAOB");
  vote("https://open.spotify.com/track/4h9wh7iOZ0GGn8QVp4RAOB");
  vote("https://open.spotify.com/track/4h9wh7iOZ0GGn8QVp4RAOB");
  vote("https://open.spotify.com/track/07fbDnkKdZGk1gLvknxrns");
  vote("https://open.spotify.com/track/2tpWsVSb9UEmDRxAl1zhX1");
}
//votingtest();

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
    setTimeout(func, eta_ms);
  }
}

const NonWorkingDaysCalendar = [
  {
    day: undefined,
    month: undefined,
  },
];

const func = async () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  if (
    nonWorkingDaysCalendar.find(
      ({ nonWorkingDay, nonWorkingMonth }) =>
        nonWorkingDay === day && nonWorkingMonth === month
    )
  ) {
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
  rows.forEach(({ id, start, end, alarm_offset }, i) => {
    console.log(start, end);
    const startArr = start.split(":");
    const endArr = end.split(":");
    const startDate = new Date();
    const endDate = new Date();
    startDate.setHours(...startArr);
    endDate.setHours(...endArr);
    if (i === 0) {
      runAtSpecificTimeOfDay(
        ...startArr,
        async () => {
          console.log("Pierwsza przerwa dnia");
          const token = await Auth.getInstance().getSDKToken();
          await fetchWebApi(token, "me/player/play", "PUT", {
            context_uri: `spotify:playlist:${process.env.PLAYLIST_ID}`,
            offset: {
              position: 0,
            },
            position_ms: 0,
          });
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
          console.log("Inna przerwa dnia, uruchomienie");
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
        console.log("Pauzowanie przerwy");
        PlayerController.sendDataToClients({
          action: "pause",
        });
      },
      alarm_offset
    );
  });
  // const tasks = cron.getTasks();
};

func();
let index = 0;
// setInterval(async () => {
//   console.log(
//     `https://${process.env.WEB_HOST}:${process.env.WEB_PORT}/api/player`
//   );
//   if (index % 2 === 0) {
//     console.log("run");
//     PlayerController.sendDataToClients({
//       action: "resume",
//     });
//   } else {
//     console.log("Pauzowanie przerwy");
//     PlayerController.sendDataToClients({
//       action: "pause",
//     });
//   }
//   index++;
// }, 15000);

cron.schedule("0 2 * * Monday-Friday", func);

// setTimeout(func, 15000);
