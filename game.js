var DeckBuilder = require('./deckBuilder.js');
var Deck = require('./deck.js');
var rules = require('./public/js/rules.js');

var Game = function(eventEmitter) {
  this._eventEmitter = eventEmitter;
  // The amount of cards that the dealer gives each player at the start
  this._initialCardCount = 7;

  // The current game state
  this._started = false;
  this._players = [];
  this._playersDone = [];
  this._deck = null;
  this._deckBuilder = new DeckBuilder();
  this._currentTurn = null;

   // The amount of cards a player must take (triggerd by special effect card)
  this._debt = 0;
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

    this._deck = new Deck(cards, this._eventEmitter);

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

    this._currentTurn = next;
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
    var randomIndex = Math.floor(Math.random()*this._players.length);
    var randomPlayer = this._players[randomIndex];
    this._currentTurn = randomIndex;
    this._eventEmitter.emit('nextTurn', randomPlayer);
}

Game.prototype.move = function(player, card){

    // User actually has the card
    var playerHasCard = player.hasCard(card);

    if( !playerHasCard ){
        console.log(player._nickname + " tried to place a card he/she does not have");
        return false;
    }

    console.log(rules.check);
    if( !rules.check(card, this._deck.getLastCard(), rules ) ){
        console.log(player._nickname + " tried to place a card against the rules");
        return false;
    }

    // The player can only place "2's" and "jokers" when there is a debt
    if( this._debt > 0){
        if(card._value != 0 && card._value != 2){
            console.log(player._nickname + " tried to place a card that is not a 2 or a joker");
            return false;
        }
    }

    // Take the card from the player
    player.take(card);

    // Place card in the deck
    this._deck.place(card);

    this.checkDone(player);

    this.triggerSpecialEffect(card);

    return true;


}
// Get the only player that is not finished
Game.prototype.getLoser = function(){

    for( var i = 0; i < this._players.length; i++){
        if( !this._players[i]._done){
            return this._players[i];
        }
    }
}

Game.prototype.checkDone = function(player){
    if(player.checkDone() ){
        this._playersDone.push(player);
    }
}
Game.prototype.allDone = function(){
    var notDone = 0;

    for( var i = 0; i < this._players.length; i++){
        if( !this._players[i]._done){
            notDone++;
        }
    }

    // There are still more than one players who are not finished yet
    if( notDone > 1){
        return false;
    }

    return true;

}

Game.prototype.takeCards = function(player, amount) {

    var cards = this._deck.take(amount);

    if( cards == null || cards.length == 0){
        this._eventEmitter.emit('noCardsLeft', player);
        return false;
    }

    if (this._deck.isEmpty() ){
        this._deck.reshuffleCards();

    }


    for( var i = 0; i < cards.length; i++ ){

        player.give(cards[i]);
    }

    return cards;
}

Game.prototype.skipTurn = function(player){

    var currentTurnPlayer = null;

    if( typeof this._players[ this._currentTurn ] != "undefined"){
        currentTurnPlayer = this._players[ this._currentTurn ];
    }

    if( currentTurnPlayer._socketid != player._socketid){
        return false;
    }

    if( !this._deck.isEmpty()){
        return false;
    }

    this.nextTurn();
}

Game.prototype.triggerSpecialEffect = function(card){

    if( card._value == 2){
        this._debt += 2;
        console.log('next player has debt of '+this._debt);

        this.messageNextPlayer('debt');
    }
    else if( card._value == 0){
        this._debt += 5;
        console.log('next player has debt of '+this._debt);
        this.messageNextPlayer('debt');
    }

}

Game.prototype.messageNextPlayer = function(event, data){
    var next = null;
    if( this._currentTurn == null){
        next = 0;
    }
    else{

        next = this._currentTurn + 1;
        if( typeof this._players[next] == "undefined"){
            next = 0;
        }

    }

    if( typeof this._players[next] == "undefined"){
        return false;
    }

    var nextPlayer = this._players[next];

    this._eventEmitter.emit('messageNextPlayer', {
        event: event,
        nextPlayer: nextPlayer,
        data: data
    });
    return true;
}

module.exports = Game;
