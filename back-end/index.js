import express from "express";
import helmet from "helmet";
import "dotenv/config";
import Authentication from "./authentication.js";
import Mysql from "./database.js";
import { fetchWebApi } from "./helpers.js";
const app = express();
const port = process.env.PORT || 3000;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
app.use(helmet());

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

Mysql.setInstance(
  process.env.DB_HOST || "localhost",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  process.env.DB_NAME || "lesna-radiowezel"
);
Mysql.getInstance().query(
  "SELECT * FROM tracks where id = ?",
  [1],
  (err, result, fields) => {
    if (err) throw err;
    console.log("TEST DATABASE QUERY: ", result[0]);
  }
);

Authentication.setInstance(client_id, client_secret);
const token = await Authentication.getInstance().getToken();
console.log(
  "TEST API QUERY: ",
  await fetchWebApi(token, "search?q=choppa&type=track")
);
