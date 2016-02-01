var Player = function(id, nickname, socketid){
    this._id = id;
    this._nickname = nickname;
    this._hand = [];
    // Keep track if the player has pressed the ready button in lobby
    this._ready = false;
    this._socketid = socketid;
    this._inGame = false;
    // Check if a player has placed al his cards
    this._done = false;
};

Player.prototype.getNickname = function(){
    return this._nickname;
}

Player.prototype.getId = function(){
    return this._id;
}

Player.prototype.give = function(cards) {

    if( cards == null || typeof cards.length == "undefined")
        return false;

    for(var i = 0; i < cards.length; i++) {
        this._hand.push(cards[i]);
    }
}

Player.prototype.take = function(card){

    for(var i = 0; i < this._hand.length; i++){

        var handCard = this._hand[i];

        if( handCard._value != card._value){
            continue;
        }

        else if( handCard._suit != card._suit){
            continue;
        }

        this._hand.splice(i, 1);

    }
}

Player.prototype.ready = function () {
    console.log( this._nickname + " is ready");
    this._ready = true;
}

Player.prototype.unReady = function () {
    console.log( this._nickname + " is not ready");
    this._ready = false;
}

Player.prototype.isReady = function(){
    return this._ready;
}

Player.prototype.getHand = function(){
    return this._hand;
}

Player.prototype.hasCard = function(card){
    // We receive the input from the client, so it's unsure if
    // we get the right data to check the card in hand
    if( typeof card._value == "undefined" || typeof card._suit == "undefined")
        return false;

    // Assume we have all the necessary data here
    for(var i = 0; i < this._hand.length; i++){

        var handCard = this._hand[i];

        if( handCard._value != card._value){
            continue;
        }

        else if( handCard._suit != card._suit){
            continue;
        }

        return true;

    }
}

Player.prototype.checkDone = function(){
    if( this._hand.length == 0){
        this._done = true;
        return true;
    }

    return false;
}
module.exports = Player;