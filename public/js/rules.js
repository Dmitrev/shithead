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

        return false;
    },

    sameSuit: function(card, lastCard){

        if( card._suit != lastCard._suit){

            return false;
        }

        return true;
    },

    sameValue: function(card, lastCard){
        if( card._value){
            return false;
        }

        return true;
    }

}

if( typeof module != "undefined") {
    module.exports = rules;
}