import { sendEventsToAll } from "../helpers/player.js";
import Auth from "../helpers/auth.js";

class Controller {
  static #clients = [];
  static async addNewClient(res, req) {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    res.writeHead(200, headers);

    const clientId = randomUUID();

    const newClient = {
      id: clientId,
      response: res,
    };

    this.#clients.push(newClient);

    req.on("close", () => {
      this.#clients = clients.filter((client) => client.id !== clientId);
    });
  }
  static async sendDataToClients(req, res) {
    const data = req.body;
    sendEventsToAll(data);
    res.sendStatus(200);
  }
  static async getQueue(req, res) {
    const token = await Auth.getInstance().getSDKToken(
      req.session.code,
      "http://localhost:3000/player"
    );
    // console.log("xD");
    function getTheEssence(track, imageSize) {
      // console.log(track.type);
      if (track.type === "track") {
        const image = track.album.images.find(
          (image) => image.height === imageSize
        ).url;
        const artists = track.artists.map((artist) => artist.name).join`, `;
        const minutes = Math.floor(track.duration_ms / 60000);
        const seconds = Math.floor(
          (track.duration_ms - minutes * 60000) / 1000
        );
        const duration_human = minutes + ":" + String(seconds).padStart(2, "0");
        // const duration = Math.ceil(track.duration_ms / 1000);
        const name = track.name;
        const id = track.id;
        // console.log(track);
        return {
          image,
          artists,
          duration: track.duration_ms,
          duration_human,
          name,
          id,
        };
      } else if (track.type === "episode") {
        const image = track.images.find(
          (image) => image.height === imageSize
        ).url;
        const artists = track.show.publisher;
        const minutes = Math.floor(track.duration_ms / 60000);
        const seconds = Math.floor(
          (track.duration_ms - minutes * 60000) / 1000
        );
        const duration_human = minutes + ":" + String(seconds).padStart(2, "0");
        // const duration = Math.ceil(track.duration_ms / 1000);
        const name = track.show.name;
        const id = track.id;
        // console.log(track);
        return {
          image,
          artists,
          duration: track.duration_ms,
          duration_human,
          name,
          id,
        };
      }
    }
    const data = await fetchWebApi(token, "me/player/queue");
    // console.log("kurwaaa");
    if (data.queue && data.currently_playing) {
      const tracks = data.queue.map((track) => getTheEssence(track, 300));
      // console.log(tracks);
      const current_track = getTheEssence(data.currently_playing, 640);
      console.log(current_track);
      res.json({ current_track, queue: tracks });
    }
  }
}

export default Controller;
