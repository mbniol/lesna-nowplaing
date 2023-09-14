import express from "express";
import helmet from "helmet";
import "dotenv/config";
import Auth from "./helpers/auth.js";
import Mysql from "./helpers/database.js";
import { fetchWebApi } from "./helpers/helpers.js";
import mainRouter from "./routes/router.js";
import session from "express-session";

const app = express();
const port = process.env.PORT || 3000;
const client_id = "405c695fe40447e5870aa2e44101c5a7";
const client_secret = "1f89010e9b5749cb89947602fd2443f3";
app.use(express.static("public"));
app.use(session({ secret: "sekret", cookie: { maxAge: 60000 } }));
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

Auth.setInstance(client_id, client_secret, "http://localhost:3000/login");
const token = await Auth.getInstance().getAPIToken();
// console.log(
//   "TEST API QUERY: ",
//   (await fetchWebApi(token, "search?q=choppa&type=track")).tracks.items
// );

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
