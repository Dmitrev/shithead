var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var events = require('events');
var eventEmitter = new events.EventEmitter();
var path = require('path');

app.set('view engine', 'jade');
// Make assets accessible for the browser
app.use(express.static(path.join(__dirname, 'public')));

var Game = require('./game.js');
var Player = require('./player.js');
var GameManager =  new Game();

var nextUserId = 1;

function getGameData(){

    var data = {
        playerCount: GameManager.getPlayerCount(),
        players: GameManager.getPlayers()
    }

    return data;
}

// Entry point
app.get('/', function (req, res){
    // Return the page
    var data = getGameData();
    res.render('index', data);
});



io.on('connection', function(socket) {

    // What happens when the player has chosen a nickname
    socket.on('register', function(name){

        if( typeof socket.player != "undefined" )
            return false;

        // Create new player instance
        socket.player = new Player(nextUserId, name);
        // Add player to the Game
        GameManager.addPlayer(socket.player);

        console.log(socket.player);
        console.log( name + " joined the game");

        // Make sure that the next player gets a diffrent id
        nextUserId++;
        return eventEmitter.emit('registerd');
    });

    // User closed the browser
    socket.on('disconnect', function(){

        // If a guest leaves, don't do anything
        if(typeof socket.player == "undefined")
            return false;

        console.log(socket.player._nickname + ' left the game');
        GameManager.removePlayer( socket.player._id);
        return eventEmitter.emit('playerLeft');
    });

    // Let the client know that a player has left the game
    eventEmitter.on('playerLeft', function(){
        var data = getGameData();
        socket.emit('playerLeft', data);
    });

    // Let the client know that a new player joined the game
    eventEmitter.on('registerd', function(){

        var data = getGameData();
        socket.emit ('newPlayer', data);

    });

});
// Start the server
http.listen(3000, function(){
    console.log('listening on *:3000');
});


// Start the game
/*GameManager.addPlayer("Dmitri");
GameManager.addPlayer("Adam");
GameManager.start();
*/
