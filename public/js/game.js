var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

var sprite;

var loadState = {

    preload: function(){
        console.log('start loading');
        var loadingLabel = game.add.text(80, 150, 'loading...', {
            font: '30px Courier',
            fill: '#ffffff'
        });

        game.load.image('backgroundLobby','/images/background-lobby.jpg');
        game.load.image('back','/images/cardBack_red2.png');
        game.load.image('clubs2','/images/cardClubs2.png');
        game.load.image('clubs3','/images/cardClubs3.png');
        game.load.image('clubs4','/images/cardClubs4.png');
        game.load.image('clubs5','/images/cardClubs5.png');
        game.load.image('clubs6','/images/cardClubs6.png');
        game.load.image('clubs7','/images/cardClubs7.png');
        game.load.image('clubs8','/images/cardClubs8.png');
        game.load.image('clubs9','/images/cardClubs9.png');
        game.load.image('clubs10','/images/cardClubs10.png');
        game.load.image('clubsA','/images/cardClubsA.png');
        game.load.image('clubsJ','/images/cardClubsJ.png');
        game.load.image('clubsK','/images/cardClubsK.png');
        game.load.image('clubsQ','/images/cardClubsQ.png');
        game.load.image('diamonds2','/images/cardDiamonds2.png');
        game.load.image('diamonds3','/images/cardDiamonds3.png');
        game.load.image('diamonds4','/images/cardDiamonds4.png');
        game.load.image('diamonds5','/images/cardDiamonds5.png');
        game.load.image('diamonds6','/images/cardDiamonds6.png');
        game.load.image('diamonds7','/images/cardDiamonds7.png');
        game.load.image('diamonds8','/images/cardDiamonds8.png');
        game.load.image('diamonds9','/images/cardDiamonds9.png');
        game.load.image('diamonds10','/images/cardDiamonds10.png');
        game.load.image('diamondsA','/images/cardDiamondsA.png');
        game.load.image('diamondsJ','/images/cardDiamondsJ.png');
        game.load.image('diamondsK','/images/cardDiamondsK.png');
        game.load.image('diamondsQ','/images/cardDiamondsQ.png');
        game.load.image('hearts2','/images/cardHearts2.png');
        game.load.image('hearts3','/images/cardHearts3.png');
        game.load.image('hearts4','/images/cardHearts4.png');
        game.load.image('hearts5','/images/cardHearts5.png');
        game.load.image('hearts6','/images/cardHearts6.png');
        game.load.image('hearts7','/images/cardHearts7.png');
        game.load.image('hearts8','/images/cardHearts8.png');
        game.load.image('hearts9','/images/cardHearts9.png');
        game.load.image('hearts10','/images/cardHearts10.png');
        game.load.image('heartsA','/images/cardHeartsA.png');
        game.load.image('heartsJ','/images/cardHeartsJ.png');
        game.load.image('heartsK','/images/cardHeartsK.png');
        game.load.image('heartsQ','/images/cardHeartsQ.png');
        game.load.image('spades2','/images/cardSpades2.png');
        game.load.image('spades3','/images/cardSpades3.png');
        game.load.image('spades4','/images/cardSpades4.png');
        game.load.image('spades5','/images/cardSpades5.png');
        game.load.image('spades6','/images/cardSpades6.png');
        game.load.image('spades7','/images/cardSpades7.png');
        game.load.image('spades8','/images/cardSpades8.png');
        game.load.image('spades9','/images/cardSpades9.png');
        game.load.image('spades10','/images/cardSpades10.png');
        game.load.image('spadesA','/images/cardSpadesA.png');
        game.load.image('spadesJ','/images/cardSpadesJ.png');
        game.load.image('spadesK','/images/cardSpadesK.png');
        game.load.image('spadesQ','/images/cardSpadesQ.png');
        game.load.image('joker','/images/cardJoker.png');

    },

    create: function(){
        game.state.start('lobby');
    }
};


var lobbyState = {


    create: function(){

        // Add background
        game.add.sprite( 0, 0, 'backgroundLobby');

    },

    startGame: function(){
        game.state.start('play');
    }
};

var playState = {
    create: function(){

    }
};


game.state.add('load', loadState);
game.state.add('lobby', lobbyState);
game.state.add('play', playState);

game.state.start('load');