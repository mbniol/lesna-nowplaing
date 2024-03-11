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
    return data;
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
  static async get_track_ranking(one = 0, two = 1) {
    const pool = Mysql.getPromiseInstance();
    const [result, err] = await errorHandler(
      pool.query,
      pool,
      `
        SELECT t.id, t.cover, t.name, t.artist, t.length,
               SUM(CASE WHEN DATE(v.date_added) = DATE_SUB(CURDATE(), INTERVAL ? DAY) THEN 1 ELSE 0 END) +
               ROUND(SUM(CASE WHEN DATE(v.date_added) >= DATE_SUB(CURDATE(), INTERVAL ? DAY) THEN 1 ELSE 0 END) / 2) AS count
        FROM tracks t
        JOIN votes v ON t.id = v.track_id
        GROUP BY t.id
        HAVING count > 0
        ORDER BY count DESC
        LIMIT 99;`,
      [one, two]
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
    return result[0];
  }

  static async get_tracks_to_display() {
    const pool = Mysql.getPromiseInstance();
    const [result, err] = await errorHandler(
      pool.query,
      pool,
      `
        SELECT t.id, t.cover, t.name, t.artist, t.length,
               SUM(CASE WHEN DATE(v.date_added) = DATE_SUB(CURDATE(), INTERVAL 0 DAY) THEN 1 ELSE 0 END) +
               ROUND(SUM(CASE WHEN DATE(v.date_added) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN 1 ELSE 0 END) / 2) AS count
        FROM tracks t
        JOIN votes v ON t.id = v.track_id
        GROUP BY t.id
        HAVING count > 0
        ORDER BY count DESC
        LIMIT 99;`
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
    return result[0];
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
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
  }
  static async add_vote(id, ip, visitorId) {
    const pool = Mysql.getPromiseInstance();
    const [, err] = await errorHandler(
      pool.query,
      pool,
      "INSERT INTO votes (id, track_id, date_added, ip, visitor_id) VALUES (NULL, ?, current_timestamp(), ?, ?)",
      [id, ip, visitorId]
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
  }
  static async votes_amount(id) {
    const pool = Mysql.getPromiseInstance();
    const [data, selectErr] = await errorHandler(
      pool.query,
      pool,
      `SELECT t.id, t.cover, t.name, t.artist, t.length,
      SUM(CASE WHEN DATE(v.date_added) = DATE_SUB(CURDATE(), INTERVAL 0 DAY) THEN 1 ELSE 0 END) +
      ROUND(SUM(CASE WHEN DATE(v.date_added) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN 1 ELSE 0 END) / 2) AS count
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

  static async getTracksRankingFrom(previousDay) {
    const pool = Mysql.getPromiseInstance();
    const [result, err] = await errorHandler(
      pool.query,
      pool,
      `
        SELECT t.id, t.cover, t.name, t.artist, t.length,
               SUM(CASE WHEN DATE(v.date_added) = DATE_SUB(CURDATE(), INTERVAL 0 DAY) THEN 1 ELSE 0 END) +
               ROUND(SUM(CASE WHEN DATE(v.date_added) >= DATE_SUB(?, INTERVAL 1 DAY) THEN 1 ELSE 0 END) / 2) AS count
        FROM tracks t
        JOIN votes v ON t.id = v.track_id
        GROUP BY t.id
        HAVING count > 0
        ORDER BY count DESC
        LIMIT 99;`,
      [previousDay]
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
    return result[0];
  }

  static async getTracksToDisplayFrom(previousDay) {
    const pool = Mysql.getPromiseInstance();
    const [result, err] = await errorHandler(
      pool.query,
      pool,
      `
        SELECT t.id, t.cover, t.name, t.artist, t.length,
               SUM(CASE WHEN DATE(v.date_added) = DATE_SUB(CURDATE(), INTERVAL 0 DAY) THEN 1 ELSE 0 END) +
               ROUND(SUM(CASE WHEN DATE(v.date_added) = DATE_SUB(?, INTERVAL 1 DAY) THEN 1 ELSE 0 END) / 2) AS count
        FROM tracks t
        JOIN votes v ON t.id = v.track_id
        GROUP BY t.id
        HAVING count > 0
        ORDER BY count DESC
        LIMIT 99;`,
      [previousDay]
    );
    if (err) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
    return result[0];
  }

  static async getVotesAmountFrom(id, previousDay) {
    const pool = Mysql.getPromiseInstance();
    const [data, selectErr] = await errorHandler(
      pool.query,
      pool,
      `SELECT t.id, t.cover, t.name, t.artist, t.length,
      SUM(CASE WHEN DATE(v.date_added) = DATE_SUB(CURDATE(), INTERVAL 0 DAY) THEN 1 ELSE 0 END) +
      ROUND(SUM(CASE WHEN DATE(v.date_added) = DATE_SUB(?, INTERVAL 1 DAY) THEN 1 ELSE 0 END) / 2) AS count
FROM tracks t
JOIN votes v ON t.id = v.track_id
WHERE t.id = ?
GROUP BY t.id`,
      [previousDay, id]
    );
    if (selectErr) {
      throw new Error("Nie udało isę wykonać zapytania", { cause: err });
    }
    return data[0][0].count;
  }
}
