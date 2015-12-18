// * = note regarding issue to be addressed

app.controller('masterListCtrl', ["$scope", "$http", "$firebaseArray",  
  function($scope, $http, $firebaseArray) {
   console.log("inside masterList.Ctrl"); 

  $scope.searchText = "";

// REFERENCE 'DATA' (IN FIREBASE) AND USE PROMISE TO CONFIRM IT IS LOADED
    var dataRef = new Firebase("https://market-wizard.firebaseio.com/data"); // grab data from Firebase
    var data = $firebaseArray(dataRef);
    var dataRef2 = new Firebase("https://market-wizard.firebaseio.com/data2"); // grab data from Firebase
    var data2 = $firebaseArray(dataRef2);

    data.$loaded()
      .then(function(data) {  // promise
        $scope.data = data[0];
        // console.log("yesterday's close", $scope.data[0].close)
    })

    data2.$loaded()
      .then(function(data2) {  // promise
        // console.log("data2.length", data2.length);
        $scope.data2 = data2[0];
})

//  CALCULATION FUNCTION FOR 'PRICE CHANGE TODAY'
  // function priceChange() {
    var dataRef = new Firebase("https://market-wizard.firebaseio.com/data"); // grab data from Firebase
    var data = $firebaseArray(dataRef);
    var dataRef2 = new Firebase("https://market-wizard.firebaseio.com/data2"); // grab data from Firebase
    var data2 = $firebaseArray(dataRef2);
    data.$loaded()
      .then(function(data) {  // promise
        $scope.data = data[0];
        // console.log("yesterday's close", $scope.data[0].close)
    })

    data2.$loaded()
      .then(function(data2) {  // promise
        // console.log("data2.length", data2.length);
        $scope.data2 = data2[0];

    var newData = new Firebase("https://market-wizard.firebaseio.com/calculated/");
    $scope.userData = $firebaseArray(newData);  // turn Firebase into Array for Angular
    $scope.scanResults = { ticker: "", calculation: ""};  // create new object to hold calculation
    // console.log("data2.length", data2.length);
      for (var i = 0; i < 100; i++) {
        // console.log(i);
      // console.log("current price", $scope.data2[i].lastPrice)
      // console.log("Price Change Today in", $scope.data2[i].symbol, $scope.data2[i].lastPrice - $scope.data[i].close);

      $scope.ticker = $scope.data2[i].symbol;
      $scope.calculation = $scope.data2[i].lastPrice - $scope.data[i].close;
      // console.log("ticker", $scope.ticker);
      // console.log("calculation", $scope.calculation);
      console.log("ticker", $scope.ticker);
      console.log("calc", $scope.calculation);
      $scope.userData.$add({  // add tickers/calculations to Firebase
        ticker: $scope.ticker,
        calculation: $scope.calculation
      });

      // newData.set(userData);

    }
})




    //     data2.$loaded()
    //       .then(function(data2) {  // promise
    //         $scope.data2 = data2[0];

    //       data.$loaded()
    //         .then(function(data) {  // promise
    //           $scope.data = data[0];
    //           console.log("ticker is ", $scope.data[0].symbol);
    //           console.log("data[0].close", $scope.data[0].close)
    //           console.log("data2[0].lastPrice", $scope.data2[0].lastPrice)

    //       var calculation = $scope.data2[0].lastPrice - $scope.data[0].close;
    //       $scope.calculation = calculation;
    //       console.log("$scope.calculation", $scope.calculation);
    //     })
    // })

    // dataRef2.once("value", function(snapshot) {
    //   dataRef2.orderByChild("symbol").on("child_added", function(snapshot2) {
    //   snapshot.forEach(function(childSnapshot2) {  // The callback function is called for each day's data
    //     console.log("childSnapshot2", childSnapshot2.val());  // each day's dataset is console logging
    //     var key = snapshot2.key();  // key is the unique ID of each day's data
    //     console.log("key", key);
    //     var childData2 = childSnapshot2.val();  // childData2 is contents of the child
    //     $scope.childData2 = childData2;
    //     console.log("childData2.length", childData2.length);
        // console.log("date", childData2[2].serverTimestamp);
        // console.log("childData2", childData2.lastPrice);
          // childData2.forEach(function(object) {  // loop through data
            // console.log("object.name", object.name);
            // var tickerToday = object;
            // $scope.tickerToday;
            // console.log("object.lastPrice", object.lastPrice);
    //       })
    //     })
    // });

    //     dataRef.once("value", function(snapshot) {
    //       dataRef.orderByChild("symbol").limitToFirst(1).on("child_added", function(snapshot3) {
          // snapshot.forEach(function(childSnapshot) {  // The callback function is called for each day's data
            // console.log("snapshot", snapshot.val());  // each day's dataset is console logging
            // var key = snapshot3.key();  // key is the unique ID of each day's data
            // console.log("key", key);
            // var childData = snapshot3.val();  // childData is contents of the child
            // console.log("childData.length", childData.length);
            // console.log("childData2.length", $scope.childData2.length);
            // console.log("date", childData[0].serverTimestamp);
              // $scope.childData2.forEach(function(object2) {


              // })
              // childData.forEach(function(object) {  // loop through data
              //   console.log("object.name", object.name);
              //   console.log("object.lastPrice", object.lastPrice);



            // to access yesterday's dataset only, get number of entries with
            // var length = childData.length;
            // 
            // MATH FUNCTIONALITY GOES HERE
            // MATH FUNCTIONALITY GOES HERE
            // MATH FUNCTIONALITY GOES HERE

            // MATH FUNCTIONALITY GOES HERE
            // MATH FUNCTIONALITY GOES HERE
            // MATH FUNCTIONALITY GOES HERE
          // })
          //   })
      // })
// });








// * FOR CALCULATING ALL PREVIOUS DAYS' DATA - UNFINISHED UNFINISHED
// UNFINISHED UNFINISHED UNFINISHED UNFINISHED UNFINISHED UNFINISHED
    // dataRef2.once("value", function(snapshot) {
    //   snapshot.forEach(function(childSnapshot) {  // The callback function is called for each day's data
    //     // console.log("snapshot", snapshot.val());  // each day's dataset is console logging
    //     var key = childSnapshot.key();  // key is the unique ID of each day's data
    //     console.log("key", key);
    //     var childData = childSnapshot.val();  // childData is contents of the child
    //     // console.log("childData.length", childData.length);
    //     console.log("date", childData[0].serverTimestamp);

    //     childData.forEach(function(object) {  // loop through data
    //     // console.log("object.name", object.name);
    //     // console.log("object.lastPrice", object.lastPrice);

    //   // LOOPS THROUGH ALL PREVIOUS DAYS' DATA IN 'DATA'
    //       dataRef.once("value", function(snapshot) {
    //         snapshot.forEach(function(yesterdayChildSnapshot) {  // The callback function is called for each day's data
    //           // console.log("snapshot", snapshot.val());  // each day's dataset is console logging
    //           var key = yesterdayChildSnapshot.key();  // key is the unique ID of each day's data
    //           console.log("key", key);
    //           var childData = yesterdayChildSnapshot.val();  // childData is contents of the child
    //           // console.log("childData.length", childData.length);
    //           console.log("date", childData[0].serverTimestamp);


    //     })
    //   });
    //     })
    //   });
    // });


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

      var dataRef = new Firebase("https://market-wizard.firebaseio.com/data2/today");  //  make reference to database location for data to be stored
      
      // var monthArray = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]

      // var today = new Date();
      // var dayNum = today.getDay().toString();
      // var month = monthArray[today.getMonth()];
      // var year = today.getFullYear();

      // var full = month + dayNum + year;

      // dataRef.child(full).push(
      //   response.data.results
      // );

      dataRef.set(response.data.results);

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






// EXAMPLES FROM FIREBASE
// Get a database reference to our posts
// var ref = new Firebase("https://docs-examples.firebaseio.com/web/saving-data/fireblog/posts");

// // Attach an asynchronous callback to read the data at our posts reference
// ref.on("value", function(snapshot) {
//   console.log(snapshot.val());
// }, function (errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });
// // Retrieve new posts as they are added to our database
// ref.on("child_added", function(snapshot, prevChildKey) {
//   var newPost = snapshot.val();
//   console.log("Author: " + newPost.author);
//   console.log("Title: " + newPost.title);
//   console.log("Previous Post ID: " + prevChildKey);
// });
// // Get the data on a post that has changed
// ref.on("child_changed", function(snapshot) {
//   var changedPost = snapshot.val();
//   console.log("The updated post title is " + changedPost.title);
// });
// // Get the data on a post that has been removed
// ref.on("child_removed", function(snapshot) {
//   var deletedPost = snapshot.val();
//   console.log("The blog post titled '" + deletedPost.title + "' has been deleted");
// });

// SORT DATA
var sortData = new Firebase("https://market-wizard.firebaseio.com/data2/");
sortData.orderByValue().limitToLast(3).on("value", function(snapshot) {
  snapshot.forEach(function(data) {
    // console.log("The " + data.key() + " dinosaur's score is " + data.close);
  });
});


  }  // end of controller function (all functionality goes inside this function)
]);

