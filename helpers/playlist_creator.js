import { fetchWebApi } from "./helpers.js";
import Mysql from "./database.js";
import {sql} from "./sql_queries.js";
export async function make_playlist(token) {
  await clear_playlist(token);
  sql.pool = Mysql.getPromiseInstance();
  //pobieranie patternu z przerwami
  const pattern = await get_pattern(await sql.get_pattern());

  //wyciągnięcie odpowiedniej ilości piosenek z bazy aby zapewnić odpowiedni czas
  let time;
  let tracks_votes;
  let i=0;
  do {
    tracks_votes = await sql.get_track_ranking(1,i);
    time=0;
    tracks_votes.forEach(track=>time+=track['length']/1000);
    i++;
  }while(pattern.main_offset>time);

  //odwrócona tablica glosów
  if(time<pattern.main_time+pattern.main_offset) {
    let track_list=tracks_votes.reverse();
    const tracks_uris = await track_list.map(track=>"spotify:track:"+track["id"]);
    await addToPlaylist(token,tracks_uris);
  }else if(time>=pattern.main_time+pattern.main_offset){
    let index=0;
    let time=0;
    let main_uris= [];
    let offset_uris= [];
    //stworzenie tablicy z piosenek o największej ilości głosów
    do {
      time+=tracks_votes[index]['length']/1000;
      main_uris.push("spotify:track:"+tracks_votes[index]['id']);
      index++;
    }while(time<=pattern.main_time);
    time=0;
    //stworzenie tablicy z piosenek na czas między pierwszą przerwą a głównymi przerwami
    do {
      time+=tracks_votes[index]['length']/1000;
      offset_uris.push("spotify:track:"+tracks_votes[index]['id']);
      index++;
    }while(time<=pattern.main_offset);
    //połączenie 2 tablic
    let uris=offset_uris.concat(main_uris);
    //dodanie reszty piosenek na koniec listy
    for(;index<tracks_votes.length;index++){
      uris.push("spotify:track:"+tracks_votes[index]['id']);
    }
    await addToPlaylist(token,uris);
  }
}

async function addToPlaylist(token, tracks_table){
  await fetchWebApi(
      token,
      "playlists/3sCbvsgOGlqZXaLQ9X9R1U/tracks",
      "POST",
      {
        'uris':
        tracks_table
        ,
        'position': 0
      }
  );
}
async function clear_playlist(token){
  //pobranie aktualnej zawartości plalisty
  const current_playlist_tracks = await fetchWebApi(
      token,
      "playlists/3sCbvsgOGlqZXaLQ9X9R1U",
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
  await fetchWebApi(
    token,
    "playlists/3sCbvsgOGlqZXaLQ9X9R1U/tracks",
    "DELETE",
    tracks_object
  );
}
async function get_pattern(rows){
  //zdefiniowanie obiektu
  const pattern= {
    num_of_breaks: rows[0].length,
    main_time: 0,
    main_offset: 0,
    flag: 0
  }
  //określenie czasu na przerwach głównych oraz pobocznych
  for(let i=0; i<pattern.num_of_breaks; i++){
    {
      if(rows[0][i].main === 0 && pattern.flag===0){
        pattern.main_offset+=parseInt(rows[0][i].time);
      }else if(rows[0][i].main === 1){
        pattern.main_time+=parseInt(rows[0][i].time);
        pattern.flag=1;
      }else if(rows[0][i].main === 0 && pattern.flag===1){
        break;
      }
    }
  }
  return(pattern);
}
