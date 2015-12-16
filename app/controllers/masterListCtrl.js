app.controller('masterListCtrl', ["$scope", "$http", "$firebaseArray",  
  function($scope, $http, $firebaseArray) {
   console.log("inside masterList.Ctrl"); 

  $scope.searchText = "";

// REFERENCE 'DATA' (IN FIREBASE) AND USE PROMISE TO CONFIRM IT IS LOADED

    var dataRef = new Firebase("https://market-wizard.firebaseio.com/data"); // grab data from Firebase
    var data = $firebaseArray(dataRef);

    var dataRef2 = new Firebase("https://market-wizard.firebaseio.com/data2"); // grab data from Firebase
    var data2 = $firebaseArray(dataRef2);

    // data.$loaded()
    //   .then(function(data) {  // promise
    //     $scope.data = data[0];
    //     console.log("data[0].close", $scope.data[0].close)
    // })

    // data2.$loaded()
    //   .then(function(data2) {  // promise
    //     $scope.data2 = data2[0];
    //     console.log("data2[0].lastPrice", $scope.data2[0].lastPrice)
    //     console.log("Price Change Today", $scope.data2[0].symbol, $scope.data2[0].lastPrice - $scope.data[0].close);
    // })

        data2.$loaded()
          .then(function(data2) {  // promise
            $scope.data2 = data2[0];

          data.$loaded()
            .then(function(data) {  // promise
              $scope.data = data[0];

              console.log("ticker is ", $scope.data[0].symbol);
              console.log("data[0].close", $scope.data[0].close)
              console.log("data2[0].lastPrice", $scope.data2[0].lastPrice)

          var priceChange = $scope.data2[0].lastPrice - $scope.data[0].close;
          $scope.priceChange = priceChange;
          console.log("$scope.priceChange", $scope.priceChange);
        })
    })

    dataRef2.once("value", function(snapshot) {
      // The callback function will get called twice, once for "fred" and once for "barney"
      snapshot.forEach(function(childSnapshot) {
        // key will be "fred" the first time and "barney" the second time
        var key = childSnapshot.key();

        // childData will be the actual contents of the child
        var childData = childSnapshot.val();
        console.log("childData.length", childData.length);
        console.log("childData", childData);

        childData.forEach(function() {
          // var i = 0;
          // console.log("i");

console.log("childData", childData.symbol);
// console.log("scope.data2", $scope.data.symbol);
          // var priceChange = $scope.data2.lastPrice - $scope.data.close;
          // $scope.priceChange = priceChange;
          // console.log("$scope.priceChange", $scope.priceChange);



        })


      });
    });

// LOG PAST 3 DAYS' DATA (OR HOW MANY DAYS ARE STORED IN 'DATA') FOR AAPL
    // dataRef.once("value", function(snapshot) {
    //   // The callback function will get called twice, once for "fred" and once for "barney"
    //   snapshot.forEach(function(childSnapshot) {
    //     // key will be "fred" the first time and "barney" the second time
    //     var key = childSnapshot.key();

    //     // childData will be the actual contents of the child
    //     var childData = childSnapshot.val();
    //     console.log("childData", childData[1]);
    //   });
    // });






// PUT 'WATCHLISTS' (IN FIREBASE) ON $SCOPE
    var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
    // console.log("ref", ref);
    var currentAuth = ref.getAuth().uid;  // get current user's ID
    var watchRef = new Firebase("https://market-wizard.firebaseio.com/watchlists/" + currentAuth); // grab data from Firebase
    var listToWatch = $firebaseArray(watchRef);
    $scope.listToWatch = listToWatch;
    // console.log("listToWatch = ", $scope.listToWatch)


// PUT 'STOCKS' (IN FIREBASE) ON $SCOPE
    var stocksRef = new Firebase("https://market-wizard.firebaseio.com/stocks/"); // grab data from Firebase
    var stocks = $firebaseArray(stocksRef);
    $scope.stocks = stocks;
    console.log("stocks = ", $scope.stocks)


// UPDATE DATA VIA AN API CALL ON USER CLICK OF 'UPDATE'
  $scope.update = function() {
    console.log("inside update function");
    $http({
    method: 'GET',
    url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=AAL,AAPL,ADBE,ADI,ADP,ADSK,AKAM,ALXN,AMAT,AMGN,AMZN,ATVI,AVGO,BBBY,BIDU,BIIB,BMRN,CA,CELG,CERN,CHKP,CHRW,CHTR,CMCSA,CMCSK,COST,CSCO,CTSH,CTXS,DISCA,DISCK,DISH,DLR,EA,EBAY,ESRX,EXPD,EXPE,FAST,FB,FISV,FOX,FOXA,GILD,GMCR,GOOG,GOOGL,GRMN,HSIC,INCY,INTC,INTU,ILMN,ISRG,JD,KLAC,KHC,LBTYA,LBTYK,LILA,LILAK,LLTC,LMCA,LRCX,LVNTA,MAR,MAT,MDLZ,MNST,MSFT,MU,MYL,NFLX,NTAP,NVDA,NXPI,ORLY,PAYX,PCAR,PCLN,PYPL,QCOM,QVCA,REGN,ROST,SBAC,SBUX,SIRI,SNDK,SPLS,SRCL,STX,SWKS,SYMC,TSCO,TSLA,TRIP,TXN,VIAB,VIP,VOD,VRSK,VRTX,WBA,WDC,WFM,WYNN,XLNX,YHOO'
  }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      console.log("successful response from update", response.data.results);

      var dataRef = new Firebase("https://market-wizard.firebaseio.com/data");  //  make reference to database location for data to be stored
      
      // var monthArray = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]

      // var today = new Date();
      // var dayNum = today.getDay().toString();
      // var month = monthArray[today.getMonth()];
      // var year = today.getFullYear();

      // var full = month + dayNum + year;

      // dataRef.child(full).push(
      //   response.data.results
      // );

      dataRef.push(response.data.results);

    }, function errorCallback(response) {  // called asynchronously if an error occurs
                                          // or server returns response with an error status.
    });
  }


// CREATES NEW WATCHLIST FOR USER
  $scope.newWatchlist = function() {
    console.log("inside newWatchlist function");
    console.log("user 'new watchlist' input field value = ", $scope.watchName);

      var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
      console.log("ref", ref);
      var currentAuth = ref.getAuth().uid;  // get current user's ID
      console.log("currentAuth = ", currentAuth);
      var listRef = new Firebase("https://market-wizard.firebaseio.com/watchlists/" + currentAuth);
      console.log("listRef", listRef);
      // var newList = {
      //   "user": currentAuth,
      //   "name": "Red"
      // };
      // console.log("newList = ", newList.name);
      // console.log("newList = ", newList.user);
      var listName = $scope.watchName;
      console.log("listName = ", listName);
      listRef.child(listName)
      listRef.child(listName).push("");

      // var newStock = $scope.addTicker;
      // console.log("stock = ", newStock);
      // listRef.child(listName).push(newStock);

      }


// ADDS NEW TICKER TO USER'S CHOSEN WATCHLIST
  $scope.newTicker = function() {
    console.log("inside newTicker function");
    console.log("user 'add to watchlist' input field value = ", $scope.addTicker);

      var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
      // console.log("ref", ref);
      var currentAuth = ref.getAuth().uid;  // get current user's ID
      // console.log("currentAuth = ", currentAuth);
      var listRef = new Firebase("https://market-wizard.firebaseio.com/watchlists/" + currentAuth);
      // console.log("listRef", listRef);
      // var watchlistRef = $firebaseArray(listRef);  // move user's watchlists into an array
      // console.log("watchlistRef = ", watchlistRef);
      var newTicker = {
        "ticker": $scope.addTicker
      };
      var watchlistRef = $scope.watchName;  // obtain name of watchlist from input field
      // console.log("watchlistRef = ", watchlistRef);
      // listRef.child(watchlistRef).push(newStock);

      // var newTicker = $scope.addTicker;  // obtain ticker from input field
      console.log("newTicker = ", newTicker);
      // var stockRef = new Firebase("https://market-wizard.firebaseio.com/stocks/" + currentAuth);
      listRef.child(watchlistRef).push(newTicker);  // add ticker to user's chosen watchlist
      // listRef.push($scope.newTicker);




// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++ CONNECT USER'S ID TO STOCK AND RETRIEVE STOCK +++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// ADD USER'S ID TO 'SYMBOL' IN FIREBASE 'STOCKS'
      // var userTickers = stocksRef.orderByChild("symbol").equalTo("AAL");
      // console.log("stocksRef", stocksRef);
      // console.log("userTickers", userTickers);

};

// GRAB USER'S STOCKS (THIS FUNCTIONALITY WILL GO INSIDE 'NEWTICKER' FUNCTION ABOVE)
// 
// brings back all stocks
// var refy = new Firebase("https://market-wizard.firebaseio.com/stocks/naz100");
// refy.orderByChild("symbol").on("child_added", function(snapshot) {
//   console.log(snapshot.key() + " was " + snapshot.val().symbol);
// });

var wlist = "BUY";  // fake data from 'New or Existing Watchlist' input field
var refer = new Firebase("https://market-wizard.firebaseio.com/watchlists/" + currentAuth); // grab data from Firebase
refer.orderByChild("currentAuth").equalTo(wlist).on("child_added", function(snapshot) {
  console.log("Watchlist is " + snapshot.val());
  // var newUser = new Firebase("https://market-wizard.firebaseio.com/stocks/naz100" + addTicker + currentAuth);
});


// ADD USER'S UNIQUE ID TO 'STOCKS > SYMBOL' IN FIREBASE
var tempTick = "AMZN";  // fake data from 'Add Ticker' input field
var refy = new Firebase("https://market-wizard.firebaseio.com/stocks/naz100");
refy.orderByChild("symbol").equalTo(tempTick).on("child_added", function(snapshot) {
  // console.log("Ticker is " + snapshot.val().symbol + " " + snapshot.val().name);
  // var newUser = new Firebase("https://market-wizard.firebaseio.com/stocks/naz100" + tempTick + currentAuth);
});


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++ END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




// LIST OF STOCKS (CONTROL INITIAL DISPLAY)
    $scope.predicate = 'lastPrice';  // initially, list is sorted by 'last price'
    $scope.reverse = true;  // for sort functionality
    $scope.order = function(predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;  // sort functionality
      $scope.predicate = predicate;
    };


// GET CURRENT USER'S WATCHLISTS
    var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
    var currentAuth = ref.getAuth().uid;  // get current user's ID
    // console.log("current user = ", currentAuth);
    var ref = new Firebase("https://market-wizard.firebaseio.com/watchlists/"  + currentAuth);  // make reference to location of current user's watchlists
    ref.orderByKey().on("child_added", function(snapshot) {
      var userWatchlists = snapshot.key();
      // console.log("userWatchlists = ", userWatchlists);
      });listToWatch



// GET CURRENT USER'S STOCKS FROM CHOSEN WATCHLIST:
    var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
    var currentAuth = ref.getAuth().uid;  // get current user's ID
    // console.log("current user = ", currentAuth);
    var stocksRef = new Firebase("https://market-wizard.firebaseio.com/watchlists/"  + currentAuth);  // make reference to location of current user's watchlists
    // console.log("stocksRef = ", stocksRef);
    var userStocks = $firebaseArray(stocksRef);

    // console.log(userStocks)

    userStocks.$loaded()
    .then(function(userStocks) {  // promise
      $scope.userStocks = userStocks;
      // console.log("userStocks = ", $scope.userStocks);
    });


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//  TEMPORARY FUNCTION TO LOAD 'STOCKS' IN FIREBASE FROM 'POPULATE STOCK LIST' BUTTON
  $scope.populateStocks = function() {
    console.log("inside populateStocks function");
    $http({
    method: 'GET',
    url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=AAL,AAPL,ADBE,ADI,ADP,ADSK,AKAM,ALXN,AMAT,AMGN,AMZN,ATVI,AVGO,BBBY,BIDU,BIIB,BMRN,CA,CELG,CERN,CHKP,CHRW,CHTR,CMCSA,CMCSK,COST,CSCO,CTSH,CTXS,DISCA,DISCK,DISH,DLR,EA,EBAY,ESRX,EXPD,EXPE,FAST,FB,FISV,FOX,FOXA,GILD,GMCR,GOOG,GOOGL,GRMN,HSIC,INCY,INTC,INTU,ILMN,ISRG,JD,KLAC,KHC,LBTYA,LBTYK,LILA,LILAK,LLTC,LMCA,LRCX,LVNTA,MAR,MAT,MDLZ,MNST,MSFT,MU,MYL,NFLX,NTAP,NVDA,NXPI,ORLY,PAYX,PCAR,PCLN,PYPL,QCOM,QVCA,REGN,ROST,SBAC,SBUX,SIRI,SNDK,SPLS,SRCL,STX,SWKS,SYMC,TSCO,TSLA,TRIP,TXN,VIAB,VIP,VOD,VRSK,VRTX,WBA,WDC,WFM,WYNN,XLNX,YHOO'
  }).then(function successCallback(response) {
      console.log("successful response from populateStocks", response.data.results);

      var dataRefB = new Firebase("https://market-wizard.firebaseio.com/stocks");  //  make reference to database location for data to be stored
      dataRefB.push(response.data.results);

    }, function errorCallback(response) {  // called asynchronously if an error occurs
                                          // or server returns response with an error status.
    });
  }






  }  // end of controller function (all functionality goes inside this function)
]);

