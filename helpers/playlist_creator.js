import { fetchWebApi } from "./helpers.js";
import Mysql from "./database.js";
export async function make_playlist(token) {
  // const tracks = await fetchWebApi(
  //   token,
  //   "playlists/3sCbvsgOGlqZXaLQ9X9R1U",
  //   "GET"
  // );
  // const costam = tracks.tracks.items.map((item) => ({
  //   uri: item.track.uri,
  // }));
  // const track_list = {
  //   tracks: costam,
  // };
  //
  // const test = await fetchWebApi(
  //   token,
  //   "playlists/3sCbvsgOGlqZXaLQ9X9R1U/tracks",
  //   "DELETE",
  //   track_list
  // );
  // console.log(track_list);
  // const insert={
  //   'uris':[
  //     'spotify:track:0AUyNF6iFxMNQsNx2nhtrw',
  //     'spotify:track:54ipXppHLA8U4yqpOFTUhr'
  //   ],
  //   'position': 0
  // }
  // const test_insert = await fetchWebApi(
  //     token,
  //     "playlists/3sCbvsgOGlqZXaLQ9X9R1U/tracks",
  //     "POST",
  //     insert
  // );
  // console.log(test_insert);
  //pobieranie patternu z przerwami
  const pool = Mysql.getPromiseInstance();
  const rows = await pool.query(
      `SELECT breaks.id ,round(time_to_sec(TIMEDIFF(end, start))) time, breaks.main 
      FROM breaks join patterns on patterns.id=breaks.pattern_id
      WHERE patterns.active=1
      ORDER BY breaks.start;`
  );
  //zdefiniowanie zmiennych pomocniczych
  const num_of_breaks = rows[0].length;
  let main_time = 0;
  let main_offset = 0;
  let flag=0
  //określenie czasu na przerwach głównych oraz pobocznych
  for(let i=0; i<num_of_breaks; i++){
    {
      if(rows[0][i].main === 0 && flag===0){
        main_offset+=parseInt(rows[0][i].time);
      }else if(rows[0][i].main === 1){
        console.log(parseInt(rows[0][i].time))
        main_time+=parseInt(rows[0][i].time);
        flag=1;
      }else if(rows[0][i].main === 0 && flag===1){
        break;
      }
    }
  }
  console.log("main time"+main_time);
  console.log("main offset"+main_offset);
  //wyciągnięcie czasu wszysytkich głosów
  // const tracks = await pool.query(`
  //   SELECT tracks.id, tracks.lenght/1000, count(main_votes.id)+
  //     (if(/*sprawdzenie czy wartość połowy głosów nie jest null*/
  //       (SELECT count(votes.id)/2 as count
  //       FROM votes join tracks on votes.track_id = tracks.id
  //       WHERE votes.date_added=CURRENT_DATE()-1 AND main_votes.track_id=votes.track_id
  //       group by tracks.id),/*jeżeli nie jest null zwróć liczbę głosów*/
  //       (SELECT floor(count(votes.id)/2) as count
  //       FROM votes join tracks on votes.track_id = tracks.id
  //       WHERE votes.date_added=CURRENT_DATE()-1
  //       group by tracks.id),/*jeżeli jest null zwróć 0*/
  //       0))
  //   as count
  //   FROM votes as main_votes join tracks on main_votes.track_id = tracks.id
  //   WHERE main_votes.date_added=CURRENT_DATE()
  //   group by tracks.id
  //   order by count DESC;`);
  // console.log(tracks);
  console.log(rows[0].length);
}
