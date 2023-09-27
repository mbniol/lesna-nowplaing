import Mysql from "../helpers/database.js";
import { fetchWebApi, new_token } from "../helpers/helpers.js";

export async function vote(track_link) {
  const token = await new_token();
  //przeksztalcenie linku na track id
  const track_id = await get_id(track_link);
  if (track_id) {
    const track = await fetchWebApi(token, "tracks/" + track_id);
    if (track["error"] != undefined) {
      return "wystapil blad przy odczycie piosenki";
    } else {
      console.log("cos");
      //piosenka jest niecenzuralna
      if (track["explicit"] == true) {
        return "piosenka jest nieodpowiednia";
      } else {
        //pobranie danych o piosence z bazy
        const rows = await Mysql.executeQuery(
          `SELECT count(*) as count, banned FROM tracks where id=?`,
          [track_id]
        );
        //piosenka została zbanowana przez admina
        if (rows[0]["banned"] == 1) {
          return "piosenka zostala zabanowan przez administracje";
        }
        //piosenki nie ma w bazie danych
        else if (rows[0]["count"] == 0) {
          newTruck(
            Mysql,
            track_id,
            track["album"]["images"][0]["url"],
            track["duration_ms"],
            track["name"]
          );
          addVote(Mysql, track_id);
          return "dodano piosenkę i głos";
        } else {
          addVote(Mysql, track_id);
          return "dodano głos";
        }
      }
    }
  } else {
    return "podany link jest nieprawidłowy";
  }
}
//dodanie nowej piosenki do bazy danych
export async function newTruck(Mysql, id, cover, length, name) {
  await Mysql.executeQuery(
    `
    INSERT INTO tracks (id, cover, length, name, banned) VALUES (?, ?, ?, ?, ?)
    `,
    [id, cover, length, name, 0]
  );
}
//dodanie głosu na pisonekę z aktualną datą
export async function addVote(Mysql, id) {
  await Mysql.executeQuery(
    `
    INSERT INTO votes (id, track_id, date_added) VALUES (NULL, ?, current_timestamp())
    `,
    [id]
  );
}
//sprawdzanie aktualnej listy głosów
export async function votes(Mysql) {
  //zapytanie co wyciąga sume głosów z danego dnia i połowę glosów z dnia poprzedniego
  try {
    const result = await Mysql.executeQuery(`
    SELECT tracks.id, tracks.cover, tracks.name, count(main_votes.id)+
      (if(/*sprawdzenie czy wartość połowy głosów nie jest null*/
        (SELECT count(votes.id)/2 as count
        FROM votes join tracks on votes.track_id = tracks.id 
        WHERE votes.date_added=CURRENT_DATE()-1 AND main_votes.track_id=votes.track_id
        group by tracks.id),/*jeżeli nie jest null zwróć liczbę głosów*/
        (SELECT floor(count(votes.id)/2) as count
        FROM votes join tracks on votes.track_id = tracks.id 
        WHERE votes.date_added=CURRENT_DATE()-1
        group by tracks.id),/*jeżeli jest null zwróć 0*/
        0)) 
    as count
    FROM votes as main_votes join tracks on main_votes.track_id = tracks.id
    WHERE main_votes.date_added=CURRENT_DATE()
    group by tracks.id
    order by count DESC;`);
    //console.log(result);
    return result;
  } catch (error) {
    console.error("Błąd zapytania:", error);
    return false;
  }

  /*   //wypisanie listy głosów
  rows.forEach((element) => {
    console.log(element["name"] + " " + element["count"]);
  }); */
}
async function get_id(value) {
  //sprawdzenie czy podany ciąg jest id poprzez weryfikacje długości oraz czy zawiera spacje
  if (value.indexOf(" ") == -1 && value.length == 22) {
    return value;
  } else {
    //dzielenie ciągu na tablice
    let string = value.split("/");
    //weryfikacja czy link jest prawidłowy
    if (string[3] == "track" && string[4].length == 22) {
      return string["4"];
    }
    //dany ciąg nie pasuje do kryteriów przez co prawdopodobnie jest to tytuł
    else {
      return false;
    }
  }
}
