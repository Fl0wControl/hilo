(function() {
    'use strict';

    angular
        .module('angularApp.routing', ['ui.router'])
        .config(['$urlRouterProvider', '$stateProvider', '$locationProvider', function ($urlRouterProvider, $stateProvider, $locationProvider) {


            $locationProvider.html5Mode({
                enabled: true,
                requireBase: true
            });

            $urlRouterProvider.otherwise('/');

            $stateProvider

                .state('/', {
                    url: '/'
                })
                
                .state('cardGame', {
                    url: '/cardGame',
                    templateUrl: 'views/cardGame/cardGame.html',
                    controller: 'CardGameCtrl as cardGame'
                })
            
        }])

})();

