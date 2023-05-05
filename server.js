const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//API routes
//retrieves existing notes to be displayed
app.get("/api/notes", (req, res) => {
  fs.readFile('./db/db.json', (err, notes) => {
    if (err) {
      res.sendStatus(500);
      console.log(err);
    } else {
      res.json(JSON.parse(notes));
      console.log("Check and check!");
    }
  });
});

//HTML routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});



// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post("/api/notes", (req, res) => {
  //log that a request was received
  console.log("POST request received");
  //destructure items in req.body
  const { title, text } = req.body;

  fs.readFile(`${__dirname}/db/db.json`, (err, notesData) => {
    if (err) {
      res.sendStatus(500);
      console.log("Unable to retrieve notes");
    } else {
      const newNote = {
        id: uuidv4(),
        title,
        text,
      };
      console.log(newNote);
      const notes = JSON.parse(notesData);
      notes.push(newNote);
      
    fs.writeFile(`${__dirname}/db/db.json`, JSON.stringify(notes), (err) => {
        if (err) {
          res.sendStatus(500);
          console.log("There was an issue saving your note");
        } else {
          console.log("Note saved successfully");
          res.sendStatus(200);
        }
      });
    }
  });
});

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile(path.join(__dirname, '/db/db.json'), (err, notesData) => {
    if (err) {
      res.sendStatus(500);
      console.log("A problem occurred with deleting your note.");
    } else {
      const notes = JSON.parse(notesData).filter(notesData => notesData.id !== req.params.id);
      console.log("Your note was deleted.");
      fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), (err) => {
        if (err) {
          res.sendStatus(500);
          console.log("There was an issue deleting your note");
        } else {
          console.log("Note deleted successfully");
          res.sendStatus(200);
        }
      });
    }
  });
});

app.get("*", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(PORT, () => {
  console.log(`Notes app listening at http://localhost:${PORT}`);
});
