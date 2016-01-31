var DeckBuilder = require('./deckBuilder.js');
var Deck = require('./deck.js');


var Game = function(eventEmitter) {
  this._eventEmitter = eventEmitter;
  // The amount of cards that the dealer gives each player at the start
  this._initialCardCount = 7;

  // The current game state
  this._started = false;
  this._players = [];
  this._deck = null;
  this._deckBuilder = new DeckBuilder();
  this._currentTurn = null;
}

Game.prototype.addPlayer = function(player){
    this._players.push(player);
}

Game.prototype.start = function() {
    console.log("Game has been started");
    this._started = true;
    this.createDeck();
    // Wait for all players to be ready
    this._eventEmitter.emit('waitForPlayers');

};

// Create new Deck
Game.prototype.createDeck = function() {

    this._deckBuilder.setPlayerCount(this._players.length);
    var cards = this._deckBuilder.build();

    this._deck = new Deck(cards);

    this.shuffleCards();
    this.dealCards();

}

Game.prototype.shuffleCards = function(){
    this._deck.shuffle();
}

// Deal cards to all players
Game.prototype.dealCards = function(){
    for( var i = 0; i < this._initialCardCount; i++ ){
        for( var j = 0; j < this._players.length; j ++ ){
            var card = this._deck.take(1);
           this._players[j].give(card);
        }
    }

    //return this._eventEmitter.emit('dealCards');
}

Game.prototype.removePlayer = function(playerId){
    for( var i = 0; i < this._players.length; i++){

        if( this._players[i].getId() == playerId ){
            this._players.splice(i, 1);
        }

    }
}
Game.prototype.getPlayerCount = function(){
    return this._players.length;
}

Game.prototype.getPlayers = function(){
    return this._players;
}

Game.prototype.isStarted = function(){
    return this._started;
}

Game.prototype.nextTurn = function(){

    var next = null;
    if( this._currentTurn == null){
        next = 0;
    }
    else{

        next = ++this._currentTurn;
        if( typeof this._players[next] == "undefined"){
            next = 0;
        }

    }

    if( typeof this._players[next] == "undefined"){
        return false;
    }

    this._eventEmitter.emit('nextTurn', this._players[next]);
    return true;
}

Game.prototype.kickPlayerByIndex = function(index){
    if( typeof this._players[index] == "undefined")
        return false;
    this._players.splice(index, 1);
    console.log()
}

Game.prototype.stop = function(){
    this._started = false;
}

// Give the first turn to a random player
Game.prototype.firstTurn = function(){
    var randomPlayer = this._players[Math.floor(Math.random()*this._players.length)];

    this._eventEmitter.emit('nextTurn', randomPlayer);
}


module.exports = Game;
