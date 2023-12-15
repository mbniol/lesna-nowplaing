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
  static async sendDataToClients(req, res) {
    const data = req.body;
    
    sendEventsToAll(Controller.#clients, data);
    res.sendStatus(200);
  }
  static async sendStateToClients(data) {
    sendEventsToAll(Controller.#clients, data);
    const token = await Auth.getInstance().getSDKToken();
    // console.log('token: ', token)
    // const { devices } = await fetchWebApi(token, "me/player/devices");
    // const currentDevice = devices.find((device) => device.is_active);
    console.log('sendtoclients', data)
    if (data.action === "resume") {
      await fetchWebApi(
        token,
        // "me/player/play?device_id=" + currentDevice.id,
        "me/player/play",
        "PUT"
      )
    } else if (data.action === "pause") {
      await fetchWebApi(
        token,
        // "me/player/pause?device_id=" + currentDevice.id,
        "me/player/pause",
        "PUT"
      );
    }
    // res.sendStatus(200);
  }
  static async getQueue(req, res) {
    const token = await Auth.getInstance().getSDKToken(
      req.session.code,
      `https://${process.env.WEB_HOST}:${process.env.WEB_PORT}/player`
    );
    function getTheEssence(track, imageSize) {
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
        const name = track.name;
        const id = track.id;
        return {
          image,
          artists,
          duration: {
            seconds: Math.floor(track.duration_ms / 1000),
            human: duration_human,
          },
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
        const name = track.show.name;
        const id = track.id;
        return {
          image,
          artists,
          duration: {
            seconds: Math.floor(track.duration_ms / 1000),
            human: duration_human,
          },
          name,
          id,
        };
      }
    }
    const data = await fetchWebApi(token, "me/player/queue");
    if (data.queue && data.currently_playing) {
      const queueTruncated = data.queue.slice(0, 6);
      const tracks = queueTruncated.map((track) => getTheEssence(track, 300));
      const current_track = getTheEssence(data.currently_playing, 640);
      res.json({ current_track, queue: tracks });
    }
  }
}

export default Controller;
