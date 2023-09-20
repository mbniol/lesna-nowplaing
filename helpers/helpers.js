import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchWebApi(token, endpoint, method = "GET", body) {
  const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body),
  });
  return await res.json();
}

function renderView(res, filename) {
  res.sendFile(path.join(__dirname + "/../views/" + filename));
}

export { fetchWebApi, renderView };
