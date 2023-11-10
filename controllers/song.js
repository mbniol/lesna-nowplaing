import songModel from "../models/song.js";
import Auth from "../helpers/auth.js";
import { get_id } from "../helpers/vote.js";
import { fetchWebApi } from "../helpers/helpers.js";
import request from "request";
import { sendEventsToAll } from "../helpers/player.js";

export default class Controller {
  static #clients = [];
  static async addNewClient(req, res) {
    console.log("open");
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
      console.log("close", clientId);
      Controller.#clients = Controller.#clients.filter(
        (client) => client.id !== clientId
      );
    });
  }
  static async ban(req, res) {
    const songs = req.body;
    for (const id in songs) {
      await songModel.ban_song(songs[id]);
    }
    res.sendStatus(200);
  }
  static async verifiedBan(req, res) {
    const songs = req.body;
    for (const id in songs) {
      await songModel.ban_song(songs[id]);
    }
    res.sendStatus(200);
  }
  static async unban(req, res) {
    const songs = req.body;
    for (const id in songs) {
      await songModel.unban_song(songs[id]);
    }
    res.sendStatus(200);
  }

  static async verify(req, res) {
    const songs = req.body;
    for (const id in songs) {
      await songModel.verify_song(songs[id]);
    }
    res.sendStatus(200);
  }

  static async getMany(req, res) {
    const songs = await songModel.getSongs();
    res.json(songs);
  }
  static async getBannedTracks(req, res) {
    const songs = await songModel.getSongs(1, 1);
    res.json(songs);
  }
  static async getVerifiedTracks(req, res) {
    const songs = await songModel.getSongs(0, 1);
    res.json(songs);
  }

  static async votes(req, res) {
    const track_list = await songModel.get_track_ranking();
    res.json(track_list);
  }
  static async vote(req, res) {
    console.log(req.convertedIP);
    const track_link = req.body.spotifyLink;
    const token = await Auth.getInstance().getAPIToken();
    //przeksztalcenie linku na track id
    const track_id = await get_id(track_link);
    if (track_id) {
      const rows = await songModel.get_song(track_id);
      if (rows[0][0] === undefined) {
        const track = await fetchWebApi(token, "tracks/" + track_id);
        if (track["error"] !== undefined) {
          res.json({ error: "wystapil blad przy odczycie piosenki" });
        } else {
          //piosenka jest niecenzuralna
          if (track["explicit"] === true) {
            await songModel.add_track(
              track_id,
              track["album"]["images"][0]["url"],
              track.artists[0].name,
              track["duration_ms"],
              track["name"],
              1,
              1
            );
            res.json({ error: "piosenka jest nieodpowiednia" });
          } else {
            //piosenki nie ma w bazie danych
            await songModel.add_track(
              track_id,
              track["album"]["images"][0]["url"],
              track.artists[0].name,
              track["duration_ms"],
              track["name"]
            );
            await songModel.add_vote(track_id, req.convertedIP);
            const votes = await songModel.votes_amount(track_id);
            sendEventsToAll(Controller.#clients, { track_id, votes });
            res.json({ error: "dodano piosenkę i głos" });
          }
        }
      } else {
        if (rows[0][0]["banned"] === 1) {
          res.json({ error: "piosenka zostala zabanowan przez administracje" });
        } else {
          await songModel.add_vote(track_id, req.convertedIP);
          const votes = await songModel.votes_amount(track_id);
          sendEventsToAll(Controller.#clients, { track_id, votes });
          res.json({ error: "dodano głos" });
        }
      }
    } else {
      res.json({ error: "podany link jest nieprawidłowy" });
    }
  }

  static async check_track(req, res) {
    const track_link = req.body.spotifyLink;
    const token = await Auth.getInstance().getAPIToken();
    //przeksztalcenie linku na track id
    const track_id = await get_id(track_link);
    if (track_id) {
      const rows = await songModel.get_song(track_id);
      if (rows[0][0] === undefined) {
        console.log("api");
        const track = await fetchWebApi(token, "tracks/" + track_id);
        if (track["error"] !== undefined) {
          res.json({ error: "wystapil blad przy odczycie piosenki" });
        } else {
          //piosenka jest niecenzuralna
          if (track["explicit"] === true) {
            res.json({ error: "piosenka jest nieodpowiednia" });
            await songModel.add_track(
              track_id,
              track["album"]["images"][0]["url"],
              track.artists[0].name,
              track["duration_ms"],
              track["name"],
              1,
              1
            );
          } else {
            //piosenki nie ma w bazie danych
            if (rows[0][0] === undefined) {
              await songModel.add_track(
                track_id,
                track["album"]["images"][0]["url"],
                track.artists[0].name,
                track["duration_ms"],
                track["name"],
                0
              );
              res.json({
                id: track_id,
                img: track["album"]["images"][0]["url"],
                artist: track.artists[0].name,
                time: track["duration_ms"],
                name: track["name"],
              });
            }
          }
        }
      } else {
        if (rows[0][0]["banned"] === 1) {
          res.json({ error: "piosenka zostala zabanowan przez administracje" });
        } else {
          const json = {
            id: rows[0][0]["id"],
            img: rows[0][0]["cover"],
            artist: rows[0][0]["artist"],
            time: rows[0][0]["length"],
            name: rows[0][0]["name"],
          };
          res.json(json);
        }
      }
    } else {
      res.json({ error: "podany link jest nieprawidłowy" });
    }
  }
}
