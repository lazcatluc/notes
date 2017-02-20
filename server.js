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

    db.collection('sections', function(error, sections) {
        db.sections = sections;
    });

    db.collection('users', function(error, users) {
        db.users = users;
    });

});

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

app.get("/sections", function(req,res) {
    db.sections.find(req.query).toArray(function(err, items) {
        res.send(items);
    });
});

app.post("/sections/replace", function(req,resp) {
    // do not clear the list
    if (req.body.length==0) {
        resp.end();
    }
    db.sections.remove({}, function(err, res) {
        if (err) console.log(err);
        db.sections.insert(req.body, function(err, res) {
            if (err) console.log("err after insert",err);
            resp.end();
        });
    });
});

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

app.get("/users", function(req,res) {
    db.users.find({username: req.query.username}).limit(1).toArray(function(err, items) {
        if (items.length === 0) {
            return res.status(404).send({error: 'User "' + req.query.username + '" not found'});
        }
        res.send(items[0]);
    });
});

app.post("/users", function(req,res) {
    var user = req.body;
    db.users.find({username: user.username}).limit(1).toArray(function(err, items) {
        if (items.length > 0) {
            res.status(409).send({error: 'User "' + user.username + '" already exists'});
        }
        else {
            db.users.insert(user, function(resp) {
                req.session.user = user;
                res.end();
            });
        }
    });
});

app.get("/users/current", function(req,res) {
    var user = req.session.user;
    if (user) {
        res.send(user);
    }
    else {
        res.status(404).send({error: 'Not logged in'});
    }
});

app.post("/users/current", function(req,res) {
    var user = req.body;
    db.users.find(user).limit(1).toArray(function(err, items) {
        if (items.length === 0) {
            res.status(403).send({error: 'Invalid username or password'});
        }
        req.session.user = items[0];
        res.send(items[0]);
    });
});

app.delete("/users/current", function(req,res) {
    req.session.user = undefined;
    res.end();
});

app.listen(3000);