import Mysql from "./database.js";

export const sql = {
    pool:undefined,
    //pobranie listy piosenek
    get_songs:function(){
        return this.pool.query("SELECT id, name, cover, artist, length, banned FROM tracks");
    },
    //pobranie danych o konkretnej pisence
    get_song:function(id){
        return this.pool.query("SELECT id, name, cover, artist, length, banned FROM tracks where id=?",id);
    },
    //banowanie piosenki
    ban_track: function(status,id) {
        return "UPDATE tracks SET banned=" + status + " WHERE id=" + id;
    },
    //dodanie glosu
    add_vote: function (id){
        this.pool.query("INSERT INTO votes (id, track_id, date_added) VALUES (NULL, ?, current_timestamp())",[id]);
    },
    //zwracanie listy głosów pod wyświetlanie
    get_track_ranking: async function(one=0,two=1){
        const result = await this.pool.query(`
        SELECT tracks.id, tracks.cover, tracks.name, tracks.artist, count(main_votes.id)+
          (if(/*sprawdzenie czy wartość połowy głosów nie jest null*/
            (SELECT count(votes.id)/2 as count
            FROM votes join tracks on votes.track_id = tracks.id 
            WHERE votes.date_added=CURRENT_DATE()-? AND main_votes.track_id=votes.track_id
            group by tracks.id),/*jeżeli nie jest null zwróć liczbę głosów*/
            (SELECT floor(count(votes.id)/2) as count
            FROM votes join tracks on votes.track_id = tracks.id 
            WHERE votes.date_added=CURRENT_DATE()-1
            group by tracks.id),/*jeżeli jest null zwróć 0*/
            0)) 
        as count
        FROM votes as main_votes join tracks on main_votes.track_id = tracks.id
        WHERE main_votes.date_added>=CURRENT_DATE()-?
        group by tracks.id
        order by count DESC;`,[two,one]);
        return result[0];
    },
    //dodawnie piosenek do bazy
    add_track: function(id, cover, artist, length, name){
        this.pool.query(`
            INSERT INTO tracks (id, cover, artist , length, name, banned) VALUES (?, ?, ?, ?, ?, ?)
            `,
            [id, cover, artist, length, name, 0]);
    }

};