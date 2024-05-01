import songModel from "../models/song.js";
import Auth from "../helpers/auth.js";
import voteModel from "../models/vote.js";
import { get_id } from "../helpers/vote.js";
import { fetchWebApi } from "../helpers/helpers.js";
// import voteController from "./vote.js";

export default class Controller {
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

  static async getRandomSongs(req, res) {
    const deficitLength = req.query.l;
    const songsAmount = 100;
    const songs = await songModel.getTopVerifiedSong(songsAmount);
    const randomSongs = [];
    for (let remainingLength = deficitLength; remainingLength > 0; ) {
      const randomIndex = (Math.random() * songs.length) | 0;
      remainingLength -= songs[randomIndex].length;
      randomSongs.push(songs[randomIndex]);
      songs.splice(randomIndex, 1);
    }
    res.json(randomSongs);
  }

  static async getMany(req, res) {
    //console.log("hejka", req.query);
    const type = req.query.type ?? "unverified";
    const pp = +(req.query.pp ?? 25);
    let page = +(req.query.page ?? 1);
    const searchQuery = req.query.s ?? "";
    const sanitizedSearchQuery = searchQuery
      .replace(/\+|\-|\>|\<|\(|\)|\~|\*|\"/, "")
      .split(" ")
      .filter((word) => word.length > 0)
      .map((word) => "*" + word + "*")
      .join(" ");
    //console.log(page, pp, req.query);
    let selectionLimiter = {};
    switch (type) {
      case "unverified":
        // console.log("xD");
        selectionLimiter.verified = false;
        selectionLimiter.banned = false;
        break;
      case "verified":
        selectionLimiter.verified = true;
        selectionLimiter.banned = false;
        break;
      case "banned":
        selectionLimiter.banned = true;
        break;
    }
    let offset = (page - 1) * pp;
    const songsCount = await songModel.countSongs(
      selectionLimiter,
      sanitizedSearchQuery
    );
    if (songsCount <= offset) {
      page = 1;
      offset = 0;
    }
    const pagesCount = Math.ceil(songsCount / pp);
    const songs = await songModel.getSongs(
      selectionLimiter,
      sanitizedSearchQuery,
      offset,
      pp
    );
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

  static async getTracksRanking(req, res) {
    const track_list = await songModel.getTracksRanking();
    res.json(track_list);
  }

  static async archiveRanking(tracks) {
    tracks.forEach(async ({ id, votesCount }) => {
      await songModel.updateTrackArchiveRanking(id, votesCount);
    });
    console.log("ej");
  }

  static async resetRanking(req, res) {
    const tracks = await songModel.getTracksRanking();
    await Controller.archiveRanking(tracks);
    console.log("po");
    await voteModel.clear();
    tracks.forEach(async (track) => {
      const halvedVotes = Math.floor(track.votesCount / 2);
      for (let votesToAdd = halvedVotes; votesToAdd > 0; votesToAdd--) {
        await voteModel.addArtificial(track.id);
      }
    });
    res.send(200);
  }

  static async check_track(req, res) {
    const track_link = req.body.spotifyLink;
    const token = await Auth.getInstance().getAPIToken();
    //przeksztalcenie linku na track id
    const track_id = await get_id(track_link);
    // console.log(track_id);
    if (!track_id) {
      return res.json({ error: "podany link jest nieprawidłowy" });
    }
    const localTrackData = await songModel.get_song(track_id);
    if (localTrackData && localTrackData["banned"]) {
      return res.json({
        error: "piosenka zostala zabanowan przez administracje",
      });
    } else if (localTrackData) {
      const json = {
        id: localTrackData["id"],
        img: localTrackData["cover"],
        artist: localTrackData["artist"],
        time: localTrackData["length"],
        name: localTrackData["name"],
      };
      return res.json(json);
    }
    // console.log("api");
    const track = await fetchWebApi(token, "tracks/" + track_id);
    if (track["error"]) {
      return res.json({ error: "wystapil blad przy odczycie piosenki" });
    }
    //piosenka jest niecenzuralna
    if (track["explicit"]) {
      await songModel.add_track(
        track_id,
        track["album"]["images"][0]["url"],
        track.artists[0].name,
        track["duration_ms"],
        track["name"],
        1,
        1
      );
      return res.json({ error: "piosenka jest nieodpowiednia" });
    }
    //piosenki nie ma w bazie danych
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
