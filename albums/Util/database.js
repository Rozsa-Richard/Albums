import sqlite from 'sqlite3'
const db = new sqlite.Database('./data/database.sqlite')

export function dbAll(sql, params = []){
    return new Promise((resolve,reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

export function dbGet(sql, params=[]){
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) =>{
            if (err) reject(err);
            else resolve(row);
        });
    });
}

export function dbRun(sql, params = []){
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err){
            if (err) reject(err);
            else resolve(this);
        });
    });
}

export async function initializeDatabase(){
    await dbRun("DROP TABLE IF EXISTS albums");
    await dbRun("CREATE TABLE IF NOT EXISTS albums (id INTEGER PRIMARY KEY AUTOINCREMENT, author STRING, name STRING, realeseYear INTEGER, style STRING)");

    const albums = [
        {author: "Krúbi", name: "Nehézlábérzés", realeseYear: 2018, style:"Rap, Trap"},
        {author: "Krúbi", name: "III. Krúbi", realeseYear: 2023, style:"Rap, Trap"},
        {author: "Krúbi", name: "Ösztönlény", realeseYear: 2020, style:"Rap, Trap"},
    ]
    for (const i of albums){
        await dbRun("INSERT INTO albums (author,name,realeseYear,style) VALUES (?, ?, ?, ?);",[i.author, i.name, i.realeseYear, i.style])
    }
}