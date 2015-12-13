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
   // .when('/list', {  // when URL ends with this
   //     templateUrl: 'partials/watchList.html',  // location of template
   //     controller: 'watchlistCtrl'  // name of controller (songCtrl.js)
   //   })
      // .when('/filter', {
      //   templateUrl: 'partials/filter.html',
      //   controller: 'FilterCtrl'
      // })
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
     .otherwise('/main'); // catchall
     // .otherwise({ redirectTo: '/main' });
 }]);

