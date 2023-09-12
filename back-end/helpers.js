import path from "path";

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

function renderView(filename) {
  return (res) => res.sendFile(path.join(__dirname + "../" + filename));
}

export { fetchWebApi, renderView };
