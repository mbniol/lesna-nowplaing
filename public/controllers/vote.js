import songModel from "../models/song.js";
import Auth from "../helpers/auth.js";
import voteModel from "../models/vote.js";
import { EventTarget } from "../helpers/eventTarget.js";
import { get_id } from "../helpers/vote.js";

export default class Controller {
  static async addVote(
    trackID,
    IP,
    visitorID,
    cover = undefined,
    artist = undefined,
    name = undefined
  ) {
    console.log(trackID, IP, visitorID);
    await voteModel.add(trackID, IP || "", visitorID || "");
    const votes = await songModel.getVotesFor(trackID);
    EventTarget.getInstance("voters").sendToAll({
      trackID,
      cover,
      artist,
      name,
      votes,
    });
  }
  static async processVote(req, res) {
    const track_link = req.body.spotifyLink;
    const token = await Auth.getInstance().getAPIToken();
    const trackID = await get_id(track_link);
    const visitorID = req.body.visitorId;
    const IP = req.convertedIP;
    if (!trackID) {
      return res.json({ error: "podany link jest nieprawidłowy" });
    }
    const localTrackData = await songModel.get_song(trackID);
    if (localTrackData?.banned) {
      return res.json({
        error: "piosenka zostala zabanowan przez administracje",
      });
    } else if (localTrackData) {
      Controller.addVote(
        trackID,
        IP,
        visitorID,
        localTrackData.cover,
        localTrackData.artist,
        localTrackData.name
      );
      return res.json({ error: "dodano głos" });
    }
    const track = await fetchWebApi(token, "tracks/" + trackID);
    if (track["error"]) {
      return res.json({ error: "wystapil blad przy odczycie piosenki" });
    }
    if (track["explicit"]) {
      songModel.addExplicitSong();
      return res.json({ error: "piosenka jest nieodpowiednia" });
    }
    await songModel.addSong(
      trackID,
      track.album.images[0].url,
      track.artists[0].name,
      track.duration_ms,
      track.name
    );
    await Controller.addVote(trackID, IP, visitorID);
    res.json({ error: "dodano piosenkę i głos" });
  }
}
