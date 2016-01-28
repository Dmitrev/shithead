var Player = function(id, nickname){
    this._id = id;
    this._nickname = nickname;
    this._hand = [];
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
module.exports = Player;