import Auth from "../helpers/auth.js";
import Mysql from "../helpers/database.js";
import { fetchWebApi, new_token } from "../helpers/helpers.js";
import {sql} from "../helpers/sql_queries.js";

export async function vote(track_link) {
  sql.pool=Mysql.getPromiseInstance();
  const token = await Auth.getInstance().getAPIToken();
  //przeksztalcenie linku na track id
  const track_id = await get_id(track_link);
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
        const rows = sql.get_song(track_id)
        //piosenka została zbanowana przez admina
        if (rows[0][0]["banned"] === 1) {
          return "piosenka zostala zabanowan przez administracje";
        }
        //piosenki nie ma w bazie danych
        else if (rows[0][0]["count"] === 0) {
          sql.add_track(
            track_id,
            track["album"]["images"][0]["url"],
            track.artists[0].name,
            track["duration_ms"],
            track["name"]
          );
          sql.add_vote(track_id);
          return "dodano piosenkę i głos";
        } else {
          sql.add_vote(track_id);
          return "dodano głos";
        }
      }
    }
  } else {
    return "podany link jest nieprawidłowy";
  }
}

//sprawdzanie aktualnej listy głosów
export async function votes() {
  sql.pool=Mysql.getPromiseInstance();
  try {
    return await sql.get_track_ranking();
  } catch (error) {
    console.error("Błąd zapytania:", error);
    return false;
  }

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
export async function getSongs() {
  const pool = Mysql.getPromiseInstance();
  const [rows] = await sql.get_songs();
  return rows;
}

export async function changeSongStatus(id, status) {
  const pool = Mysql.getPromiseInstance();
  await pool.query(sql.ban_track(status,id));
  return true;
}
