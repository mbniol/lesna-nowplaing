import songModel from "../models/song.js";

export default class Controller {
  static async ban(req, res) {
    const songs = req.body;
    console.log(songs);
    for (const id in songs) {
      const status = songs[id];
      await songModel.changeSongStatus(id, status);
    }
    res.sendStatus(200);
  }

  static async getMany(req, res) {
    const songs = await songModel.getSongs();
    res.json(songs);
  }

  static async votes(req, res) {
    const track_list = await songModel.get_track_ranking();
    res.json(track_list);
  }
  static async vote(req, res) {
    const track_link = req.body.spotifyLink;
    const token = await Auth.getInstance().getAPIToken();
    //przeksztalcenie linku na track id
    const track_id = get_id(track_link);
    if (track_id) {
      const track = await fetchWebApi(token, "tracks/" + track_id);
      if (track["error"] !== undefined) {
        return "wystapil blad przy odczycie piosenki";
      } else {
        //piosenka jest niecenzuralna
        if (track["explicit"] === true) {
          return "piosenka jest nieodpowiednia";
        } else {
          //pobranie danych o piosence z bazy
          const rows = await songModel.get_song(track_id);
          //piosenki nie ma w bazie danych
          if (rows[0][0] === undefined) {
            songModel.add_track(
              track_id,
              track["album"]["images"][0]["url"],
              track.artists[0].name,
              track["duration_ms"],
              track["name"]
            );
            songModel.add_vote(track_id);
            return "dodano piosenkę i głos";
          } //piosenka została zbanowana przez admina
          else if (rows[0][0]["banned"] === 1) {
            return "piosenka zostala zabanowan przez administracje";
          } else {
            songModel.add_vote(track_id);
            return "dodano głos";
          }
        }
      }
    } else {
      return "podany link jest nieprawidłowy";
    }
  }
}
