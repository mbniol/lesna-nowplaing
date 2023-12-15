import songModel from "../models/song.js";
import Auth from "../helpers/auth.js";
import { get_id } from "../helpers/vote.js";
import { fetchWebApi } from "../helpers/helpers.js";
import request from "request";
import { sendEventsToAll } from "../helpers/player.js";

export default class Controller {
  static #clients = [];
  static generateNavigation(pages, currentPage) {
    if (pages < 1) return [];
    const visiblePages = [{ num: currentPage, current: true }];
    while (visiblePages.length < pages && visiblePages.length < 10) {
      const firstElement = visiblePages[0];
      const lastElement = visiblePages[visiblePages.length - 1];
      if (firstElement.num > 1) {
        visiblePages.unshift({ num: firstElement.num - 1, current: false });
      }
      if (lastElement.num < pages) {
        visiblePages.push({ num: lastElement.num + 1, current: false });
      }
    }
    return visiblePages;
  }

  static async addNewClient(req, res) {
    // console.log("open");
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
      // console.log("close", clientId);
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
    //console.log("hejka", req.query);
    const type = req.query.type ?? "unverified";
    const pp = +(req.query.pp ?? 25);
    let page = +(req.query.page ?? 1);
    //console.log(page, pp, req.query);
    let selectionLimiter = {};
    switch (type) {
      case "unverified":
        // console.log("xD");
        selectionLimiter.verified = false;
        break;
      case "verified":
        selectionLimiter.verified = true;
        break;
      case "banned":
        selectionLimiter.banned = true;
        break;
    }
    let offset = (page - 1) * pp;
    const songsCount = await songModel.countSongs(selectionLimiter);
    if (songsCount <= offset) {
      page = 1;
      offset = 0;
    }
    const pagesCount = Math.ceil(songsCount / pp);
    const songs = await songModel.getSongs(selectionLimiter, offset, pp);
    const navigation = Controller.generateNavigation(pagesCount, page);
    res.json({ songs, navigation });
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
    const track_list = await songModel.get_tracks_to_display();
    // const track_list = await songModel.get_track_ranking();
    // console.log(track_list)
    res.json(track_list);
  }
  static async vote(req, res) {
    // console.log(req.convertedIP);
    const track_link = req.body.spotifyLink;
    const token = await Auth.getInstance().getAPIToken();
    //przeksztalcenie linku na track id
    const track_id = await get_id(track_link);
    // console.log(track_id);
    // console.log(track_id);
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
            await songModel.add_vote(
              track_id,
              req.convertedIP,
              req.body.visitorId
            );
            const votes = await songModel.votes_amount(track_id);
            sendEventsToAll(Controller.#clients, {
              track_id,
              votes,
            });
            res.json({ error: "dodano piosenkę i głos" });
          }
        }
      } else {
        if (rows[0][0]["banned"] === 1) {
          res.json({ error: "piosenka zostala zabanowan przez administracje" });
        } else {
          await songModel.add_vote(
            track_id,
            req.convertedIP,
            req.body.visitorId
          );
          const votes = await songModel.votes_amount(track_id);
          sendEventsToAll(Controller.#clients, {
            track_id,
            cover: rows[0][0]["cover"],
            artist: rows[0][0]["artist"],
            name: rows[0][0]["name"],
            votes,
          });
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
    // console.log(track_id);
    if (track_id) {
      const rows = await songModel.get_song(track_id);
      if (rows[0][0] === undefined) {
        // console.log("api");
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
