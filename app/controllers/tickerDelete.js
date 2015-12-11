app.controller("tickerDeleteCtrl", ["$scope", "$firebaseArray", function($scope, $firebaseArray) {

	// $scope.searchTest = "";
	// $scope.watchlists = [];


// reference database and get current user ID
	var ref = new Firebase("https://market-wizard.firebaseio.com/");
	var currentAuth = ref.getAuth();
	// referencing firebase data by current user's id
	var userRef = new Firebase("https://market-wizard.firebaseio.com/users/" + currentAuth.uid);




	var ref = new Firebase("https://market-wizard.firebaseio.com/watchlists" + userRef);
	$scope.watchlists = $firebaseArray(ref);

	$scope.deleteTicker = function(ticker) {
		// console.log(ticker.$id);
		console.log("delete clicked");
		$scope..$remove(ticker);
	};
  
}]);