import Mysql from "../helpers/database.js";
import { fetchWebApi } from "../helpers/helpers.js";

const pool = Mysql.getPromiseInstance();

export async function vote(token, track_id) {
  const track = await fetchWebApi(token, "tracks/" + track_id);
  //piosenka jest niecenzuralna
  if (track["explicit"] == true) {
    return "piosenka jest nieodpowiednia";
  } else {
    //pobranie danych o piosence z bazy
    const [rows] = await pool.query(
      `
        SELECT count(*) as count, banned
        FROM tracks 
        where id=?`,
      [track_id]
    );
    //piosenka została zbanowana przez admina
    if (rows[0]["banned"] == 1) {
      return "piosenka zostala zabanowan przez administracje";
    }
    //piosenki nie ma w bazie danych
    else if (rows[0]["count"] == 0) {
      newTruck(
        track_id,
        track["album"]["images"][0]["url"],
        track["duration_ms"],
        track["name"]
      );
      addVote(track_id);
      return "dodano piosenkę i głos";
    } else {
      addVote(track_id);
      return "dodano głos";
    }
  }
}
//dodanie nowej piosenki do bazy danych
export async function newTruck(id, cover, length, name) {
  await pool.query(
    `
    INSERT INTO tracks (id, cover, length, name, banned) VALUES (?, ?, ?, ?, ?)
    `,
    [id, cover, length, name, 0]
  );
}
//dodanie głosu na pisonekę z aktualną datą
export async function addVote(id) {
  await pool.query(
    `
    INSERT INTO votes (id, track_id, date_added) VALUES (NULL, ?, current_timestamp())
    `,
    [id]
  );
}
//sprawdzanie aktualnej listy głosów
// export async function votes() {
//   //zapytanie co wyciąga sume głosów z danego dnia i połowę glosów z dnia poprzedniego
//   const [rows] = await pool.query(`
//     SELECT tracks.name, count(main_votes.id)+
// 	(if(/*sprawdzenie czy wartość połowy głosów nie jest null*/
//         (SELECT count(votes.id)/2 as count
//         FROM votes join tracks on votes.track_id = tracks.id 
//         WHERE votes.date_added=CURRENT_DATE()-1 AND main_votes.track_id=votes.track_id
//         group by tracks.id),/*jeżeli nie jest null zwróć liczbę głosów*/
//         (SELECT floor(count(votes.id)/2) as count
//         FROM votes join tracks on votes.track_id = tracks.id 
//         WHERE votes.date_added=CURRENT_DATE()-1
//         group by tracks.id),/*jeżeli jest null zwróć 0*/
//         0)) 
//     as count
//     FROM votes as main_votes join tracks on main_votes.track_id = tracks.id
//     WHERE main_votes.date_added=CURRENT_DATE()
//     group by tracks.id
//     order by count DESC;`);
//   //wypisanie listy głosów
//   rows.forEach((element) => {
//     console.log(element["name"] + " " + element["count"]);
//   });
// }
