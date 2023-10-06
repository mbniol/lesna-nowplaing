import { fetchWebApi } from "./helpers.js";
export async function make_playlist(token) {
  const tracks = await fetchWebApi(
    token,
    "playlists/3sCbvsgOGlqZXaLQ9X9R1U",
    "GET"
  );
  const costam = tracks.tracks.items.map((item) => ({
    uri: item.track.uri,
  }));
  const track_list = {
    tracks: costam,
  };

  const test = await fetchWebApi(
    token,
    "playlists/3sCbvsgOGlqZXaLQ9X9R1U/tracks",
    "DELETE",
    track_list
  );
  console.log(track_list);
  const insert={
    'uris':[
      'spotify:track:0AUyNF6iFxMNQsNx2nhtrw',
      'spotify:track:54ipXppHLA8U4yqpOFTUhr'
    ],
    'position': 0
  }
  const test_insert = await fetchWebApi(
      token,
      "playlists/3sCbvsgOGlqZXaLQ9X9R1U/tracks",
      "POST",
      insert
  );
  console.log(test_insert);

}
