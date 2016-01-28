var Card = function(value, suit) {
  /*
    Value of the card

    1 = Ace
    2 = 2
    3 = 3
    4 = 4
    5 = 5
    6 = 6
    7 = 7
    8 = 8
    9 = 9
    10 = 10
    11 = Jack
    12 = Queen
    13 = King
  */
  this._value = value;

  /* String representation of the suit (diamonds, spades, etc..) */
  this._suit = suit;
}

module.exports = Card;
