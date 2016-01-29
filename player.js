var Player = function(id, nickname, socketid){
    this._id = id;
    this._nickname = nickname;
    this._hand = [];
    this._ready = false;
    this._socketid = socketid;
};

Player.prototype.getNickname = function(){
    return this._nickname;
}

Player.prototype.getId = function(){
    return this._id;
}

Player.prototype.give = function(card) {
    console.log('Given player '+this._nickname + ' a card');
    this._hand.push(card);
}

Player.prototype.showHand = function(){
    console.log(this._hand);
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
module.exports = Player;