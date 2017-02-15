var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo/es5')(session);
var fs = require('fs');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var ObjectId = require('mongodb').ObjectID;

var db = new Db('tutor',
    new Server("localhost", 27017, {safe: true},
        {auto_reconnect: true}, {}));

db.open(function(){
    console.log("mongo db is opened!");

    db.collection('notes', function(error, notes) {
        db.notes = notes;
    });

});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/notes", function(req, res) {
    db.notes.find(req.query).toArray(function(err, items) {
        res.send(items);
    });
});

app.post("/notes", function(req, res) {
    db.notes.insert(req.body);
    res.end();
});

app.delete("/notes", function(req,res) {
    console.log(req.query.id);
    db.notes.remove({_id: ObjectId(req.query.id)}, function(err, data) {
        res.end();
    });

});

app.listen(3000);