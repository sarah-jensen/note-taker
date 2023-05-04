const express = require("express");
const fs = require("fs");
const notes = require("./db/db.json");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//HTML routes
app.get("/notes", (req, res) => {
  res.sendFile(`${__dirname}/public/notes.html`);
});

app.get("*", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

//API routes
//retrieves existing notes to be displayed
app.get("/api/notes", (req, res) => {
  fs.readFile(`${__dirname}/db/db.json`);
  if (err) {
    res.sendStatus(500);
    console.log("An error occured retrieving your note.");
  } else {
    return res.json(JSON.parse(notes));
  }
});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post("/api/notes", (req, res) => {
  //log that a request was received
  console.log("POST request received");
  //destructure items in req.body
  const { title, text } = req.body;
  try {
    if (title || (title && text)) {
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
                res.sendStatus(500)
                console.log('There was an issue saving your note');
              } else {
                  console.log('Note saved successfully');
                  res.sendStatus(200);
                }
            });
            } 
        })
    } 
} catch {
        res.sendStatus(400);
        console.log("You must include a title and text for your note.");
      };
    });


app.delete("/api/notes/:id", (req, res) => {
  if (err) {
    res.sendStatus(500);
    console.log("A problem occurred with deleting your note.");
  } else {
    fs.readFile(`${__dirname}/db/db.json`);
    notes.filter(id !== req.params.id);
    res.json(notes);
    console.log("Your note was deleted.");
  }
});

app.listen(PORT, () => {
  console.log(`Notes app listening at http://localhost:${PORT}`);
});
