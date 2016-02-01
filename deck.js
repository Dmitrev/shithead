var Deck = function( cards ){
  this._cards = cards;
  this._graveYard = [];
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

    return this.reshuffleCards();
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

Deck.prototype.reshuffleCards = function(){
  console.log('Deck is empty, shuffling cards');

  if( this._graveYard.length == 0){
    console.log('no cards in graveYard');
    return false;
  }

  for( var i = 0; i < this._graveYard.length; i++){
    this._cards.push(this._graveYard[i]);
  }
  this._graveYard = [];

  this.shuffle();

  if( this._cards.length > 0) {
    return this._cards.pop();
  }
}

module.exports = Deck;
