var app = angular.module("MarketApp", ["firebase", "ngRoute"]);  // this is like require
  // global 'angular' object has a function, 'module', that takes a name ('MarketApp') and
  // also takes an array of dependencies.

app.config(['$routeProvider',  // this is like entry.js
 function($routeProvider) {  // 'routeProvider' is the traffic director
   $routeProvider
   .when('/main', {
        templateUrl: 'partials/splash.html',
        controller: 'masterListCtrl'
      })
   .when('/instruct', {  // when URL ends with this
       templateUrl: 'partials/instruct.html',  // location of template
       controller: 'masterListCtrl'  // name of controller (songCtrl.js)
     })
      // .when('/filter', {
      //   templateUrl: 'partials/filter.html',
      //   controller: 'FilterCtrl'
      // })
      .when('/sp500', {
        templateUrl: 'partials/sp500.html',
        controller: 'masterListCtrl'
      })
      .when('/dj30', {
        templateUrl: 'partials/dj30.html',
        controller: 'masterListCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'logIn'
      })
      .when('/logout', {
        templateUrl: 'partials/splash.html',
        controller: 'logIn'
      })
      .when('/controlPanel', {
        templateUrl: 'partials/controlPanel.html',
        controller: 'masterListCtrl'
      })
      .when('/data', {
        templateUrl: 'partials/priceChange.html',
        controller: 'masterListCtrl'
      })
      .when('/watchlist', {
        templateUrl: 'partials/watchlist.html',
        controller: 'masterListCtrl'
      })
     .otherwise('/main'); // catchall
     // .otherwise({ redirectTo: '/main' });
 }]);

