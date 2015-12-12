// This module lets user register, log in, and log out with email & password //

app.controller('logIn', ["$scope", "$location", 
  function($scope, $location) {
  	console.log("inside login.js");

// register user
$scope.createUser = function() {
var ref = new Firebase("https://market-wizard.firebaseio.com");
ref.createUser({
  email    : $scope.email,
  password : $scope.password
}, function(error, userData) {
  if (error) {
    console.log("Error creating user:", error);
  } else {
    console.log("Successfully created user account with uid:", userData.uid);
    var newUser = new Firebase("https://market-wizard.firebaseio.com/users/" + userData.uid);
    var userData = {
      "user": userData.uid,
      "email": $scope.email,
      "password": $scope.password
    };
    // sets the new user data object to the firebase database //
    newUser.set(userData);
  }
});
}


// log user in
$scope.login = function() {
var ref = new Firebase("https://market-wizard.firebaseio.com");
ref.authWithPassword({
  email    : $scope.email,
  password : $scope.password
}, function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    $location.path("/controlPanel");
    $scope.$apply();
    console.log("Authenticated successfully with payload:", authData);
  }
});
}


// log user out
$scope.logout = function() {

  // get authdata object by calling firebase method on reference created up top
  var authData = ref.getAuth();
  console.log("authData", authData);
  console.log("authData.uid", authData.uid);
  // unauthorize user location
  userRef.unauth();
  console.log("authData", authData);
  $location.path("partials/splash.html");
  $scope.$apply();
  }



}]);

