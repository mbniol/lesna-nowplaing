// import songModel from "../models/song.js";
import {
  clearPlaylist,
  get_pattern,
  addToPlaylist,
} from "../helpers/playlist.js";
import patternModel from "../models/pattern.js";
import Auth from "../helpers/auth.js";
import "dotenv/config";

export default class Controller {
  static async make(req, res) {
    // const SDKToken = await Auth.getInstance().getSDKToken(
    //   req.session.code,
    //   `https://${process.env.WEB_HOST}:${process.env.WEB_PORT}/player`
    // );
    // // await clearPlaylist(SDKToken);
    // const APIToken = await Auth.getInstance().getAPIToken();
    // const pattern = await get_pattern(await patternModel.withBreaks());
    // console.log("pattern: ", pattern);
    // const requestToMaciej;
    // // //wyciągnięcie odpowiedniej ilości piosenek z bazy aby zapewnić odpowiedni czas
    // let tracks_length;
    // // let tracks_votes;
    // let i = 0;
    // const mainSongs = []
    // const beginningSongs = []
    // const finishingSongs = []
    // for(let remainingLunchTime = pattern.lunch_break_time; remainingLunchTime + currentSongLength > 0; remainingLunchTime =- currentSongLength){
    //   mainSongs.push(currentSong)
    // }
    // const theTimeOfRemainingSongs;
    // for(let remainingBeginningTime = pattern.short_break_time - theTimeOfRemainingSongs; remainingBeginningTime > 0; remainingBeginningTime =- currentSongLength){
    //   sideSongs.push(currentSong)
    // }
    // const remainingSongs;
    // const orderedSongArray = [...beginningSongs, ...mainSongs, ...finishingSongs]
    // // let remainingLunchTime
    // // while(pattern.lunch_break_time < tracks_length){
    // // }
    // // if(pattern.lunch_break_time + pattern.short_break_time < tracks_length){
    // //   mainSongs.push(tracks)
    // // }
    // // do {
    // //   // tracks_votes = await songModel.get_track_ranking(1, i);
    // //   tracks_votes = await getTracksRankingFrom("2023-12-22");
    // //   time = 0;
    // //   tracks_votes.forEach((track) => (time += track["length"] / 1000));
    // //   i++;
    // // } while (pattern.lunch_break_time + pattern.short_break_time > time);
    // // //odwrócona tablica glosów
    // // if (pattern.lunch_break_time + pattern.short_break_time > time) {
    // //   let track_list = tracks_votes.reverse();
    // //   const tracks_uris = await track_list.map(
    // //     (track) => "spotify:track:" + track["id"]
    // //   );
    // //   await addToPlaylist(SDKToken, tracks_uris);
    // // } else if (time >= pattern.lunch_break_time + pattern.short_break_time) {
    // //   let index = 0;
    // //   let time = 0;
    // //   let main_uris = [];
    // //   let offset_uris = [];
    // //   //stworzenie tablicy z piosenek o największej ilości głosów
    // //   do {
    // //     time += tracks_votes[index]["length"] / 1000;
    // //     main_uris.push("spotify:track:" + tracks_votes[index]["id"]);
    // //     index++;
    // //   } while (time <= pattern.lunch_break_time);
    // //   time = 0;
    // //   //stworzenie tablicy z piosenek na czas między pierwszą przerwą a głównymi przerwami
    // //   do {
    // //     time += tracks_votes[index]["length"] / 1000;
    // //     offset_uris.push("spotify:track:" + tracks_votes[index]["id"]);
    // //     index++;
    // //   } while (time <= pattern.short_break_time);
    // //   //połączenie 2 tablic
    // //   let uris = offset_uris.concat(main_uris);
    // //   //dodanie reszty piosenek na koniec listy
    // //   for (; index < tracks_votes.length; index++) {
    // //     uris.push("spotify:track:" + tracks_votes[index]["id"]);
    // //   }
    // //   await addToPlaylist(SDKToken, uris);
    // // }
    // // res.sendStatus(200);
  }
}
