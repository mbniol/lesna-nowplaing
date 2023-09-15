import mysql from 'mysql2'
import { fetchWebApi } from "../helpers/helpers.js";

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function vote(token,track_id)
{
    const track = await fetchWebApi(token, "tracks/"+track_id)
    newTruck(track_id,track['album']['images'][0]['url'],track['duration_ms'],track['name'],track['explicit'])
}

export async function newTruck(id,cover,length,name,exp){
    

    const [rows] = await pool.query(`
    SELECT count(*) as count
    FROM tracks 
    where id=?`,[id]);
    if(exp==true)
    {
        console.log('piosenka jest nieodpowiednia')
    }
    else if(rows[0]['count']==0)
    {
        await pool.query(`
        INSERT INTO tracks (id, cover, length, name, banned) VALUES (?, ?, ?, ?, ?)
        `,[id,cover,length,name,0])
        console.log("dodano piosenke")
    }
    else
    {
        console.log('piosenka isteniej')
    }



    
}