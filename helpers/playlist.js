import { fetchWebApi } from "./helpers.js";

async function clearPlaylist(token) {
  const current_playlist_tracks = await fetchWebApi(
    token,
    "playlists/"+process.env.PLAYLIST_ID,
    "GET"
  );
  //przekształcenie zwróconego obiektu z api na tablice
  const tracks_array = current_playlist_tracks.tracks.items.map((item) => ({
    uri: item.track.uri,
  }));
  //wpisanie tablicy do obiektu
  const tracks_object = {
    tracks: tracks_array,
  };
  
  //usunięcie obiektów
  const result = await fetchWebApi(
    token,
      "playlists/"+process.env.PLAYLIST_ID+"/tracks",
    "DELETE",
    tracks_object
  );
  
}

function get_pattern(rows) {
  //zdefiniowanie obiektu
  const pattern = {
    num_of_breaks: rows[0].length,
    main_time: 0,
    main_offset: 0,
    flag: 0,
  };
  //określenie czasu na przerwach głównych oraz pobocznych
  for (let i = 0; i < pattern.num_of_breaks; i++) {
    {
      if (rows[0][i].main === 0 && pattern.flag === 0) {
        pattern.main_offset += parseInt(rows[0][i].time);
      } else if (rows[0][i].main === 1) {
        pattern.main_time += parseInt(rows[0][i].time);
        pattern.flag = 1;
      } else if (rows[0][i].main === 0 && pattern.flag === 1) {
        break;
      }
    }
  }
  return pattern;
}

async function addToPlaylist(token, tracks_table) {
  
  const res = await fetchWebApi(
    token,
    "playlists/"+process.env.PLAYLIST_ID+"/tracks",
    "POST",
    {
      uris: tracks_table,
      position: 0,
    }
  );
  
}

export { clearPlaylist, get_pattern, addToPlaylist };
