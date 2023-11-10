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
    console.warn(
      new Error(
        `Nie udało się uzyskać danych w formacie JSON z zapytania do WebAPI na endpoint ${endpoint}`,

        { cause: jsonErr }
      )
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

export { renderViewChainable, fetchWebApi, renderView, new_connect };
