import express, { response } from 'express';
import pg from 'pg'; 
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

const db = new pg.Client({
    user:'postgres',
    host:'localhost',
    password:'Crc5525473.',
    port:5432,
    database:'book',
});
db.connect();


var notes= [];


app.get('/', async (req, res) => {
    try{
        const response = await db.query('SELECT * FROM notes ORDER BY id');
        notes = response.rows
    }catch(err){
        console.log(err);
    }
    res.render('index.ejs',{
        data:notes
    });
});

app.get('/detail',(req, res) => {
    const foundData = notes.find(item => item.id == req.query.id);
    res.render('detail.ejs',{
        data:foundData
    })
})

app.get('/new',(req, res) => {
    res.render('new.ejs')
})

app.post('/new',async (req, res) => {
    const isbn = req.body.isbn;
    const rate = parseInt(req.body.rate);
    const published_date = new Date(req.body.published_date);
    const note = req.body.note;
    const response = await axios.get(`https://openlibrary.org/isbn/${isbn}.json`);
    const name = response.data.title;  
    db.query("INSERT INTO notes(name,published_date,rate,note,isbn) VALUES ($1,$2,$3,$4,$5)",[name,published_date,rate,note,isbn]);
    res.redirect('/');
})

app.get('/rateSort',async (req, res) => {
    // const newNotes = notes.sort((a,b) => {return b.rate-a.rate})
    const response = await db.query('SELECT * FROM notes ORDER BY rate DESC');
    const newNotes = response.rows;
    notes = newNotes;
    res.render('index.ejs',{data:notes});
})

app.get('/dateSort',async (req, res) => {
    // const newNotes = notes.sort((a,b) => {return b.published_date-a.published_date})
    const response = await db.query('SELECT * FROM notes ORDER BY published_date DESC');
    const newNotes = response.rows;
    notes = newNotes;
    res.render('index.ejs',{data:notes});
})

app.get('/edit',(req, res) => {
    const id = req.query.id;
    const foundData = notes.find(item => item.id == id)
    res.render('new.ejs',{data:foundData})
})

app.post('/update',async (req, res) => {
    const id = req.query.id;
    const isbn = req.body.isbn;
    const rate = parseInt(req.body.rate);
    const published_date = new Date(req.body.published_date);
    const note = req.body.note;
    const response = await axios.get(`https://openlibrary.org/isbn/${isbn}.json`);
    const name = response.data.title;  
    db.query("UPDATE notes SET name = $1,published_date = $2,rate = $3,note = $4,isbn = $5 WHERE id = $6",[name,published_date,rate,note,isbn,id]);
    res.redirect('/');
})

app.get('/delete',async (req, res) => {
    const id = parseInt(req.query.id);
    db.query('DELETE FROM notes WHERE id = $1',[id]);
    res.redirect('/')
})


app.listen(port, () => {
 console.log(`App running on port ${port}`)
})