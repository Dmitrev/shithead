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

function checkStartGame(){

    var playerCount = GameManager.getPlayerCount();

    // You need atleast 2 players to start the game
    if( playerCount < 2){
        console.log("Not enough players to start the game");
        return false;
    }

    // Count the amount of players that are ready
    var readyPlayers = 0;
    var players =  GameManager.getPlayers();

    for( var i = 0; i < players.length; i++){
        if(players[i].isReady()) {
            readyPlayers++;
        }
    }

    // Check if all players are ready
    if( readyPlayers < playerCount){
        console.log("Waiting for all players to ready");
        return false;
    }

    // Yeah start the game! Let's go Whoo!
    GameManager.start();
    io.sockets.emit('startGame');

}

// Entry point
app.get('/', function (req, res){
    // Return the page
    var data = getGameData();
    res.render('index', data);
});



io.on('connection', function(socket) {

    // New player connects to server
    if( !GameManager.isStarted() ){
        // If game isn't started prompt the user to choose a nickname
        socket.emit('chooseNickname');
    }
    else{
        // Let the user know that the game already started
        socket.emit('lateJoin');
    }


    // What happens when the player has chosen a nickname
    socket.on('register', function(name){

        if( typeof socket.player != "undefined" || GameManager.isStarted() )
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

    socket.on('ready', function(){
        // If a guest leaves, don't do anything
        if(typeof socket.player == "undefined")
            return false;

        if( !socket.player.isReady()) {
            socket.player.ready();
        }
        var data = getGameData();
        io.sockets.emit('playerReady', data);

        checkStartGame();
    });


    socket.on('unready', function(){
        // If a guest leaves, don't do anything
        if(typeof socket.player == "undefined")
            return false;

        if( socket.player.isReady()) {
            socket.player.unReady();
        }

        var data = getGameData();
        io.sockets.emit('playerUnReady', data);
    });


});

// Let the client know that a player has left the game
function playerLeftHandler(){
    var data = getGameData();
    //eventEmitter.removeListener('playerLeft', playerLeftHandler);
    io.sockets.emit('playerLeft', data);
}

eventEmitter.on('playerLeft', playerLeftHandler);

// Let the client know that a new player joined the game
eventEmitter.on('registerd', function(){

    var data = getGameData();
    io.sockets.emit ('newPlayer', data);

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
