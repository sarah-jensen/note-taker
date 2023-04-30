const express = require('express');
const fs = require('fs');
const path = require('path');
const notes = require('./db/db.json');
const {v4: uuidv4 } = require('uuid');

const PORT = 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));


//HTML routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 
    'notes.html'));
    });

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//API routes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'develop', 'db', 'db.json'));
        if (err) {
            res.sendStatus(500);
            console.log('An error occured retrieving your note.')
        } else {
            return res.json(JSON.parse(notes));
    };
});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (!title || !text) {
        res.sendStatus(400);
        console.log('You must include a title and text for your note.');
    } else if (err) {
        res.sendStatus(500);
        console.log('An error occured posting your note.');
    } else {          
        fs.readFile(path.join('db', 'db.json'));
                const newNote = {
                    id: uuidv4(),
                    title,
                    text,           
                };
            notes.push(newNote);
            res.json(notes);    
            console.log('Your note was added!');
            };
        });


app.delete('/api/notes/:id', (req, res) => {
    if (err) {
        res.sendStatus(500);
        console.log('A problem occurred with deleting your note.');
    } else {
    fs.readFile(path.join(__dirname, 'develop', 'db', 'db.json'));
    notes.filter(id !== req.params.id);
    res.json(notes);
    console.log('Your note was deleted.')
};
});

app.listen(PORT, () => {
    console.log(`Notes app listening at http://localhost:${PORT}`);
  });