
(function(){
    'use strict';

    angular
        .module('angularApp')

        .factory('CardGameFactory',['$http', function ($http){
            return{
                shuffleCards: function(){
                    return $http.get('http://deckofcardsapi.com/api/deck/b2hhux9kveny/shuffle/')

                },

                drawCard: function(){
                    return $http.get('https://deckofcardsapi.com/api/deck/b2hhux9kveny/draw/?count=1');
                }

            };

        }]);

})();
