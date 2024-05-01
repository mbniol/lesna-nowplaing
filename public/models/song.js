import Mysql from "../helpers/database.js";

export default class Model {
  // await songModel.add_track(
  //   trackID,
  //   track["album"]["images"][0]["url"],
  //   track.artists[0].name,
  //   track["duration_ms"],
  //   track["name"],
  //   1,
  //   1
  // );
  static async get_song(id) {
    const songs = await Mysql.handleRequest(
      `
      SELECT id, name, cover, artist, length, banned FROM tracks where id=?`,
      [id]
    );
    return songs[0];
  }

  static async ban_song(id) {
    await Mysql.handleRequest(
      "UPDATE tracks SET banned = 1, verified = 1 WHERE id =?",
      id
    );
    await Mysql.handleRequest("DELETE FROM votes where track_id = ?", id);
  }
  static async unban_song(id) {
    await Mysql.handleRequest(
      "UPDATE tracks SET banned = 0, verified = 1 WHERE id =?",
      id
    );
  }

  static async verify_song(id) {
    await Mysql.handleRequest("UPDATE tracks SET verified = 1 WHERE id =?", id);
  }

  static async getTopVerifiedSong(limit) {
    const songs = await Mysql.handleRequest(
      `SELECT t.id, t.name, t.cover, t.artist, t.length, t.banned, r.vote_count FROM tracks t
    LEFT JOIN ranking_archive r ON t.id = r.track_id
    WHERE t.banned = 0 AND t.verified = 1
    GROUP BY t.id
    ORDER BY r.vote_count DESC LIMIT ?;`,
      limit
    );
    return songs;
  }

  static async getSongs(selectionLimiter, searchQuery, offset, amount) {
    const whereConstraints = [];
    if (selectionLimiter.banned !== undefined) {
      whereConstraints.push(
        selectionLimiter.banned ? "banned = 1" : "banned = 0"
      );
    }
    if (selectionLimiter.verified !== undefined) {
      whereConstraints.push(
        selectionLimiter.verified ? "verified = 1" : "verified = 0"
      );
    }
    if (searchQuery) {
      whereConstraints.push(
        "(MATCH(name) AGAINST(? IN BOOLEAN MODE) OR MATCH(artist) AGAINST(? IN BOOLEAN MODE))"
      );
    }
    const whereConstraintsJoined =
      whereConstraints.length > 0
        ? " where " + whereConstraints.join(" AND ")
        : "";
    const songs = await Mysql.handleRequest(
      "SELECT id, name, cover, artist, length, banned, verified FROM tracks " +
        whereConstraintsJoined +
        " LIMIT ?,?",
      searchQuery
        ? [searchQuery, searchQuery, offset, amount]
        : [offset, amount]
    );
    return songs;
  }

  static async countSongs(selectionLimiter, searchQuery) {
    const whereConstraints = [];
    if (selectionLimiter.banned !== undefined) {
      whereConstraints.push(
        selectionLimiter.banned ? "banned = 1" : "banned = 0"
      );
    }
    if (selectionLimiter.verified !== undefined) {
      whereConstraints.push(
        selectionLimiter.verified ? "verified = 1" : "verified = 0"
      );
    }
    if (searchQuery) {
      whereConstraints.push(
        "(MATCH(name) AGAINST(? IN BOOLEAN MODE) OR MATCH(artist) AGAINST(? IN BOOLEAN MODE))"
      );
    }
    const whereConstraintsJoined =
      whereConstraints.length > 0
        ? " where " + whereConstraints.join(" AND ")
        : "";

    const songsCountArray = await Mysql.handleRequest(
      "SELECT COUNT(*) as count FROM tracks" + whereConstraintsJoined,
      searchQuery ? [searchQuery, searchQuery] : []
    );
    const songsCount = songsCountArray[0]["count"];
    return songsCount;
  }

  static async updateTrackArchiveRanking(id, votesCount) {
    await Mysql.handleRequest(
      `
      INSERT INTO ranking_archive (track_id, vote_count) VALUES(?, ?) ON DUPLICATE KEY UPDATE    
      vote_count = vote_count + ?`,
      [id, votesCount, votesCount]
    );
  }

  static async add_track(
    id,
    cover,
    artist,
    length,
    name,
    ban = 0,
    verified = 0
  ) {
    await Mysql.handleRequest(
      `
            INSERT INTO tracks (id, cover, artist , length, name, banned,verified) VALUES (?, ?, ?, ?, ?, ?,?)
            `,
      [id, cover, artist, length, name, ban, verified]
    );
  }

  static async getTracksRanking() {
    const songs = await Mysql.handleRequest(
      `
      SELECT t.id, t.cover, t.name, t.artist, t.length, COUNT(v.id) as votesCount
        FROM tracks t
        JOIN votes v ON t.id = v.track_id
        WHERE t.banned != 1
        GROUP BY t.id
        HAVING votesCount > 0
        ORDER BY votesCount DESC
        LIMIT 99;`
    );
    return songs;
  }

  // static async halfTodaysVotes(){
  //   const pool = Mysql.getPromiseInstance();
  //   const [data, selectErr] = await errorHandler(
  //     pool.query,
  //     pool,
  //     `SELECT id, track_id, COUNT(*) FROM votes GROUP BY`
  //   )
  //   if (selectErr) {
  //     throw new Error("Nie udało isę wykonać zapytania", { cause: err });
  //   }
  //   return data[0][0].count / 2;
  // }

  static async getVotesFor(id) {
    const votesCountForSongs = await Mysql.handleRequest(
      `
      SELECT t.id, t.cover, t.name, t.artist, t.length,
      COUNT(v.id) AS count
FROM tracks t
JOIN votes v ON t.id = v.track_id
WHERE t.id = ?
GROUP BY t.id`,
      [id]
    );
    return votesCountForSongs[0].count;
  }
}
