import cron from "node-cron";
import Mysql from "./helpers/database.js";
import { errorHandler } from "./helpers/errorHandler.js";
import "dotenv/config";
import Controller from "./controllers/player.js";
