// This module lets user register, log in, and log out with email & password //

app.controller('logInOut', ["$scope", "Auth", "$location",
  function($scope, Auth, $location) {
  	console.log("I see login!!");
    $scope.createUser = function() {
      $scope.message = null;
      $scope.error = null;

    /// registering with email/password - firebase then creates a unique id for this user to keep their profiles for future use ///
      Auth.$createUser({
        email: $scope.email,
        password: $scope.password
      }).then(function(userData) {
      	var uid = userData.uid;
      	console.log("user created. User id:", userData.uid);
        $scope.message = "User created with uid: " + userData.uid;
        var newfbRef = new Firebase("https://market-wizard.firebaseio.com/users/" + uid);
		    var userData = {
		    	"user": uid,
		    	"email": $scope.email,
		    	"password": $scope.password
		    };
		    /// sets the new user data object to the firebase database ///
		    newfbRef.set(userData);
      }).catch(function(error) {
        $scope.error = error;
      });
    };

    /// leaving email and password an empty string so what user inputs can then be saved to the database //
    $scope.email = "";
    $scope.password = "";
    var ref = new Firebase("https://market-wizard.firebaseio.com/");
    
    // if user has already registered, this allows them to log in//
    $scope.login = function() {
			ref.authWithPassword({
	  		email    : $scope.email,
	  		password : $scope.password
			}, function(error, authData) {
		  	if (error) {
		    	console.log("Login Failed!", error);
		  	} else {
          $location.path("/main/");
          $scope.$apply();
		    	console.log("Authenticated successfully with payload:", authData);
          
		  	}
			});
	  }

// log out function
    $scope.logout = function() {
        // get authdata object by calling firebase method on reference created up top
        var authData = ref.getAuth();
        console.log("authData", authData);
        console.log("authData.uid", authData.uid);
        // construct new firebase reference to user data locatio
        // unauthorize user location
        userRef.unauth();
        console.log("authData", authData);
        }
}]);