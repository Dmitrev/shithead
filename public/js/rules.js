var rules = {

    check: function(card, lastCard){
        // First card on table is always allowed
        console.log(card, lastCard);
        if( lastCard == null)
            return true;

        if( rules.sameSuit(card, lastCard)){
            return true;
        }
        else if( rules.sameValue(card, lastCard) ){
            return true;
        }
        else if( rules.isJack(card) ){
            return true;
        }
        else if( rules.isJoker(card)){
            return true;
        }

        return false;
    },

    sameSuit: function(card, lastCard){

        if( card._suit != lastCard._suit){

            return false;
        }

        return true;
    },

    sameValue: function(card, lastCard){
        if( card._value != lastCard._value){
            return false;
        }

        return true;
    },
    isJack: function(card){

        if( card._value != 11){
            return false;
        }

        return true;
    },

    isJoker: function(card){
        if( card._value != 0){
            return false;
        }

        return true;
    }

}

if( typeof module != "undefined") {
    module.exports = rules;
}