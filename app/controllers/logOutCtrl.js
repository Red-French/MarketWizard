
app.controller('logOut', ["$scope", "$location", 
  function($scope, $location) {
	console.log("inside logOutCtrl.js");

  // log user out
$scope.logout = function() {
console.log("in logout()");
var ref = new Firebase("https://market-wizard.firebaseio.com");  // reference database
  var authData = ref.getAuth();  // get authdata object by calling firebase method on reference created above
    console.log("authData", authData);
  console.log("authData.uid", authData.uid);
  ref.unauth();
  // userRef.unauth();  // unauthorize user location
  console.log("authData", authData);
  $location.path("/splash.html");
  // $scope.$apply();  // used to call the digest() method to listen for DOM event
  }();
}]);
