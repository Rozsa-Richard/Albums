import express from 'express'
import { dbAll, initializeDatabase, dbGet,dbRun } from './Util/database.js'

const app = express()
app.use(express.json())

app.get('/albums', async (req, res)=> {
    const albums = await dbAll("SELECT * FROM albums");
    res.status(200).json(albums)
})

app.get('/albums/:id', async (req, res) => {
    const id = req.params.id;
    const thatalbum = await dbGet("SELECT * FROM albums WHERE id=?;", [id])
    if (!thatalbum) {
        return res.status(400).json({message: "Album not found"})
    }
    else {
        res.status(200).json(thatalbum)
    }
})

app.post("/albums", async (req, res) => {
    const {author, name, realeseYear, style} = req.body;
    if (!author || !name || !realeseYear || !style){
        return res.status(400).json({message: "Missing some data"})
    }
    
    const result = await dbRun("INSERT INTO albums (author,name,realeseYear,style) VALUES (?, ?, ?, ?);",[author, name, realeseYear, style])
    res.status(200).json({id: result.lastID, author, name, realeseYear, style});
})

app.put("/albums/:id", async (req, res) => {
    const id = req.params.id;
    const thatalbum = dbGet("SELECT * FROM albums WHERE id = ?;",[id]);
    if (!thatalbum){
        return res.status(404).json({message:"Album not found"});
    }
    const {author, name, realeseYear, style} = req.body;
    if (!author || !name || !realeseYear || !style){
        return res.status(400).json({message:"Missing data"});
    }
    
    await dbRun("UPDATE albums SET author = ?, name = ?, realeseYear = ?, style = ? WHERE id = ?;",[author, name, realeseYear, style, id]);
    res.status(200).json({id,author,name,realeseYear,style});
})

app.delete("/albums/:id", async (req, res) => {
    const id = req.params.id;
    const thatalbum = dbGet("SELECT * FROM albums WHERE id = ?;",[id]);
    if (!thatalbum){
        return res.status(404).json({message:"Album not found"});
    }
    await dbRun("DELETE FROM albums WHERE id = ?;",[id]);
    es.status(200).json({message:"delete sucsessful"});
})

app.use((req, res, next, err) =>{
    if (err){
        res.status(500).json({message: 'Error ${err.message}'})
    }
})

async function startServer() {
    await initializeDatabase();
    app.listen(3000, ()=> {
        console.log('Server runs on port 3000')
    })
}

startServer();