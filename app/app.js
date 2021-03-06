var app = angular.module("MarketApp", ["firebase", "ngRoute"]);

app.config(['$routeProvider',
 function($routeProvider) {
   $routeProvider
   .when('/main', {
        templateUrl: 'partials/splash.html',
        controller: 'masterListCtrl'
      })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'logIn'
    })
    .when('/logout', {
      templateUrl: 'partials/splash.html',
      controller: 'logOut'
    })
    .when('/data', {
      templateUrl: 'partials/priceChange.html',
      controller: 'masterListCtrl'
    })
   .otherwise('/main');
 }]);
