// Translate Server card values to client Phaser keys

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

var cardTranslator = {

    translate: function(value, suit) {
        console.log("value: "+ value+ " suit: "+suit);
        var translatedValue = cardTranslator.translateValue(value);

        return suit+translatedValue;
    },
    translateValue: function(value) {
        switch (value) {
            case 1: return "A"; break;
            case 11: return "J"; break;
            case 12: return "Q"; break;
            case 13: return "K"; break;
            default: return value;
        }
    }

}