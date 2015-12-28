// This module lets user's register, log in, and log out with email & password //

app.controller('logIn', ["$scope", "$location", 
  function($scope, $location) {
  	console.log("inside login.js");

// REGISTER USER
$scope.createUser = function() {
var ref = new Firebase("https://market-wizard.firebaseio.com"); // reference database
ref.createUser({
  email    : $scope.email,
  password : $scope.password
}, function(error, userData) {
  if (error) {
    console.log("Error creating user:", error);
  } else {
    console.log("Successfully created user account with uid:", userData.uid);
    var newUser = new Firebase("https://market-wizard.firebaseio.com/users/" + userData.uid); // reference the logged-in user's ID(uid)
    var userData = {
      "user": userData.uid,
      "email": $scope.email,
      "password": $scope.password
    };
    newUser.set(userData);  // sets the new user's data object to user's location in firebase database
  }
});
}


// LOG USER IN
$scope.login = function() {
var ref = new Firebase("https://market-wizard.firebaseio.com");  // reference database
ref.authWithPassword({  // method that authenticates user with email/password combination
  email    : $scope.email,
  password : $scope.password
}, function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    $location.path("/instruct");  // on successful login, take user to this location
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
  $scope.$apply();  // used to call the digest() method to listen for DOM event
  }



}]);

