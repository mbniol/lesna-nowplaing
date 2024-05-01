import { sendEventsToAll } from "../helpers/player.js";
import Auth from "../helpers/auth.js";
import { fetchWebApi } from "../helpers/helpers.js";
import "dotenv/config";

class Controller {
  static #clients = [];
  static async addNewClient(req, res) {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    res.writeHead(200, headers);

    const clientId = Math.random();

    const newClient = {
      id: clientId,
      response: res,
    };

    Controller.#clients.push(newClient);
    console.log("nowy klient");

    req.on("close", () => {
      Controller.#clients = Controller.#clients.filter(
        (client) => client.id !== clientId
      );
    });
  }
  static async setPlaylist(req, res) {
    const token = await Auth.getInstance().getSDKToken(
      req.session.code,
      `https://${process.env.WEB_HOST}:${process.env.WEB_PORT}/player`
    );
    const data = await fetchWebApi(token, "me/player/play", "PUT", {
      context_uri: `spotify:playlist:${process.env.PLAYLIST_ID}`,
      offset: {
        position: 0,
      },
      position_ms: 0,
    });
    res.send(200);
    // const data1 = await fetchWebApi(token, "me/player/pause", "PUT");
  }
  static async sendDataToClients(data) {
    console.log("ilość klientów: ", Controller.#clients.length);
    sendEventsToAll(Controller.#clients, data);
  }
}

export default Controller;
