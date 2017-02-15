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

function findNotesInOrder(query, order) {
    if (order === undefined) {
        order = 1;
    }
    return db.notes.find(query).sort({order: order});
}

function withTopNoteOrder(callback, myOrder) {
    findNotesInOrder({}, myOrder).limit(1).toArray(function(err, items) {
        var order = 0;
        if (items.length > 0) {
            order = items[0].order;
        }
        callback(order);
    });
}

function withBottomNoteOrder(callback) {
    return withTopNoteOrder(callback, -1);
}

app.get("/notes", function(req, res) {
    findNotesInOrder(req.query).toArray(function(err, items) {
        res.send(items);
    });
});

app.post("/notes", function(req, res) {
    var note = req.body;
    note.date = new Date().getTime();
    withBottomNoteOrder(function (order) {
        note.order = order + 1;
        db.notes.insert(note);
        res.end();
    });
});

app.post("/top", function(req, res) {
    var note = req.body;
    withTopNoteOrder(function (order) {
        db.notes.update({_id: ObjectId(note._id)}, {$set: {order: order - 1}});
        res.end();
    });
});

app.delete("/notes", function(req,res) {
    db.notes.remove({_id: ObjectId(req.query.id)}, function(err, data) {
        res.end();
    });

});

app.listen(3000);