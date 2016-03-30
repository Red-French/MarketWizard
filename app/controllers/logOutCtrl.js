
app.controller('logOut', ["$scope", "$location",
  function($scope, $location) {

  // log user out
$scope.logout = function() {
var ref = new Firebase("https://market-wizard.firebaseio.com");  // reference database
  var authData = ref.getAuth();  // get authdata object by calling firebase method on reference created above
  ref.unauth();
  $location.path("/logout");
  }();
}]);
