var path = require('path');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var client = require('socket.io').listen(server).sockets;
var mongo = require('mongodb').MongoClient;
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
server.listen(8080);

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', routes);

mongo.connect('mongodb://localhost/chats', function (err, db) {
    if (err) throw err;
    console.log("DB connection made.");

    client.on('connection', function (socket) {
        console.log('A client connection made.');
        var collection = db.collection('chats');

        collection.find().sort({_id:1}).toArray(function(err, res){
            if(err) throw err;
            socket.emit('showmessage', res);
        });
        
        socket.on('newmessage', function (data) {
            var name = data.name;
            var message = data.message;
            var dateTime = data.dateTime;
            if (name && message && dateTime) {
                collection.insert({ name: name, message: message, dateTime: dateTime}, function () {
                    console.log("data inserted");
                });
                client.emit('showmessage', [data]);
            }
            else {
                console.log("invalid data.");
            }

        });
    });
});