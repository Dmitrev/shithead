var DeckBuilder = require('./deckBuilder.js');
var Deck = require('./deck.js');


var Game = function() {

  // The amount of cards that the dealer gives each player at the start
  this._initialCardCount = 7;

  // The current game state
  this._started = false;

  this._players = [];
  this._deck = null;
  this._deckBuilder = new DeckBuilder();
}

Game.prototype.addPlayer = function(player){
    this._players.push(player);
}

Game.prototype.start = function() {
  this.createDeck();
  this.dealCards();
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



module.exports = Game;
