import express from "express";
import helmet from "helmet";
import "dotenv/config";
import Auth from "./helpers/auth.js";
import { fetchWebApi } from "./helpers/helpers.js";
import mainRouter from "./routes/router.js";
import bodyParser from "body-parser";
import session from "express-session";
import Mysql from "./helpers/database.js";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const app = express();
const port = process.env.PORT || 3000;
const client_id = "405c695fe40447e5870aa2e44101c5a7";
const client_secret = "1f89010e9b5749cb89947602fd2443f3";
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "sekret", cookie: { maxAge: 60000 } }));
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
  process.env.DB_NAME || "lesna-radiowezel"
);
console.log("elo");
// Mysql.getInstance().query(
//   "SELECT * FROM tracks where id = ?",
//   [1],
//   (err, result, fields) => {
//     if (err) throw err;
//     console.log("TEST DATABASE QUERY: ", result[0]);
//   }
// );

Auth.setInstance(client_id, client_secret, "http://localhost:3000/login");
const token = await Auth.getInstance().getAPIToken();
// console.log(
//   "TEST API QUERY: ",
//   (await fetchWebApi(token, "search?q=choppa&type=track")).tracks.items
// );

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
{
}
import("./models/song.js").then(({ newTruck, vote, votes }) => {
  //testy pobierania danych piosenki z api
  const track_id = "2LBqCSwhJGcFQeTHMVGwy3";
  //console.log(vote(token,track_id))
  // votes();
});

/* console.log(
  'track',track['name']
)
console.log(
  'typ',track['type']
)
console.log(
  'exp', track['explicit']
)
console.log(
  'zdj',track['album']['images'][0]['url']
)
console.log(
  'czas', Number((track['duration_ms']/1000).toFixed(2)),'s'
) */
