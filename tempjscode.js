//  GRAB TODAY'S DATA
  marketToScan.once("value", function(snapshot) {
    marketToScan.orderByChild("symbol").on("child_added", function(snapshot2) {
      var key = snapshot2.key();  // key is the unique ID of each day's data
      var childData2 = snapshot2.val();  // childData2 is contents of the child
      $scope.childData2 = childData2;
      todaysData = $scope.childData2;
  });

// GRAB YESTERDAY'S DATA
      marketHistoryToScan.once("value", function(snapshot) {
        var ticker = "";
        var lastPrice = 0;
        var close = 0;
        var high = 0;
        var low = 0;
        var volume = 0;
        var calculation = 0;
        var calcResult = 0;

// * SHOULD ALWAYS BE 'LIMITTOLAST' TO COMPARE PRIOR CLOSE TO LATEST DATA
        marketHistoryToScan.orderByChild("symbol").limitToLast(1).on("child_added", function(snapshot3) {
          var key = snapshot3.key();  // key is the unique ID of each day's data
          var childData3 = snapshot3.val();  // childData is contents of the child
          yesterdaysData = childData3;



// ++++++ DISPLAY USER'S CHOSEN WATCHLIST FROM DROPDOWN ++++++++++++++++++++++++++++++++++++++
// * NO LONGER USED
// * NO LONGER USED
// * NO LONGER USED
  // $scope.watchListView = function(watchList) {
    // console.log(watchList);
    // console.log(watchList.$id);

  // * NEED TO LOOP THROUGH OBJECT AND MATCH TICKERS TO TICKERS IN 'DATA2' TO PULL DATA

   // $location.path("/watchlist");  // take user to this location
  // $scope.$apply();
  // }


  // +++ CURRENTLY NOT  BEING USED ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //  SHOW/HIDE CHART
  $(document).ready(function(){
      $("#hide").click(function(){
          $("p").hide();
      });
      $("#show").click(function(){
          $("p").show();
      });
  });

  
