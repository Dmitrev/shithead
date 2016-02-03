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
  this._rotationReversed = false;

  // End turn after placing card (modified by special effect)
  this._endTurn = true;

  // Check if jack card effect is active
  this._jackActive = false;

  // The suit that is chosen by player with Jack Effect
  this._jackSuit = null;

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

// Get all that about the players without giving away too much info for the client side
Game.prototype.getPlayersClientSide = function(){
    var players = [];

    for( var i = 0; i < this._players.length; i++){

        var player = {
            nickname: this._players[i]._nickname,
            cardCount: this._players[i].getHand().length,
            onTurn: (i == this._currentTurn),
            ready: this._players[i]._ready
        };

        players.push(player);
    }

    return players;
}

Game.prototype.isStarted = function(){
    return this._started;
}

Game.prototype.nextTurn = function(){

    if( !this._endTurn )
        return false;

    this.setNextTurn();

    this._eventEmitter.emit('nextTurn', this._players[this._currentTurn]);
    return true;
}

Game.prototype.kickPlayerByIndex = function(index){
    if( typeof this._players[index] == "undefined")
        return false;
    this._players.splice(index, 1);
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


    if( player.getHand().length == 1){
        if( [0,1,2,7,8,11].indexOf(card._value) != -1){
            console.log("can't end game with a special card");
            return false;
        }

    }

    if( !this._jackActive ) {

        this._endTurn = true;

        if (!rules.check(card, this._deck.getLastCard(), rules)) {
            console.log(player._nickname + " tried to place a card against the rules");
            return false;
        }
    }


    // The player can only place "2's" and "jokers" when there is a debt
    if( this._debt > 0){
        if(card._value != 0 && card._value != 2){
            console.log(player._nickname + " tried to place a card that is not a 2 or a joker");
            return false;
        }
    }

    if( this._jackActive ){

        if( card._suit != this._jackSuit && card._value != 0 && card._value != 11 ){
            console.log(player._nickname + " tried to place a card that is not allowed by the jack rule");
            return false;
        }

        this._jackActive = false;
        this._jackSuit = null;
        this._eventEmitter.emit('endJackEffect');
    }



    // Take the card from the player
    player.take(card);

    // Place card in the deck
    this._deck.place(card);

    this.checkDone(player);

    this.triggerSpecialEffect(card, player);

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
    this._endTurn = true;
    var cards = this._deck.take(amount);

    if( cards == null || cards.length == 0){
        this._eventEmitter.emit('noCardsLeft', player);
        return false;
    }

    if (this._deck.isEmpty() ){
        this._deck.reshuffleCards();

    }


    player.give(cards);


    console.log(player.getHand());
    return cards;
}

Game.prototype.skipTurn = function(player){

    // Check if the player currently on turn is actually existing
    if( typeof this._players[ this._currentTurn ] == "undefined"){
        return false;
    }

    var currentTurnPlayer = this._players[ this._currentTurn ];
    // Verify that the current socket is the actual player that is on turn
    if( currentTurnPlayer._socketid != player._socketid){
        return false;
    }
    // The player may only skip a turn if the deck is empty
    if( !this._deck.isEmpty()){
        return false;
    }

    this.nextTurn();
}

Game.prototype.triggerSpecialEffect = function(card, player){

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

    else if( card._value == 7){
        this._endTurn = false;
    }

    else if (card._value == 11){
        this._endTurn = false;
        this._jackActive = true;
        this._eventEmitter.emit('chooseSuit', player);
    }
    else if( card._value == 1){
        this.flipRotation();
    }
    else if( card._value == 8){
        this.setNextTurn();
    }

}

Game.prototype.messageNextPlayer = function(event, data){
    var nextTurnIndex = this.getNextTurn();
    var nextPlayer = this._players[nextTurnIndex];

    this._eventEmitter.emit('messageNextPlayer', {
        event: event,
        nextPlayer: nextPlayer,
        data: data
    });
    return true;
}

Game.prototype.payDebt = function(player){
    var cards = this.takeCards(player, this._debt);
    console.log(player._nickname + " paid his debt of "+ this._debt + " cards");

    // Reset debt
    this._debt = 0;

    return cards;
}

Game.prototype.setSuit = function(suit){

    if( !this._jackActive )
        return false;

    if( !this._deckBuilder.suitExists(suit)){
        return false;
    }

    this._jackSuit = suit;
    this._endTurn = true;

    this.nextTurn();

    return true;
}
 Game.prototype.flipRotation = function(){
     if( this._rotationReversed ){
         this._rotationReversed = false;
         return false;
     }
     this._rotationReversed = true;
 }

Game.prototype.setNextTurn = function(){

    if( this._currentTurn == null){
        this._currentTurn = 0;
        return false;
    }
    var next = this.getNextTurn();
    this._currentTurn = next;
}

Game.prototype.getNextTurn = function(){


    var next = this.getNextPlayer(this._currentTurn);


    if( typeof this._players[next] == "undefined"){
        return false;
    }

    return next;
}

Game.prototype.getNextPlayer = function(currentIndex){

    if( this.notEnoughPlayers() )
    {
        this._eventEmitter.emit('endGame');
        return false;
    }

    if( !this._rotationReversed ) {

        next = ++currentIndex;
        if( next > this._players.length -1){
            next = 0;
        }

    }
    else{

        next = --currentIndex;
        if (next < 0) {
            next = this._players.length - 1;
        }
    }

    if (typeof this._players[next] == "undefined" || this._players[next]._done) {
        return this.getNextPlayer(next);
    }

    return next;


}

Game.prototype.notEnoughPlayers = function(){
    if( this._players.length == 1)
        return true;

    var playersDone = 0;
    for( var i = 0; i < this._players.length; i++){
        if( this._players[i]._done ){
            playersDone++;
        }
    }

    if( playersDone >= this._players.length - 1){
        return true;
    }

    return false;
}

module.exports = Game;
