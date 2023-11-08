import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchWebApi(token, endpoint, method = "GET", body) {
  const [response, responseErr] = await errorHandler(
    fetch,
    null,
    `https://api.spotify.com/v1/${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method,
      body: JSON.stringify(body),
    }
  );
  if (responseErr) {
    throw new Error(
      `Nie udało się wykonać zapytania do WebAPI na endpoint ${endpoint}`,

      { cause: responseErr }
    );
  }

  const [jsonResponse, jsonErr] = await errorHandler(response.json, response);
  if (jsonErr) {
    throw new Error(
      `Nie udało się uzyskać danych w formacie JSON z zapytania do WebAPI na endpoint ${endpoint}`,

      { cause: jsonErr }
    );
  }

  return jsonResponse;
}

function renderView(res, filename) {
  res.sendFile(path.join(__dirname + "/../views/" + filename));
}

async function new_connect() {
  //ustawienie połączenia z baza danych
  const [, connectionErr] = await errorHandler(
    Mysql.setInstance,
    Mysql,
    process.env.DB_HOST || "localhost",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    process.env.DB_NAME || "radio"
  );
  if (connectionErr) {
    throw new Error("Błąd przy ustanawianiu połączenia:", { cause: error });
  }
  return Mysql;
}

function renderViewChainable(filename) {
  return (req, res) => renderView(res, filename);
}

async function new_token() {
  // const client_id = "405c695fe40447e5870aa2e44101c5a7";
  // const client_secret = "1f89010e9b5749cb89947602fd2443f3";
  // Auth.setInstance(client_id, client_secret, "https://192.168.17.15:3000/login");
  // const token = await Auth.getInstance().getAPIToken();
  // return token;
}

export { renderViewChainable, fetchWebApi, renderView, new_connect, new_token };
