import express from "express";
import helmet from "helmet";
import "dotenv/config";
import Auth from "./helpers/auth.js";
import mainRouter from "./routes/router.js";
import bodyParser from "body-parser";
import session from "express-session";
import Mysql from "./helpers/database.js";
// import { eventTarget } from "./helpers/eventTarget.js";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const app = express();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// eventTarget.createInstance("voters");

app.use(mainRouter);

Mysql.setInstance(
  process.env.DB_HOST || "localhost",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  process.env.DB_NAME || "maciej"
);

Auth.setInstance(client_id, client_secret);

app.listen(process.env.WEB_PORT || 3000);
