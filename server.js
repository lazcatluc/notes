var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo/es5')(session);
var fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    store: new MongoStore({
        url: 'mongodb://localhost:27017/angular_session'
    }),
    secret: 'angular_tutorial',
    resave: true,
    saveUninitialized: true
}));

function readNotesFromFile() {
    return JSON.parse(fs.readFileSync("notes.json", 'utf8'));
}

function writeNotesToFile(notes) {
    fs.writeFileSync("notes.json", JSON.stringify(notes), "utf8");
}

app.get("/notes", function(req, res) {
    res.send(req.session.notes||readNotesFromFile());
});

app.post("/notes", function(req, res) {
    if (!req.session.notes) {
        req.session.notes = readNotesFromFile();
        req.session.last_note_id = -1;
        for (note in req.session.notes) {
            if (note.id > req.session.last_note_id) {
                req.session.last_note_id = note.id;
            }
        }
    }
    var note = req.body;
    note.id = ++req.session.last_note_id;
    req.session.notes.push(note);
    writeNotesToFile(req.session.notes);
    res.end();
});

app.delete("/notes", function(req,res) {
    var id = req.query.id;
    var notes = req.session.notes||[];
    var updatedNotesList = [];
    for (var i=0;i<notes.length;i++) {
        if (notes[i].id != id) {
            updatedNotesList.push(notes[i]);
        }
    }
    req.session.notes = updatedNotesList;
    writeNotesToFile(req.session.notes);
    res.end();
});

app.listen(3000);