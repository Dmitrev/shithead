var Deck = function( cards, eventEmitter ){
  this._cards = cards;
  this._graveYard = [];
  this._eventEmitter = eventEmitter;
}


// Shuffle the cards in the deck randomly
Deck.prototype.shuffle = function(){

  // Check if we have cards atleast
  if( this.isEmpty() )
    return false;

    var v = this._cards;
    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    this._cards = v;

}

// Check if the deck is empty
Deck.prototype.isEmpty = function(){

  if( typeof this._cards == "undefined" || this._cards.length < 1){
    return true;
  }

  return false;

}

// Take X amount of cards from the deck
Deck.prototype.take = function(amount){

  var cardsTaken = [];

  for( var i = 0; i < amount; i++ ){

   var card = this.takeOne();
    // No card return, deck must be empty
    if( card == null )
      break;

    if( !card)
      break;
    cardsTaken.push(card);
  }

  return cardsTaken;
}

Deck.prototype.takeOne = function(){

  if( this.isEmpty() ){

    return this.reshuffleCards(true);
  }


  return this._cards.pop();

}

Deck.prototype.place = function(card){

  // set clientside values to server side

  this._graveYard.push(card);
}

Deck.prototype.getLastCard = function(){
  if( this._graveYard.length == 0)
    return null;

  return this._graveYard[ this._graveYard.length-1 ];
}

Deck.prototype.reshuffleCards = function(take){
  console.log('Deck is empty, shuffling cards');

  if( this._graveYard.length < 2){
    console.log('not enough cards in graveYard');
    this._eventEmitter.emit('deckEmpty');
    return false;
  }


  // Put back all cards except the last
  for( var i = 0; i < this._graveYard.length - 1; i++){
    this._cards.push(this._graveYard[i]);
    this._graveYard.splice(i, 1);
  }

  var lastCard = null;
  if( typeof this._graveYard[0] != "undefined" ) {
    lastCard = this._graveYard[0];
  }
  console.log("lastCard: ");
  console.log(lastCard);
  this._eventEmitter.emit('reshuffle', lastCard);
  this.shuffle();

  if( this._cards.length > 0 && typeof take != "undefined") {
    return this._cards.pop();
  }
}

Deck.prototype.returnCards = function(cards){
  for( var i = 0; i < cards.length; i++){
    this._cards.unshift(cards[i]);
  }
}
module.exports = Deck;
