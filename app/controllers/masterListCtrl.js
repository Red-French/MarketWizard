app.controller('masterListCtrl', ["$scope", "$firebaseArray",  
  function($scope, $firebaseArray) {
   console.log("inside masterList!"); 

  // $scope.searchText = "";

// Just like in the RequireJS version of Music History, make a reference
    var ref = new Firebase("https://market-wizard.firebaseio.com/stocks");
// console.log(ref);
  // Instead of snapshot.val(), use this syntax to get songs
    $scope.stocks = $firebaseArray(ref);

    console.log("stocks = ", $scope.stocks);
  }
]);


  // var ref = new Firebase("https://market-wizard.firebaseio.com/");  // reference database and get current user ID
  // var currentAuth = ref.getAuth();
  // var userRef = new Firebase("https://market-wizard.firebaseio.com/users/" + currentAuth.uid);  // referencing firebase data by current user's id


  // var userData = $firebaseObject(userRef);
  //   console.log("userData", userData);
  //   $scope.userData = userData;

  // var stocksRef = new Firebase("https://market-wizard.firebaseio.com/stocks");  // changing the objects in firebase into an array for angularjs
  // $scope.tickers = $firebaseArray(stocksRef);


  // var userwatchlistRef = new Firebase(userRef + "/watchlists")

  //   var newWatchlist = {
  //     "headerText": event.target.title,
  //     "blurbText": event.target.attributes.description.nodeValue,
  //     "img": event.target.attributes.imageurl.nodeValue
  //   }
  //   console.log("newWatchlist", newWatchlist);

  //   userRef.child("newWatchlist").push(newWatchlist);


  // $scope.logout = function() {
  // // get authdata object by calling firebase method on reference created up top
  // var authData = ref.getAuth();
  // console.log("authData", authData);
  // console.log("authData.uid", authData.uid);
  // // unauthorize user location
  // userRef.unauth();
  // console.log("authData", authData);
  // }
// }]);