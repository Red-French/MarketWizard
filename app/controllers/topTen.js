app.controller('topTenCtrl', ["$scope", "$http", "$firebaseArray",  "$location",  
  function($scope, $http, $firebaseArray, $location) {
   // console.log("inside masterList.Ctrl"); 

  $scope.searchText = "";

// PUSH TOP 10 TO FIREBASE -- 
  function addTen () {
      newTop10.remove();  // remove old data
    newData.orderByChild("calculation").on("child_added", function(snapshot5) {

      // snapshot.forEach(function(childSnapshot4) {  // The callback function is called for each day's data
      console.log("snapshot", snapshot5.val());  // log each stock (# limited above by limitToLast)
      var key = snapshot5.key();  // key is the unique ID of each day's data
      var topTenData = snapshot5.val();  // topTenData is contents of the child
      var topTenTicker = topTenData.ticker;
      var topTenCalc = topTenData.calculation;

      console.log("TopTen", topTenTicker, topTenCalc);
      top10.$add({  // add tickers/calculations to Firebase
        ticker: topTenTicker,
        calculation: topTenCalc
      });
    });
  }
}
]);