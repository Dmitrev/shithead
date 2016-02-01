var suits = require('./enum/suit.js');
var Card = require('./card.js');

var DeckBuilder = function() {

  // Amount of players
  this._playerCount = -1;

  // Cards per suit (hearts, diamonds, clubs, spades)
  this._cardsPerSuit = 13;

  // The amount of players that can play with 1 deck
  // If got more than 5 players we need 2 decks
  this._playersPerDeck = 4;

}

// Set the player amount
DeckBuilder.prototype.setPlayerCount = function(playerCount){

  if( typeof playerCount != "number")
    return false;

  this._playerCount = playerCount;
}


// Return the player count
DeckBuilder.prototype.getPlayerCount = function(){
  return this._playerCount;
}

DeckBuilder.prototype.suitExists = function(s){
    for (var suit in suits) {
        if( s == suit){
            return true;
        }
    }

    return false;
}

// Build the Deck of cards
DeckBuilder.prototype.build = function() {

  var cards = [];
  var playerCount = this.getPlayerCount();
  var amountOfDecks = Math.ceil( playerCount / this._playersPerDeck );

  // Loop the amount of decks that we need to create
  for( var i = 0; i < amountOfDecks; i++ ){

    // We need to create 13 cards per suit (diamonds, spades, etc..)
    for (var suit in suits) {

      // Check is important, because the object has also prototype properties
      if (suits.hasOwnProperty(suit)) {

          for( var j = 1; j <= this._cardsPerSuit; j++ ){
              var value = j;
              var card = new Card(value, suit);
              cards.push(card);
          }

      }
    }
  }

    // Add 2 jokers
    cards.push( new Card(0) );
    cards.push( new Card(0) );
  return cards;
};

module.exports = DeckBuilder;
