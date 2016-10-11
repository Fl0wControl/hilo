(function(){
	'use strict';

	angular
		.module('angularApp')

		.controller('CardGameCtrl',[ 'CardGameFactory','$window', function (CardGameFactory, $window){

			var cardGame = this;

			cardGame.startDisabled = false;
			cardGame.guessDisabled = true;
			cardGame.passDisabled = true;

			cardGame.title = "Hi-Lo";
			cardGame.cardPile = [];
			cardGame.cardsRemaining = '';

			cardGame.players = [];

			function Player(name){
				this.name =name;
				this.score = 0;
				this.correctGuesses =0;
			}

			cardGame.createPlayer = function (name){
				cardGame.players.push( new Player(name));
			};

			cardGame.createPlayer("Player_ONE");
			cardGame.createPlayer("Player_TWO");
			cardGame.activePlayerIndex = 0;

			cardGame.cards = ['0', '1', '2','3', '4', '5', '6', '7', '8','9', '10','JACK', 'QUEEN', 'KING', 'ACE'];

			cardGame.shuffle = function(){
				CardGameFactory.shuffleCards()
					.then(function(response){
					},function(response) {
					});
			};

			cardGame.reset = function(){
				cardGame.shuffle();
				cardGame.startDisabled = false;
				cardGame.guessDisabled = true;
				cardGame.cardsRemaining = '';
				cardGame.cardPile = [];
				cardGame.newCard  = '';

				_.forEach(cardGame.players, function(player) {
					player.score=0;
					player.correctGuesses=0;
				});

				$window.location.reload();
			};

			cardGame.getActivePlayer = function(){
				return cardGame.players[cardGame.activePlayerIndex];
			};

			cardGame.checkPlayerStatus = function(activePlayer){
				if(activePlayer.correctGuesses >= 3){
					cardGame.passDisabled = false;
				} else {
					cardGame.passDisabled = true;
				}
			};

			cardGame.pass = function(){
				cardGame.passDisabled = true;
				cardGame.getActivePlayer().correctGuesses=0;
				if(cardGame.activePlayerIndex == 0){
					cardGame.activePlayerIndex = 1;
				} else {
					cardGame.activePlayerIndex = 0;
				}
			};

			cardGame.startHand = function(){
				cardGame.cardPile = [];
				cardGame.startDisabled = true;
				cardGame.guessDisabled = false;
				CardGameFactory.drawCard()
					.then(function(response){
						cardGame.disabled = true;
						cardGame.setDeckProperties(response);
					},function(response) {
						cardGame.errorMessage ="There was a problem processing your request. Please contact technical support for further assistance";
					});
			};

			cardGame.setDeckProperties = function(response){
				if (response.data.remaining == 0){
					cardGame.error = true;
					cardGame.checkScore();
					cardGame.errorMessage ="The end of the game has now been reached. Please see who won, and reset the game";
					return;
				}
				cardGame.cardsRemaining = response.data.remaining;
				cardGame.cardPile.push(response.data.cards[0]);
				cardGame.newCard = cardGame.cardPile[cardGame.cardPile.length -1];
			};

			cardGame.cardValues = function(){
				cardGame.previousCard = cardGame.cardPile[cardGame.cardPile.length -2].value;
				cardGame.currentCard = cardGame.cardPile[cardGame.cardPile.length -1].value;
			};

			cardGame.checkScore = function(){
				cardGame.finished = true;
				if(cardGame.players[0].score < cardGame.players[1].score){
					cardGame.successMessage = "Player 1 is the winner"
				} else if (cardGame.players[1].score < cardGame.players[0].score) {
					cardGame.successMessage = "Player 2 is the winner"
				} else {
					cardGame.successMessage = "The match is a tie";
				}
			};
			
			cardGame.compareDrawnCardIsHigher = function(currentCard, previousCard){
				if(cardGame.cards.indexOf(currentCard) > cardGame.cards.indexOf(previousCard)){
					return true;
				} else {
					return false;
				}
			};

			cardGame.roundReset = function(activePlayer){
				activePlayer.correctGuesses = 0;
				cardGame.cardPile = [];
				cardGame.startDisabled = false;
				cardGame.guessDisabled = true;
			};

			cardGame.guessHi = function(){
				CardGameFactory.drawCard()
					.then(function(response){
						cardGame.setDeckProperties(response);
						cardGame.cardValues();
						if (cardGame.compareDrawnCardIsHigher(cardGame.currentCard,cardGame.previousCard)){
							cardGame.getActivePlayer().correctGuesses += 1;
						} else {
							cardGame.getActivePlayer().score += cardGame.cardPile.length;
							cardGame.roundReset(cardGame.getActivePlayer());
						}
						cardGame.checkPlayerStatus(cardGame.getActivePlayer());
					},function(response) {
						cardGame.errorMessage ="There was a problem processing your request. Please contact technical support for further assistance";
					})
			};

			cardGame.guessLo = function(){
				CardGameFactory.drawCard()
					.then(function(response){
						cardGame.setDeckProperties(response);
						cardGame.cardValues();
						if (!cardGame.compareDrawnCardIsHigher(cardGame.currentCard,cardGame.previousCard)){
							cardGame.getActivePlayer().correctGuesses += 1;
						} else {
							cardGame.getActivePlayer().score += cardGame.cardPile.length;
							cardGame.roundReset(cardGame.getActivePlayer());
						}
						cardGame.checkPlayerStatus(cardGame.getActivePlayer());
					},function(response) {
						cardGame.errorMessage ="There was a problem processing your request. Please contact technical support for further assistance";
					})
			};
			
		}]);

})();