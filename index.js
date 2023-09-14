import express from "express";
import helmet from "helmet";
import "dotenv/config";

import Authentication from "./helpers/authentication.js";
import Mysql from "./helpers/database.js";
import { fetchWebApi } from "./helpers/helpers.js";

import mainRouter from "./routes/router.js";

const app = express();
const port = process.env.PORT || 3000;
const client_id = "2aac28ace2cf4d76954eca268d299d6c";
const client_secret = "0cc35cd4b9844e33b45c10cabd0fb19b";
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(mainRouter);

// Mysql.setInstance(
//   process.env.DB_HOST || "localhost",
//   process.env.DB_USER || "root",
//   process.env.DB_PASSWORD || "",
//   process.env.DB_NAME || "lesna-radiowezel"
// );
// Mysql.getInstance().query(
//   "SELECT * FROM tracks where id = ?",
//   [1],
//   (err, result, fields) => {
//     if (err) throw err;
//     console.log("TEST DATABASE QUERY: ", result[0]);
//   }
// );

 Authentication.setInstance(client_id, client_secret);
 const token = await Authentication.getInstance().getToken();
 /* console.log(
   "TEST API QUERY: ",
   await fetchWebApi(token, "search?q=choppa&type=track")
 ); */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});




//testy pobierania danych piosenki z api
const track = await fetchWebApi(token, "tracks/4h9wh7iOZ0GGn8QVp4RAOB")

console.log(
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
)
