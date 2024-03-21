import Mysql from "../helpers/database.js";
import { errorHandler } from "../helpers/errorHandler.js";

export default class Model {
  static async get_song(id) {
    const pool = Mysql.getPromiseInstance();
    const [data, err] = await errorHandler(
      pool.query,
      pool,
      "SELECT id, name, cover, artist, length, banned FROM tracks where id=?",
      id
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
    return data[0][0];
  }

  static async ban_song(id) {
    const pool = Mysql.getPromiseInstance();
    const [, banErr] = await errorHandler(
      pool.query,
      pool,
      "UPDATE tracks SET banned = 1, verified = 1 WHERE id =?",
      id
    );
    if (banErr) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: banErr });
    }
    const [, removeFromVoteableErr] = await errorHandler(
      pool.query,
      pool,
      "DELETE FROM votes where track_id = ?",
      id
    );
    if (removeFromVoteableErr) {
      throw new Error("Nie udało isę wykonać zapytania", {
        cause: removeFromVoteableErr,
      });
    }
  }
  static async unban_song(id) {
    const pool = Mysql.getPromiseInstance();
    const [, err] = await errorHandler(
      pool.query,
      pool,
      "UPDATE tracks SET banned = 0, verified = 1 WHERE id =?",
      id
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
  }

  static async verify_song(id) {
    const pool = Mysql.getPromiseInstance();
    const [data, err] = await errorHandler(
      pool.query,
      pool,
      "UPDATE tracks SET verified = 1 WHERE id =?",
      id
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
    return data;
  }

  static async getTopVerifiedSong(limit) {
    const pool = Mysql.getPromiseInstance();
    const [data, err] = await errorHandler(
      pool.query,
      pool,
      `SELECT t.id, t.name, t.cover, t.artist, t.length, t.banned, r.vote_count FROM tracks t
      LEFT JOIN ranking_archive r ON t.id = r.track_id
      WHERE t.banned = 0 AND t.verified = 1
      GROUP BY t.id
      ORDER BY r.vote_count DESC LIMIT ?;`,
      limit
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
    return data[0];
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
    const pool = Mysql.getPromiseInstance();
    const [rows, err] = await errorHandler(
      pool.query,
      pool,
      "SELECT id, name, cover, artist, length, banned, verified FROM tracks " +
        whereConstraintsJoined +
        " LIMIT ?,?",
      searchQuery
        ? [searchQuery, searchQuery, offset, amount]
        : [offset, amount]
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
    return rows[0];
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

    const pool = Mysql.getPromiseInstance();
    const [rows, err] = await errorHandler(
      pool.query,
      pool,
      "SELECT COUNT(*) as count FROM tracks" + whereConstraintsJoined,
      searchQuery ? [searchQuery, searchQuery] : []
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
    return rows[0][0]["count"];
  }

  static async changeSongStatus(id, status) {
    const pool = Mysql.getPromiseInstance();
    const [, setStatusErr] = await errorHandler(
      pool.query,
      pool,
      "UPDATE tracks SET banned=? WHERE id=?",
      [status, id]
    );
    if (setStatusErr) {
      throw new Error("Nie udało isę wykonać zapytania", {
        cause: setStatusErr,
      });
    }
    const [, deleteErr] = await errorHandler(
      pool.query,
      pool,
      "DELETE FROM votes WHERE track_id=?",
      [status, id]
    );
    if (deleteErr) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: deleteErr });
    }
    return true;
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
    const pool = Mysql.getPromiseInstance();
    const [, err] = await errorHandler(
      pool.query,
      pool,
      `
            INSERT INTO tracks (id, cover, artist , length, name, banned,verified) VALUES (?, ?, ?, ?, ?, ?,?)
            `,
      [id, cover, artist, length, name, ban, verified]
    );
    console.log("adduje");
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
  }

  static async updateTrackArchiveRanking(id, votesCount) {
    const pool = Mysql.getPromiseInstance();
    const [result, err] = await errorHandler(
      pool.query,
      pool,
      `
      INSERT INTO ranking_archive (track_id, vote_count) VALUES(?, ?) ON DUPLICATE KEY UPDATE    
      vote_count = vote_count + ?`,
      [id, votesCount, votesCount]
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
    // return result[0];
  }

  static async getTracksRanking() {
    const pool = Mysql.getPromiseInstance();
    const [result, err] = await errorHandler(
      pool.query,
      pool,
      `
        SELECT t.id, t.cover, t.name, t.artist, t.length,
        COUNT(v.id) AS votesCount
        FROM tracks t
        JOIN votes v ON t.id = v.track_id
        GROUP BY t.id
        HAVING votesCount > 0
        ORDER BY votesCount DESC;`
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
    return result[0];
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
    const pool = Mysql.getPromiseInstance();
    const [data, selectErr] = await errorHandler(
      pool.query,
      pool,
      `SELECT t.id, t.cover, t.name, t.artist, t.length,
      COUNT(v.id) AS count
FROM tracks t
JOIN votes v ON t.id = v.track_id
WHERE t.id = ?
GROUP BY t.id`,
      [id]
    );
    if (selectErr) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
    return data[0][0].count;
  }
}
