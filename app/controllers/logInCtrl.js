// This module lets user's register and log in with email & password //

app.controller('logIn', ["$scope", "$location",
  function($scope, $location) {

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
        $('#registerModal').modal('show');
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
        $location.path("/data");  // on successful login, take user to this location
        $scope.$apply();
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  }

}]);
