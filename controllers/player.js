import { sendEventsToAll } from "../helpers/player.js";
import Auth from "../helpers/auth.js";
import { fetchWebApi } from "../helpers/helpers.js";

class Controller {
  static #clients = [];
  static async addNewClient(req, res) {
    const headers = {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    };
    res.writeHead(200, headers);

    const clientId = process.env.CLIENT_ID;

    const newClient = {
      id: clientId,
      response: res,
    };

    Controller.#clients.push(newClient);

    req.on("close", () => {
      Controller.#clients = Controller.#clients.filter(
        (client) => client.id !== clientId
      );
    });
  }
  static async sendDataToClients(req, res) {
    const data = req.body;
    sendEventsToAll(Controller.#clients, data);
    res.sendStatus(200);
  }
  static async sendStateToClients(data) {
    sendEventsToAll(Controller.#clients, data);
    const token = await Auth.getInstance().getSDKToken();
    const { devices } = await fetchWebApi(token, "me/player/devices");
    console.log(devices, token);
    const currentDevice = devices.find((device) => device.is_active);
    console.log(currentDevice, data);
    if (data.action === "resume") {
      await fetchWebApi(
        token,
        "me/player/play?device_id=" + currentDevice.id,
        "PUT"
      );
    } else if (data.action === "pause") {
      await fetchWebApi(
        token,
        "me/player/pause?device_id=" + currentDevice.id,
        "PUT"
      );
    }
    // res.sendStatus(200);
  }
  static async getQueue(req, res) {
    const token = await Auth.getInstance().getSDKToken(
      req.session.code,
      "https://localhost:3000/player"
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
      const queueTruncated = data.queue.slice(0, 5);
      // const queueTruncated = data.queue.slice(5);
      const tracks = queueTruncated.map((track) => getTheEssence(track, 300));
      console.log(tracks.length);
      const current_track = getTheEssence(data.currently_playing, 640);
      console.log(current_track);
      res.json({ current_track, queue: tracks });
    }
  }
}

export default Controller;
