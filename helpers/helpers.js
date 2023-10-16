import path from "path";
import { fileURLToPath } from "url";
import Auth from "./auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchWebApi(token, endpoint, method = "GET", body) {
  const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body),
  });

  // console.log(res);
  // console.log(res);
  try {
    return await res.json();
  } catch (e) {
    return await res.text();
  }
  // return await res.json();
}

function renderView(res, filename) {
  res.sendFile(path.join(__dirname + "/../views/" + filename));
}

async function new_connect() {
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
  return Mysql;
}

function renderViewChainable(filename) {
  return (req, res) => renderView(res, filename);
}

async function new_token() {
  // const client_id = "405c695fe40447e5870aa2e44101c5a7";
  // const client_secret = "1f89010e9b5749cb89947602fd2443f3";
  // Auth.setInstance(client_id, client_secret, "http://localhost:3000/login");
  // const token = await Auth.getInstance().getAPIToken();
  // return token;
}

export { renderViewChainable, fetchWebApi, renderView, new_connect, new_token };
