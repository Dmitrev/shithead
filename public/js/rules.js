var rules = {

    check: function(card, lastCard, ref){
        // ref is the object to to call the rules functions on (hack for node.js)
        if( typeof ref == "undefined"){
            ref = this;
        }

        // First card on table is always allowed
        console.log(card, lastCard);
        if( lastCard == null)
            return true;

        if( ref.sameSuit(card, lastCard)){
            return true;
        }
        else if( ref.sameValue(card, lastCard) ){
            return true;
        }
        else if( ref.isJack(card) ){
            return true;
        }
        else if( ref.isJoker(card)){
            return true;
        }

        return false;
    },

    sameSuit: function(card, lastCard){

        if( card._suit != lastCard._suit){
            console.log('sameSuit: false');
            return false;
        }
        console.log('sameSuit: true');
        return true;
    },

    sameValue: function(card, lastCard){
        if( card._value != lastCard._value){
            console.log('sameValue: false');
            return false;
        }
        console.log('sameValue: true');
        return true;
    },
    isJack: function(card){

        if( card._value != 11){
            console.log('isJack: false');
            return false;
        }
        console.log('isJack: true');
        return true;
    },

    isJoker: function(card){

        if( card._value != 0){
            console.log('isJoker: false');
            return false;
        }
        console.log('isJoker: true');
        return true;
    }

}

if( typeof module != "undefined") {
    module.exports = rules;
}