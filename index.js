import express from "express";
import helmet from "helmet";
import "dotenv/config";
import Auth from "./helpers/auth.js";
import { fetchWebApi } from "./helpers/helpers.js";
import mainRouter from "./routes/router.js";
import bodyParser from "body-parser";
import session from "express-session";
import Mysql from "./helpers/database.js";
import {vote} from "./models/song.js";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const app = express();
const port = process.env.PORT || 3000;
const client_id = "405c695fe40447e5870aa2e44101c5a7";
const client_secret = "1f89010e9b5749cb89947602fd2443f3";
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "sekret",
    ookie: { maxAge: 60000, httpOnly: true },
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
try {
  await Mysql.setInstance(
    process.env.DB_HOST || "localhost",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    process.env.DB_NAME || "radio"
  );
} catch (error) {
  console.error("Błąd przy ustanawianiu połączenia:", error);
}

//ustawienie połączenia z api spotify
Auth.setInstance(client_id, client_secret);
const token = await Auth.getInstance().getAPIToken();
//console.log(token);
// const dane = await fetchWebApi(token, "search?q=choppa&type=track");
// console.log(dane);
await fetchWebApi(token, "playlists/0TPpEJxe1NNP6jArvunMRh/tracks");
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

//
//   "TEST API QUERY: ",
//   (await fetchWebApi(token, "search?q=choppa&type=track")).tracks.items
// );

app.listen(port, () => {});
{
}
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
function votingtest(){
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
