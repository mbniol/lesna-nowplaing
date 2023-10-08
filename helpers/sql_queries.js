import Mysql from "./database.js";

export const sql = {
    pool:undefined,
    //pobranie listy piosenek
    get_songs: async function(){
        return await this.pool.query("SELECT id, name, cover, artist, length, banned FROM tracks");
    },
    //pobranie danych o konkretnej pisence
    get_song: async function(id){
        return await this.pool.query("SELECT id, name, cover, artist, length, banned FROM tracks where id=?",id);
    },
    //banowanie piosenki
    ban_track: function(status,id) {
        this.pool.query("UPDATE tracks SET banned=? WHERE id=?",[status,id]);
    },
    //dodanie glosu
    add_vote: function (id){
        this.pool.query("INSERT INTO votes (id, track_id, date_added) VALUES (NULL, ?, current_timestamp())",[id]);
    },
    //zwracanie listy głosów pod wyświetlanie
    get_track_ranking: async function(one=0,two=1){
        const result = await this.pool.query(`
        SELECT t.id, t.cover, t.name, t.artist, t.length,
               SUM(CASE WHEN DATE(v.date_added) = DATE_SUB(CURDATE(), INTERVAL ? DAY) THEN 1 ELSE 0 END) +
               ROUND(SUM(CASE WHEN DATE(v.date_added) = DATE_SUB(CURDATE(), INTERVAL ? DAY) THEN 1 ELSE 0 END) / 2) AS count
        FROM tracks t
        JOIN votes v ON t.id = v.track_id
        GROUP BY t.name
        HAVING count > 0
        ORDER BY count DESC
        LIMIT 99;`,[one,two]);
        return result[0];
    },
    //dodawnie piosenek do bazy
    add_track: function(id, cover, artist, length, name){
        this.pool.query(`
            INSERT INTO tracks (id, cover, artist , length, name, banned) VALUES (?, ?, ?, ?, ?, ?)
            `,
            [id, cover, artist, length, name, 0]);
    },
    //pobranie patternu z przerwami
    get_pattern: async function(){
        return await this.pool.query(
        `SELECT breaks.id ,round(time_to_sec(TIMEDIFF(end, start))) time, breaks.for_requested as main 
          FROM breaks join patterns on patterns.id=breaks.pattern_id
          WHERE patterns.active=1
          ORDER BY breaks.start;`
        );
    }

};