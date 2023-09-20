import Mysql from "../helpers/database.js";

export default class Model {
	pool = Mysql.getPromiseInstance()
	async getMany(){
		const [rows] = await Model.pool.query(
			`
				SELECT id, name alarm_offset, active,
				(SELECT COUNT(*) FROM breaks WHERE pattern_id=p.id) as breaks_count
				FROM patterns as p`
		);
		return rows;
	}
	async add(name, offset){
		try {
			await Model.pool.query(
				`
					INSERT INTO patterns (name, alarm_offset)
					VALUES (?, ?)`, [name, offset]
			);
		}catch(e){
			throw e;
		}
	}
}