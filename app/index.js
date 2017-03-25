// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('../')(server);
var port = process.env.PORT || 7778;
var mongoose = require('mongoose');
var sleep = require('sleep');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

var dbMongoName = 'demos';
var dbMongoHost = '192.168.28.248';
var dbMongoPort = 27017;

mongoose.connect('mongodb://' + dbMongoHost + ':' + dbMongoPort + '/' + dbMongoName, { server: { reconnectTries: 3, poolSize: 5 } }, function (error) {
  if (error) {
    log.info(error);
  }
});

var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;

    console.log('Un cliente se ha conectado');
    //socket.emit('new tracking data', 'messages');


var temporal = require("temporal");
var startIndex = 0;
var endIndex = 1000;
var incrementIndex = 1;
var delay = 2000;
var array = [1, 2, 3, 4, 5];
var tasks = [];


        
while ( startIndex < endIndex ) {
    tasks.push({
      delay: delay,
      task: function() {
        var actualEpoch = Date.now();
        var searchEpoch = actualEpoch - 2000;
        console.log(searchEpoch);
        // do stuff

        mongoose.connection.db.collection('TRACKING1', function (err, collection) {
          //collection.find({"pos_date": {$gt:1490341501226}}).toArray(function (err, docs) {
          collection.find({"pos_date": {$gt:searchEpoch}}).toArray(function (err, docs) {
            if (docs!=undefined) {
              for (var i=0; i<docs.length; i++) {
                 console.log("new tracking: " + docs[i].vehicle_license + " - trackingId: " + docs[i].tracking_id + " - posDate: " + docs[i].pos_date);
                 socket.emit('new tracking data', {
                    data: docs[i]
                 });
              }
            }
          });
        });

        /*socket.emit('new tracking data', {
          geojson: '[{"geometry": {"type": "Point", "coordinates": [8.3167, 40.5626]}, "type": "Feature", "properties": {"alias": "FUSI Matteo", "alarm_state": "0", "license": "092", "vehicle_state": "", "pos_date": "1455455257500", "tracking_state": "STOP", "speed": 0.1000, "heading": 116.6000}}]'
        });*/
      }
    });
  

  startIndex = startIndex + incrementIndex;


}


temporal.queue(tasks);







  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });



  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
