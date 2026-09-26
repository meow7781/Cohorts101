const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());

const notes = [];

// POST: create a new note
app.post("/notes", function (req, res) {
  const note = req.body.note;
  notes.push(note);

  res.json({
    message: "Done!",
  });
});

// GET: all notes
app.get("/notes", function (req, res) {
  res.json({
    notes,
  });
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "notes.html"));
});

app.listen(3001);
 