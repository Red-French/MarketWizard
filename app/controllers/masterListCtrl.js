// * = note regarding issue to be addressed

// GRAB TODAY'S DATA AND GRAB YESTERDAY'S DATA SHOULD BE MOVED INTO A FACTORY


app.controller('masterListCtrl', ["$scope", "$http", "$firebaseArray",  "$location",
  function($scope, $http, $firebaseArray, $location) {

  $scope.searchText = "";


// +++++ CHECK AND LOG USER'S CURRENT AUTHENTICATION STATE +++++++++++++++++++++
  // set 'Chart' button's 'display' property to 'none' if user logged out
  // set a authentication flag ('loginStaus') for use elsewhere

var ref = new Firebase("https://market-wizard.firebaseio.com");
var loginStatus = false;
ref.onAuth(authCallback);
  function authCallback(authData) {
    // Do not show 'chart' modal if user is logged out
    var chartButton = document.getElementById('chartButton');  // reference 'Chart' button
    var tickerBoard = document.getElementById('tickerBoard');  // reference index tickerboard
    var tickerBoard2 = document.getElementById('tickerBoard2'); // reference tickerboard

    if (authData) {  // if user is logged in
      chartButton.style.display = "block"  // show 'Chart' button
      tickerBoard.style.display = "block" // show index tickerboard
      tickerBoard2.style.display = "block" // show tickerboard

      loginStatus = true;  // set flag for use elsewhere

    } else {  // else user is logged out
      chartButton.style.display = "none"  // do not show 'Chart' button
      tickerBoard.style.display = "none"  // do not show index tickerboard
      tickerBoard2.style.display = "none" // do not show tickerBoard
      loginStatus = false;
    }
  }


// +++++ TEXT COLOR FLASH ++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// TEXT COLOR FLASH ('Last Live Update' below navbar)
    function flasher() {
      if (loginStatus === true) {  // if user is logged in
      var text = document.getElementById('textFlash');
      text.style.color = (text.style.color=='silver') ? 'green':'silver';  // ternary operator for if/then functionality
      text.style.textDecoration = (text.style.textDecoration=='none') ? 'underline':'none';  // ternary operator for if/then functionality
      }
    }
    var clr = setInterval(flasher, 2000);


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// REFERENCE 'DATA' (IN FIREBASE) AND RETURN PROMISE TO CONFIRM IT IS LOADED

    var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
    var currentAuth = ref.getAuth().uid;  // get current user's ID

    var dataRef = new Firebase("https://market-wizard.firebaseio.com/data"); // reference NAZ100 Historical Data
    var data = $firebaseArray(dataRef);
    var dataRef2 = new Firebase("https://market-wizard.firebaseio.com/data2"); // reference NAZ100 Today's Data
    var data2 = $firebaseArray(dataRef2);
    var dataRef3 = dataRef2.child("today");  // reference NAZ100 Today's Data
    var data3 = $firebaseArray(dataRef3);

    var sp500HistoryRef = new Firebase("https://market-wizard.firebaseio.com/SP500_Historical"); // reference S&P-500 Historical Data
    var sp500History = $firebaseArray(sp500HistoryRef);
    var sp500Ref = new Firebase("https://market-wizard.firebaseio.com/sp500"); // reference S&P-500 Today's Data
    var sp500 = $firebaseArray(sp500Ref);

    var dj30HistoryRef = new Firebase("https://market-wizard.firebaseio.com/DJ_Historical"); // reference DJ-30 Historical Data
    var dj30History = $firebaseArray(dj30HistoryRef);
    var dj30Ref = new Firebase("https://market-wizard.firebaseio.com/dj30"); // reference DJ-30 Today's Data
    var dj30 = $firebaseArray(dj30Ref);

    var newData = new Firebase("https://market-wizard.firebaseio.com/calculated/");  // reference Market Data after calculations
    var userData = $firebaseArray(newData);  // turn Firebase into Array for Angular
    $scope.userData = userData;

    var scans =  new Firebase("https://market-wizard.firebaseio.com/scans");  // // reference scans
    var scanners = $firebaseArray(scans);
    $scope.scans = scanners;

    var marketsRef = new Firebase("https://market-wizard.firebaseio.com/markets"); // // reference all markets in system
    var markets = $firebaseArray(marketsRef);
    $scope.marketsList = markets;

    var newTop10 = new Firebase("https://market-wizard.firebaseio.com/topTen/");
    var top10 = $firebaseArray(newTop10);  // turn Firebase into Array for Angular
    $scope.top10 = top10;

    var userWatchlistRef = new Firebase("https://market-wizard.firebaseio.com/watchlists/" + currentAuth);  // make reference to location of current user's watchlists
    var userWatching = $firebaseArray(userWatchlistRef);
    $scope.userWatchlistRef = userWatching;

    var newtickerData = new Firebase("https://market-wizard.firebaseio.com/tickerData/");
    var tickerData = $firebaseArray(newtickerData);  // turn Firebase into Array for Angular
    $scope.tickerData = tickerData;

    var userScanlistRef = new Firebase("https://market-wizard.firebaseio.com/userScans/" + currentAuth);  // make reference to location of current user's scans
    var userScans = $firebaseArray(userScanlistRef);
    $scope.userScans = userScans;

    data.$loaded()
      .then(function(data) {  // promise
        $scope.data = data[0];
    })
    data2.$loaded()
      .then(function(data2) {  // promise
        $scope.data2 = data2[0];
    })
    scanners.$loaded()
      .then(function(scanners) {  // promise
    })
    markets.$loaded()
      .then(function(markets) {  // promise
        $scope.markets = markets[0];
    })
    sp500.$loaded()
      .then(function(sp500) {  // promise
        $scope.sp500 = sp500[0];
    })
    dj30.$loaded()
      .then(function(dj30) {  // promise
        $scope.dj30 = dj30[0];
    })
    userWatching.$loaded()
      .then(function(userWatching) {  // promise
        $scope.userWatching = userWatching[0];
    })
    userScans.$loaded()
      .then(function(userScans) {  // promise
      $scope.userScans = userScans[0];
    })


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  $scope.marketView = function(marketList) {
    $scope.marketList === marketList;
}


// ++++ CALCULATIONS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  $scope.calc = function(scanners) {
    var marketToScan = null;
    var marketHistoryToScan = null;

// * // BEGIN - DETERMINE WHICH MARKET THE USER WANTS TO SCAN
    if ($scope.marketList.$id === "NASDAQ 100") {
      marketToScan = dataRef2;
      marketHistoryToScan = dataRef;
    } else if ($scope.marketList.$id === "S&P 500") {
      marketToScan = sp500Ref;
      marketHistoryToScan = sp500HistoryRef;
    } else if ($scope.marketList.$id === "DJ 30") {
      marketToScan = dj30Ref;
      marketHistoryToScan = dj30HistoryRef;
    }
// END - DETERMINE WHICH MARKET THE USER WANTS TO SCAN


// * // BEGIN - GRAB DATA FOR CALCULATIONS
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
      }) // END 'SHOULD ALWAYS BE LIMITTOLAST'
    });  // END 'GRAB YESTERDAY'S DATA
  });  // END 'GRAB TODAY'S DATA
// END - GRAB DATA FOR CALCULATIONS


// * // BEGIN - CALCULATIONS ************************************************************

// BEGIN '> 25 & <50 & >1 MIL SHARES AND ADVANCING TODAY' FUNCTION
  if (scanners.$id === ">25 & <50 & >1 mil shrs & advancing") {
    console.log('userOption is ', $scope.$userOption.val());
    newData.remove();  // remove old data

    // PERFORM CALCULATION
    yesterdaysData.forEach(function(object2, i) {  // loop through data

      // place API data in variables
      ticker = todaysData[i].symbol;
      lastPrice = todaysData[i].lastPrice;
      close = todaysData[i].close;
      high = todaysData[i].high;
      low = todaysData[i].low;
      volume = todaysData[i].volume;

      // find relevant stocks
      if (todaysData[i].lastPrice > 25.00 && todaysData[i].lastPrice < 50.00) {
        if (todaysData[i].lastPrice > yesterdaysData[i].close) {
          calculation = todaysData[i].lastPrice - yesterdaysData[i].close;
          calcResult = calculation.toFixed(2);  // round to nearest 100th

          // push information to Firebase
          userData.$add({  // add tickers/information/calculations to Firebase
            ticker: ticker,
            lastPrice: lastPrice,
            close: close,
            high: high,
            low: low,
            volume: volume,
            calculation: calcResult
          });
        }
      }
     $location.path("/data");  // take user to this location
   })  // END 'PERFORM CALCULATION'
  }  // END '> 25 & <50 & >1 MIL SHARES AND DECLINING TODAY' FUNCTION


// BEGIN '> 25 & <50 & >1 MIL SHARES AND ADVANCING TODAY' FUNCTION
  if (scanners.$id === ">25 & <50 & >1 mil shrs & declining") {
    newData.remove();  // remove old data

    // PERFORM CALCULATION
    yesterdaysData.forEach(function(object2, i) {  // loop through data

      // place API data in variables
      ticker = todaysData[i].symbol;
      lastPrice = todaysData[i].lastPrice;
      close = todaysData[i].close;
      high = todaysData[i].high;
      low = todaysData[i].low;
      volume = todaysData[i].volume;

      // find relevant stocks
      if (todaysData[i].lastPrice > 25.00 && todaysData[i].lastPrice < 50.00) {
        if (todaysData[i].lastPrice < yesterdaysData[i].close) {
          calculation = todaysData[i].lastPrice - yesterdaysData[i].close;
          calcResult = calculation.toFixed(2);  // round to nearest 100th

          // push information to Firebase
          userData.$add({  // add tickers/information/calculations to Firebase
            ticker: ticker,
            lastPrice: lastPrice,
            close: close,
            high: high,
            low: low,
            volume: volume,
            calculation: calcResult
          });
        }
      }
     $location.path("/data");  // take user to this location
    })  // END 'PERFORM CALCULATION'
  }  // END '> 25 & <50 & >1 MIL SHARES AND DECLINING TODAY' FUNCTION


// BEGIN '<50 & >1 MIL SHARES AND ADVANCING TODAY' FUNCTION
  if (scanners.$id === "<50 & >1 mil shrs & advancing") {
    newData.remove();  // remove old data

    // PERFORM CALCULATION
    yesterdaysData.forEach(function(object2, i) {  // loop through data

      // place API data in variables
      ticker = todaysData[i].symbol;
      lastPrice = todaysData[i].lastPrice;
      close = todaysData[i].close;
      high = todaysData[i].high;
      low = todaysData[i].low;
      volume = todaysData[i].volume;

      // find relevant stocks
      if (todaysData[i].lastPrice < 50.00) {
          if (todaysData[i].lastPrice > yesterdaysData[i].close) {

            calculation = todaysData[i].lastPrice - yesterdaysData[i].close;
            calcResult = calculation.toFixed(2);  // round to nearest 100th

            // push information to Firebase
            userData.$add({  // add tickers/information/calculations to Firebase
              ticker: ticker,
              lastPrice: lastPrice,
              close: close,
              high: high,
              low: low,
              volume: volume,
              calculation: calcResult
            });
          }
      }
      $location.path("/data");  // take user to this location
    })  // END 'PERFORM CALCULATION'
  }  // END '<50 & >1 MIL SHARES AND ADVANCING TODAY' FUNCTION


// BEGIN '>50 & >750k SHARES AND DECLINING TODAY' FUNCTION
  if (scanners.$id === ">50 & >750k shrs & declining") {
    newData.remove();  // remove old data

    // PERFORM CALCULATION
    yesterdaysData.forEach(function(object2, i) {  // loop through data

      // place API data in variables
      ticker = todaysData[i].symbol;
      lastPrice = todaysData[i].lastPrice;
      close = todaysData[i].close;
      high = todaysData[i].high;
      low = todaysData[i].low;
      volume = todaysData[i].volume;

      // find relevant stocks
      if (todaysData[i].lastPrice > 50.00) {
        if (yesterdaysData[i].volume > 750000) {
          if (todaysData[i].lastPrice < yesterdaysData[i].close) {
            calculation = todaysData[i].lastPrice - yesterdaysData[i].close;
            calcResult = calculation.toFixed(2);  // round to nearest 100th

            // push information to Firebase
            userData.$add({  // add tickers/information/calculations to Firebase
              ticker: ticker,
              lastPrice: lastPrice,
              close: close,
              high: high,
              low: low,
              volume: volume,
              calculation: calcResult
            });
          }
        }
      }
      $location.path("/data");  // take user to this location
    })  // END 'PERFORM CALCULATION'
  }  // END '>50 & >750k SHARES AND DECLINING TODAY' FUNCTION


// BEGIN 'GAP UP' FUNCTION
  if (scanners.$id === "Gap Up") {
    newData.remove();  // remove old data

    // PERFORM CALCULATION
    yesterdaysData.forEach(function(object2, i) {  // loop through data

      // place API data in variables
      ticker = todaysData[i].symbol;
      lastPrice = todaysData[i].lastPrice;
      close = todaysData[i].close;
      high = todaysData[i].high;
      low = todaysData[i].low;
      volume = todaysData[i].volume;

      // find relevant stocks
      if (todaysData[i].low > yesterdaysData[i].high) {

        // push information to Firebase
          userData.$add({  // add tickers/information/calculations to Firebase
            ticker: ticker,
            lastPrice: lastPrice,
            close: close,
            high: high,
            low: low,
            volume: volume,
            calculation: calcResult
          });
        }
      $location.path("/data");  // take user to this location
    })  // END 'PERFORM CALCULATION'
  }  // END 'GAP UP' FUNCTION


// BEGIN 'GAP DOWN' FUNCTION
  if (scanners.$id === "Gap Down") {
    newData.remove();  // remove old data

    // PERFORM CALCULATION
    yesterdaysData.forEach(function(object2, i) {  // loop through data

      // place API data in variables
      ticker = todaysData[i].symbol;
      lastPrice = todaysData[i].lastPrice;
      close = todaysData[i].close;
      high = todaysData[i].high;
      low = todaysData[i].low;
      volume = todaysData[i].volume;

      // find relevant stocks
      if (todaysData[i].high < yesterdaysData[i].low) {
        // push information to Firebase
        userData.$add({  // add tickers/information/calculations to Firebase
          ticker: ticker,
          lastPrice: lastPrice,
          close: close,
          high: high,
          low: low,
          volume: volume,
          calculation: calcResult
        });
      }
      $location.path("/data");  // take user to this location
    })  // END 'PERFORM CALCULATION'
  }  // END 'GAP DOWN' FUNCTION


// BEGIN 'NET CHANGE' FUNCTION
  if (scanners.$id === "Net Change") {
    newData.remove();  // remove old data

    // PERFORM CALCULATION
    yesterdaysData.forEach(function(object2, i) {  // loop through data

      // place API data in variables
      ticker = todaysData[i].symbol;
      lastPrice = todaysData[i].lastPrice;
      close = todaysData[i].close;
      high = todaysData[i].high;
      low = todaysData[i].low;
      volume = todaysData[i].volume;
      ticker = todaysData[i].symbol;
      calculation = todaysData[i].lastPrice - yesterdaysData[i].close;
      calcResult = calculation.toFixed(2);  // round to nearest 100th

        // push information to Firebase
        userData.$add({  // add tickers/information/calculations to Firebase
          ticker: ticker,
          lastPrice: lastPrice,
          close: close,
          high: high,
          low: low,
          volume: volume,
          calculation: calcResult
        });
      $location.path("/data");  // take user to this location
    })  // END 'PERFORM CALCULATION'
  }  // END 'NET CHANGE' FUNCTION


// BEGIN 'TODAY'S ADVANCERS' FUNCTION
  if (scanners.$id === "Today's Advancers") {
    newData.remove();  // remove old data

    // PERFORM CALCULATION
    yesterdaysData.forEach(function(object2, i) {  // loop through data

      // place API data in variables
      ticker = todaysData[i].symbol;
      lastPrice = todaysData[i].lastPrice;
      close = todaysData[i].close;
      high = todaysData[i].high;
      low = todaysData[i].low;
      volume = todaysData[i].volume;
      ticker = todaysData[i].symbol;
      if (todaysData[i].lastPrice > yesterdaysData[i].close) {
        var calculation = (todaysData[i].lastPrice / yesterdaysData[i].close) -1;
        calcResult = calculation.toFixed(3) + "%";  // round to nearest 1000th

        // push information to Firebase
        userData.$add({  // add tickers/information/calculations to Firebase
          ticker: ticker,
          lastPrice: lastPrice,
          close: close,
          high: high,
          low: low,
          volume: volume,
          calculation: calcResult
        });
      }
     $location.path("/data");  // take user to this location
   })  // END 'PERFORM CALCULATION'
 }  // END 'TODAY'S ADVANCERS' FUNCTION


// BEGIN 'TODAY'S DECLINERS' FUNCTION
  if (scanners.$id === "Today's Decliners") {
    newData.remove();  // remove old data

    // PERFORM CALCULATION
    yesterdaysData.forEach(function(object2, i) {  // loop through data

      // place API data in variables
      ticker = todaysData[i].symbol;
      lastPrice = todaysData[i].lastPrice;
      close = todaysData[i].close;
      high = todaysData[i].high;
      low = todaysData[i].low;
      volume = todaysData[i].volume;

      if (todaysData[i].lastPrice < yesterdaysData[i].close) {
        ticker = todaysData[i].symbol;
        var calculation = ((todaysData[i].lastPrice / yesterdaysData[i].close) -1);
        calcResult = calculation.toFixed(3) + "%";  // round to nearest 1000th

        // push information to Firebase
        userData.$add({  // add tickers/information/calculations to Firebase
          ticker: ticker,
          lastPrice: lastPrice,
          close: close,
          high: high,
          low: low,
          volume: volume,
          calculation: calcResult
        });
      }
     $location.path("/data");  // take user to this location
    })  // END 'PERFORM CALCULATION'
  }  // END 'TODAY'S DECLINERS' FUNCTION
}  // END CALC FUNCTION

// * // END - CALCULATIONS ************************************************************


// * BEGIN - USER WATCHLIST FUNCTIONALITY *********************************************

  // ADDS NEW WATCHLIST UNDER USER'S FIREBASE ID
  $scope.newWatchlist = function(addToThisList) {
    var dropWatchlistRef = undefined;
    var watchlistRef = undefined;
    var newTicker = undefined;

    var ref = new Firebase("https://market-wizard.firebaseio.com/");  // reference database
    var currentAuth = ref.getAuth().uid;  // get current user's ID
    var listRef = new Firebase("https://market-wizard.firebaseio.com/watchlists/" + currentAuth);

    var newTicker = {
      "ticker": $scope.addTicker
    };

    if ($scope.watchName != undefined || null || "") {
        watchlistRef = $scope.watchName;  // obtain name of watchlist from input field
        listRef.child(watchlistRef).push(newTicker);  // add ticker to user's chosen watchlist
        $('#addTickerModal').modal('show');
    }
    $scope.addTicker = "";  // clear 'Add Ticker' input field
    $scope.watchName = "";  // clear 'or enter new Watchlist' field
  };

// GET CURRENT USER'S WATCHLISTS
    var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
    var currentAuth = ref.getAuth().uid;  // get current user's ID
    var ref = new Firebase("https://market-wizard.firebaseio.com/watchlists/"  + currentAuth);  // make reference to location of current user's watchlists
    ref.orderByKey().on("child_added", function(snapshot) {
      var userWatchlists = snapshot.key();
      });

// PUT CURRENT USER'S WATCHLISTS' (IN FIREBASE) ON $SCOPE
    var ref = new Firebase("https://market-wizard.firebaseio.com/");  // reference database
    var currentAuth = ref.getAuth().uid;  // get current user's ID
    var watchRef = new Firebase("https://market-wizard.firebaseio.com/watchlists/" + currentAuth); // grab data from Firebase
    var listToWatch = $firebaseArray(watchRef);
    $scope.listToWatch = listToWatch;

// * END - USER WATCHLIST FUNCTIONALITY *********************************************


// * BEGIN - STOCKS FUNCTIONALITY *********************************************

// LIST OF STOCKS (CONTROL INITIAL DISPLAY)
    $scope.predicate = 'lastPrice';  // initially, list is sorted by 'last price'
    $scope.reverse = true;  // for sort functionality
    $scope.order = function(predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;  // sort functionality - Note ternary operator for if/then functionality
      $scope.predicate = predicate;
    };


// ADDS NEW TICKER TO USER'S CHOSEN WATCHLIST
  $scope.newTicker = function(addToThisList) {
    var dropWatchlistRef = undefined;
    var watchlistRef = undefined;
    var newTicker = undefined;

    var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
    var currentAuth = ref.getAuth().uid;  // get current user's ID
    var listRef = new Firebase("https://market-wizard.firebaseio.com/watchlists/" + currentAuth);

    var newTicker = {
      "ticker": $scope.addTicker
    };

    if ($scope.addTicker === undefined || null || "") {
        alert("Enter ticker to be added to watchlist.");
    } else if ($scope.addToThisList.$id != undefined || null || "") {
        dropWatchlistRef = $scope.addToThisList.$id;  // obtain name of watchlist from dropdown
        listRef.child(dropWatchlistRef).push(newTicker);  // add ticker to user's chosen watchlist
        $('#addTickerModal').modal('show');
    }
    $scope.addTicker = "";  // clear 'Add Ticker' input field
    $scope.addToThisList = "";  // clear watchlist dropdown
};

// PUT 'STOCKS' (IN FIREBASE) ON $SCOPE
    var stocksRef = new Firebase("https://market-wizard.firebaseio.com/stocks/"); // grab data from Firebase
    var stocks = $firebaseArray(stocksRef);
    $scope.stocks = stocks;

// GET CURRENT USER'S STOCKS FROM CHOSEN WATCHLIST:
    var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
    var currentAuth = ref.getAuth().uid;  // get current user's ID
    var stocksRef = new Firebase("https://market-wizard.firebaseio.com/watchlists/"  + currentAuth);  // make reference to location of current user's watchlists
    var userStocks = $firebaseArray(stocksRef);

    userStocks.$loaded()
    .then(function(userStocks) {  // promise
      $scope.userStocks = userStocks;
    });

// * END - STOCKS FUNCTIONALITY *********************************************


// * BEGIN - DATA UPDATES ***************************************************

// AUTOMATICALLY RETRIEVE NASDAQ-100 MARKET EOD DATA AT 6:15 P.M MONDAY-FRIDAY AND ALERT USER OF SUCCESSFUL UPDATE
// setInterval(function () {  // a callback function after the specified time interval
//   var timer = ( function() {
//       var date = new Date();
//       var day = date.getDay();
//       var hour = date.getHours();
//       var minutes = date.getMinutes();
//       // console.log("Date", date);
//       // console.log("day of week is", day);
//       // console.log("hour is", hour);
//       // console.log("minutes is", minutes);

//   if ((day === 1 || day === 2 || day === 3 || day === 4 || day === 5) && hour === 18 && minutes === 15) {
//     console.log("inside update function");
//     $http({
//     method: 'GET',
//     url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=AAL,AAPL,ADBE,ADI,ADP,ADSK,AKAM,ALXN,AMAT,AMGN,AMZN,ATVI,AVGO,BBBY,BIDU,BIIB,BMRN,CA,CELG,CERN,CHKP,CHRW,CHTR,CMCSA,CMCSK,COST,CSCO,CTSH,CTXS,DISCA,DISCK,DISH,DLR,EA,EBAY,ESRX,EXPD,EXPE,FAST,FB,FISV,FOX,FOXA,GILD,GMCR,GOOG,GOOGL,GRMN,HSIC,INCY,INTC,INTU,ILMN,ISRG,JD,KLAC,KHC,LBTYA,LBTYK,LILA,LILAK,LLTC,LMCA,LRCX,LVNTA,MAR,MAT,MDLZ,MNST,MSFT,MU,MYL,NFLX,NTAP,NVDA,NXPI,ORLY,PAYX,PCAR,PCLN,PYPL,QCOM,QVCA,REGN,ROST,SBAC,SBUX,SIRI,SNDK,SPLS,SRCL,STX,SWKS,SYMC,TSCO,TSLA,TRIP,TXN,VIAB,VIP,VOD,VRSK,VRTX,WBA,WDC,WFM,WYNN,XLNX,YHOO'
//   }).then(function successCallback(response) {
//       // this callback will be called asynchronously
//       // when the response is available
//       console.log("successful response from update", response.data.results);

//       var dataRef = new Firebase("https://market-wizard.firebaseio.com/data");  //  make reference to database location for data to be stored

//       dataRef.push(response.data.results);
//       alert("Today's EOD market data successfully imported.");
//     }, function errorCallback(response) {  // called asynchronously if an error occurs
//                                           // or server returns response with an error status.
//     });
//   }
//     })();
// }, 60000)


// EOD UPDATE FOR ALL MARKETS!!
// AUTOMATICALLY RETRIEVE NASDAQ-100, S&P-500, AND DJ-30 MARKET EOD DATA AT 6:15 P.M MONDAY-FRIDAY AND ALERT USER OF SUCCESSFUL UPDATE
setInterval(function () {  // a callback function after the specified time interval
  // if (loginStatus === true) {  // if user is logged in

    var timer = ( function() {
      var date = new Date();
      var day = date.getDay();
      var hour = date.getHours();
      var minutes = date.getMinutes();

      if ((day === 1 || day === 2 || day === 3 || day === 4 || day === 5) && hour === 18 && minutes === 15) {
        console.log("inside update function");
        // UPDATE NASDAQ-100
        $http({
        method: 'GET',
        url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=AAL,AAPL,ADBE,ADI,ADP,ADSK,AKAM,ALXN,AMAT,AMGN,AMZN,ATVI,AVGO,BBBY,BIDU,BIIB,BMRN,CA,CELG,CERN,CHKP,CHRW,CHTR,CMCSA,CMCSK,COST,CSCO,CTSH,CTXS,DISCA,DISCK,DISH,DLR,EA,EBAY,ESRX,EXPD,EXPE,FAST,FB,FISV,FOX,FOXA,GILD,GMCR,GOOG,GOOGL,GRMN,HSIC,INCY,INTC,INTU,ILMN,ISRG,JD,KLAC,KHC,LBTYA,LBTYK,LILA,LILAK,LLTC,LMCA,LRCX,LVNTA,MAR,MAT,MDLZ,MNST,MSFT,MU,MYL,NFLX,NTAP,NVDA,NXPI,ORLY,PAYX,PCAR,PCLN,PYPL,QCOM,QVCA,REGN,ROST,SBAC,SBUX,SIRI,SNDK,SPLS,SRCL,STX,SWKS,SYMC,TSCO,TSLA,TRIP,TXN,VIAB,VIP,VOD,VRSK,VRTX,WBA,WDC,WFM,WYNN,XLNX,YHOO'
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log("NASDAQ-100 successfully updated", response.data.results);

          var dataRef = new Firebase("https://market-wizard.firebaseio.com/data");  //  make reference to database location for data to be stored

          dataRef.push(response.data.results);
        })
        .then
        // UPDATE S&P-500
          // get first 100 s&p-500 tickers
          $http({
          method: 'GET',
          url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=A,AA,AAL,AAP,AAPL,ABBV,ABC,ABT,ACE,ACN,ADBE,ADI,ADM,ADP,ADS,ADSK,ADT,AEE,AEP,AES,AET,AFL,AGN,AIG,AIV,AIZ,AKAM,ALL,ALLE,ALTR,ALXN,AMAT,AME,AMG,AMGN,AMP,AMT,AMZN,AN,ANTM,AON,APA,APC,APD,APH,ARG,ATVI,AVB,AVGO,AVY,AXP,AZO,BA,BAC,BAX,BBBY,BBT,BBY,BCR,BDX,BEN,BF.B,BHI,BIIB,BK,BLK,BLL,BMY,BRCM,BRK.B,BSX,BWA,BXLT,BXP,C,CA,CAG,CAH,CAM,CAT,CB,CBG,CBS,CCE,CCI,CCL,CELG,CERN,CF,CHK,CHRW,CI,CINF,CL,CLX,CMA,CMCSA,CMCSK,CME,CMG'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("S&P-500 api call#1 successful", response.data.results);
            var dataRef = new Firebase("https://market-wizard.firebaseio.com/sp500");  //  make reference to database location for data to be stored
            dataRef.push(response.data.results);
          })
        .then // get next 100 s&p-500 tickers (101-200)
          $http({
          method: 'GET',
          url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=CMI,CMS,CNP,CNX,COF,COG,COH,COL,COP,COST,CPB,CPGX,CRM,CSC,CSCO,CSRA,CSX,CTAS,CTL,CTSH,CTXS,CVC,CVS,CVX,D,DAL,DD,DE,DFS,DG,DGX,DHI,DHR,DIS,DISCA,DISCK,DLPH,DLTR,DNB,DO,DOV,DOW,DPS,DRI,DTE,DUK,DVA,DVN,EA,EBAY,ECL,ED,EFX,EIX,EL,EMC,EMN,EMR,ENDP,EOG,EQIX,EQR,EQT,ES,ESRX,ESS,ESV,ETFC,ETN,ETR,EW,EXC,EXPD,EXPE,F,FAST,FB,FCX,FDX,FE,FFIV,FIS,FISV,FITB,FLIR,FLR,FLS,FMC,FOSL,FOX,FOXA,FSLR,FTI,FTR,GAS,GD,GE,GGP,GILD,GIS'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("S&P-500 api call#2 successful", response.data.results);
            var dataRef = new Firebase("https://market-wizard.firebaseio.com/sp500");  //  make reference to database location for data to be stored
            dataRef.push(response.data.results);
        }).then // get next 100 s&p-500 tickers (201-300)
          $http({
          method: 'GET',
          url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=GLW,GM,GMCR,GME,GOOG,GOOGL,GPC,GPS,GRMN,GS,GT,GWW,HAL,HAR,HAS,HBAN,HBI,HCA,HCN,HCP,HD,HES,HIG,HOG,HON,HOT,HP,HPE,HPQ,HRB,HRL,HRS,HSIC,HST,HSY,HUM,IBM,ICE,IFF,ILMN,INTC,INTU,IP,IPG,IR,IRM,ISRG,ITW,IVZ,JBHT,JCI,JEC,JNJ,JNPR,JPM,JWN,K,KEY,KHC,KIM,KLAC,KMB,KMI,KMX,KO,KORS,KR,KSS,KSU,L,LB,LEG,LEN,LH,LLL,LLTC,LLY,LM,LMT,LNC,LOW,LRCX,LUK,LUV,LVLT,LYB,M,MA,MAC,MAR,MAS,MAT,MCD,MCHP,MCK,MCO,MDLZ,MDT,MET,MHFI'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("S&P-500 api call#3 successful", response.data.results);
            var dataRef = new Firebase("https://market-wizard.firebaseio.com/sp500");  //  make reference to database location for data to be stored
            dataRef.push(response.data.results);
        }).then // get next 100 s&p-500 tickers (301-400)
          $http({
          method: 'GET',
          url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=MHK,MJN,MKC,MLM,MMC,MMM,MNK,MNST,MO,MON,MOS,MPC,MRK,MRO,MS,MSFT,MSI,MTB,MU,MUR,MYL,NAVI,NBL,NDAQ,NEE,NEM,NFLX,NFX,NI,NKE,NLSN,NOC,NOV,NRG,NSC,NTAP,NTRS,NUE,NVDA,NWL,NWS,NWSA,O,OI,OKE,OMC,ORCL,ORLY,OXY,PAYX,PBCT,PBI,PCAR,PCG,PCL,PCLN,PCP,PDCO,PEG,PEP,PFE,PFG,PG,PGR,PH,PHM,PKI,PLD,PM,PNC,PNR,PNW,POM,PPG,PPL,PRGO,PRU,PSA,PSX,PVH,PWR,PX,PXD,PYPL,QCOM,QRVO,R,RAI,RCL,REGN,RF,RHI,RHT,RIG,RL,ROK,ROP,ROST,RRC,RSG'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("S&P-500 api call#4 successful", response.data.results);
            var dataRef = new Firebase("https://market-wizard.firebaseio.com/sp500");  //  make reference to database location for data to be stored
            dataRef.push(response.data.results);
        }).then // get next 100 s&p-500 tickers (401-500)
          $http({
          method: 'GET',
          url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=RTN,SBUX,SCG,SCHW,SE,SEE,SHW,SIG,SJM,SLB,SLG,SNA,SNDK,SNI,SO,SPG,SPLS,SRCL,SRE,STI,STJ,STT,STX,STZ,SWK,SWKS,SWN,SYF,SYK,SYMC,SYY,T,TAP,TDC,TE,TEL,TGNA,TGT,THC,TIF,TJX,TMK,TMO,TRIP,TROW,TRV,TSCO,TSN,TSO,TSS,TWC,TWX,TXN,TXT,TYC,UA,UAL,UHS,UNH,UNM,UNP,UPS,URBN,URI,USB,UTX,V,VAR,VFC,VIAB,VLO,VMC,VNO,VRSK,VRSN,VRTX,VTR,VZ,WAT,WBA,WDC,WEC,WFC,WFM,WHR,WM,WMB,WMT,WRK,WU,WY,WYN,WYNN,XEC,XEL,XL,XLNX,XOM,XRAY,XRX'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("S&P-500 api call#5 successful", response.data.results);
            var dataRef = new Firebase("https://market-wizard.firebaseio.com/sp500");  //  make reference to database location for data to be stored
            dataRef.push(response.data.results);
        }).then // get any remaining s&p-500 tickers (often a few more than 500 in index)
          $http({
          method: 'GET',
          url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=XYL,YHOO,YUM,ZBH,ZION,ZTS'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("S&P-500 api call#6 successful", response.data.results);
            var dataRef = new Firebase("https://market-wizard.firebaseio.com/sp500");  //  make reference to database location for data to be stored
            dataRef.push(response.data.results);
        }).then
        // UPDATE DOW-JONES-30
          $http({
          method: 'GET',
          url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=AAPL,AXP,BA,CAT,CSCO,CVX,DD,DIS,GE,GS,HD,IBM,INTC,JNJ,JPM,KO,MCD,MMM,MRK,MSFT,NKE,PFE,PG,TRV,UNH,UTX,V,VZ,WMT,XOM'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("DJ-30 successfully updated", response.data.results);
            var dataRef = new Firebase("https://market-wizard.firebaseio.com/dj30");  //  make reference to database location for data to be stored
            dataRef.push(response.data.results);
            // alert("Today's EOD market data successfully imported.");
            $('#nightlyUpdateModal').modal('show');
          }, function errorCallback(response) {  // called asynchronously if an error occurs
                                                // or server returns response with an error status.
          });
      }  //  end of 'if' statement
    })();  // end of 'timer' IIFE
  // }  // end of 'if loginStatus === true'
}, 60000)  // end of 'setInterval'


// LIVE UPDATE!!
// ---> AUTOMATICALLY RETRIEVE NASDAQ-100 DATA EVERY 15 SECONDS DURING TRADING HOURS
setInterval(function () {  // a callback function after the specified time interval
  if (loginStatus === true) {  // if user is logged in

    var timer = ( function() {
      var date = new Date();
      var day = date.getDay();
      var hour = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();

        if ((day === 1 || day === 2 || day === 3 || day === 4 || day === 5) && (hour > 8)) {
          console.log("inside update function");
          // UPDATE NASDAQ-100
          $http({
          method: 'GET',
          url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=AAL,AAPL,ADBE,ADI,ADP,ADSK,AKAM,ALXN,AMAT,AMGN,AMZN,ATVI,AVGO,BBBY,BIDU,BIIB,BMRN,CA,CELG,CERN,CHKP,CHRW,CHTR,CMCSA,CMCSK,COST,CSCO,CTSH,CTXS,DISCA,DISCK,DISH,DLR,EA,EBAY,ESRX,EXPD,EXPE,FAST,FB,FISV,FOX,FOXA,GILD,GMCR,GOOG,GOOGL,GRMN,HSIC,INCY,INTC,INTU,ILMN,ISRG,JD,KLAC,KHC,LBTYA,LBTYK,LILA,LILAK,LLTC,LMCA,LRCX,LVNTA,MAR,MAT,MDLZ,MNST,MSFT,MU,MYL,NFLX,NTAP,NVDA,NXPI,ORLY,PAYX,PCAR,PCLN,PYPL,QCOM,QVCA,REGN,ROST,SBAC,SBUX,SIRI,SNDK,SPLS,SRCL,STX,SWKS,SYMC,TSCO,TSLA,TRIP,TXN,VIAB,VIP,VOD,VRSK,VRTX,WBA,WDC,WFM,WYNN,XLNX,YHOO'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            // console.log("successful response from update", response.data.results);

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
            // $('#userDataUpdateModal').modal('show');
          }, function errorCallback(response) {  // called asynchronously if an error occurs
                                                // or server returns response with an error status.
          });
            // clock that updates DOM to show time of last real-time update
            hour = ((hour + 11) % 12 + 1);  // convert military time to 12-hour time
            minutes = minutes > 9 ? minutes : '0' + minutes;  // ternary operator for if/then functionality to prepend with a '0' if less than '10'
            seconds = seconds > 9 ? seconds : '0' + seconds;  // ternary operator for if/then functionality to prepend with a '0' if less than '10'
            var newTime = hour + ":" + minutes + ":" + seconds;

            $("#updateTime").html(newTime);  // Replace contents in DOM element

                // color flash when time of last update appears
                $("#updateTime").removeClass("colorFlash");
                setTimeout(function() {
                    $("#updateTime").addClass("colorFlash");
                }, 1);

          } else {
            $("#updateTime").html("Market Closed <br> EOD update at 6:15 CST");  // Replace contents in DOM element
        }  //  end of 'if' statement
    })();  // end of 'timer' IIFE
  }  // end of 'if loginStatus === true'
}, 10000)  // end of 'setInterval'


// USER'S AT-WILL UPDATE (no longer used)
// ++++++ UPDATE DATA VIA AN API CALL ON USER CLICK OF 'UPDATE' ++++++++++++++++++++++++++++++
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
      $('#userDataUpdateModal').modal('show');
    }, function errorCallback(response) {  // called asynchronously if an error occurs
                                          // or server returns response with an error status.
    });
  }

// * END - DATA UPDATES ***************************************************


// * BEGIN - 'FIND MATCHING TICKER' ******************************
  newtickerData.remove();  // remove old data on page load so it doesn't display until user clicks a ticker

  $scope.getTickerData = function(stockTicker, watchList) {
    newtickerData.remove();  // remove old data

    // GET CURRENT USER'S STOCKS FROM CHOSEN WATCHLIST
    var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
    var currentAuth = ref.getAuth().uid;  // get current user's ID
    var stocksRef = new Firebase("https://market-wizard.firebaseio.com/watchlists/" + currentAuth);  // make reference to location of current user's watchlists
    var userStocks = $firebaseArray(stocksRef);

    userStocks.$loaded()
    .then(function(userStocks) {  // promise
      $scope.userStocks = userStocks;
    });

    //  LOCATE USER'S WATCHLIST CHOICE IN FIREBASE
    for (var i = 0; i < listToWatch.length; i++) {  // loop through user's watchlists stored in Firebase
      if (listToWatch[i].$id === watchList.$id) {  // if Firebase watchlist equals dropdown choice
        }
      }

    // LOCATE USER'S TICKER CHOICE
    // angular.forEach(watchList, function(element, key) {  // loop over Firebase list
      // console.log(key);
      // console.log(watchList[key].ticker);
      // if (watchList[key].ticker === stockTicker) {
        // console.log("guess what? Found", stockTicker);
        // console.log(watchList[key]);
        // tickerChosen = watchList[key].ticker;
        // console.log("chosen ticker and its key=", tickerChosen + " " + key);
        // watchList[i].remove();
        // return;
      // }

    // angular.forEach(watchList, function(element, i) {  // loop over Firebase list
    //   console.log(i);
    //   console.log(watchList[i].ticker);
    //   if (watchList[i].ticker === stockTicker) {
    //     console.log("guess what? Found", stockTicker);
    //     console.log(watchList[i]);
    //     tickerChosen = watchList[i].ticker;
    //     console.log("chosen ticker =", tickerChosen);
    //   }

    // })

    //  GRAB TODAY'S DATA
    dataRef2.once("value", function(snapshot) {
      dataRef2.orderByChild("symbol").on("child_added", function(snapshot2) {
        var key = snapshot2.key();  // key is the unique ID of each day's data
        var childData2 = snapshot2.val();  // childData2 is contents of the child
        $scope.childData2 = childData2;
        todaysData = $scope.childData2;
      })
    })
    // * SHOULD ALWAYS BE 'LIMITTOLAST' TO GET LATEST DATA
    dataRef.orderByChild("symbol").limitToLast(1).on("child_added", function(snapshot3) {
      var key = snapshot3.key();  // key is the unique ID of each day's data
      var childData3 = snapshot3.val();  // childData is contents of the child
      childData3 = childData3;
      yesterdaysData = childData3;

      // MOVE LATEST DATA INTO VARIABLES
      todaysData.forEach(function(object2, i) {  // loop through data that will be referenced/matched
        // PLACE API DATA IN VARIABLES
        ticker = todaysData[i].symbol;
        lastPrice = todaysData[i].lastPrice;
        close = todaysData[i].close;
        high = todaysData[i].high;
        low = todaysData[i].low;
        volume = todaysData[i].volume;
        // console.log(i + ". " + ticker + " = " + lastPrice);

        // LOCATE IN FIREBASE, USER'S TICKER WHICH WAS CLICKED ON
        if (ticker === stockTicker) {
          // push information to Firebase
          tickerData.$add({  // add tickers/information/calculations to Firebase
            ticker: ticker,
            lastPrice: lastPrice,
            close: close,
            high: high,
            low: low,
            volume: volume
          });
        }
      })
    })
  }
// * END - 'FIND MATCHING TICKER' ******************************


// * BEGIN - DELETE TICKER FROM USER'S WATCHLIST ********************
    $scope.removeItem = function (thing) {
    var userListRef = new Firebase("https://market-wizard.firebaseio.com/watchlists/" + currentAuth + "/BUY/");  // make reference to location of current user's watchlists
    var watchTicks = $firebaseArray(userListRef);
      // console.log(thing.ticker);  // log ticker
      userListRef.$remove(thing);

      var tickerToDelete = thing.ticker;

      userListRef.orderByChild("ticker").on("child_added", function(snapshot) {  // snapshot of user's chosen watchlist
        var watchlistTicker = snapshot.val().ticker;
        var tickerKey = snapshot.key();

          if (snapshot.val().ticker === tickerToDelete) {
            console.log("Found " + watchlistTicker + " and its key... " + tickerKey);
            userListRef = userListRef + tickerKey;
            console.log(thing);
            console.log(snapshot.val());
            console.log(tickerKey);

            userListRef.$remove(thing);
            // watchTicks.$remove(thing);


            // userWatchlistRef.child(tickerKey).$remove();  // GOOD UNTIL HERE!!!! DO NOT change code above!!!!!
            // userWatchlistRef.child().$remove(tickerKey);
            // userWatchlistRef.$remove(tickerKey);

            // userWatchlistRef.child(thing).$remove();
            // userWatchlistRef.child().$remove(thing);
            // userWatchlistRef.$remove(thing);
          }
      });
    };


  $scope.deleteTicker = function(stockTicker, watchList) {
    // console.log("from 'deleteTicker' function", watchList);
    console.log(stockTicker);
    console.log("all of user's watchlists", listToWatch);  // log all of user's watchlists
    console.log("user's dropdown choice", watchList.$id);  // log user's dropdown choice

// var userWatchlistRef = new Firebase("https://market-wizard.firebaseio.com/watchlists/"  + currentAuth);
// // userWatchlistRef.on("child_added", function(snapshot) {
// userWatchlistRef.orderByChild("ticker").on("child_added", function(snapshot2) {
// var key = snapshot2.key();
// var childData2 = snapshot2.val();  // childData2 is contents of the child
// $scope.childData2 = childData2;
// todaysData = $scope.childData2;
// console.log(todaysData);
// })
// // })

    for (var i = 0; i < listToWatch.length; i++) {  // loop through user's watchlists stored in Firebase
      if (listToWatch[i].$id === watchList.$id) {  // if Firebase watchlist equals dropdown choice
        console.log("accessed Firebase watchlist is", listToWatch[i].$id); // log successful access to chosen watclist in Firebase
        console.log("contents of", listToWatch[i].$id, "is", listToWatch[i]); // log chosen watchlist object
        console.log("ticker to delete is", stockTicker);
        var tickToRemove = stockTicker;
        // listToWatch[i].$id.remove();

          // for (var i = 0; i < 2; i++) {
            // console.log("inside for-loop in deleteTicker");
            // console.log(listToWatch[i].$id);
            // console.log(listToWatch[i].ticker); // returns 'undefined'
            // watchListID.$id.$remove(stockTicker);
            // $scope.listToWatch.$remove(stockTicker.ticker);
          // }
        }
      }

    //       for (var i = 0; i < listToWatch.length; i++) {
    //   if (listToWatch[i] === watchList.$id) {
    //     console.log("chosen watchlist is", listToWatch[i]);
    //     // watchList[i].$remove();
    //   }
    // }
    // console.log("from 'deleteTicker' function", watchList.$id);
    // console.log("stock.ticker", stock.ticker);
    // console.log(stock.ticker, " to be deleted");

    angular.forEach(watchList, function(element, i) {  // loop over Firebase list
      console.log(i);
      console.log(watchList[i].ticker);
      if (watchList[i].ticker === stockTicker) {
        console.log("guess what? Found", stockTicker);
        console.log(watchList[i]);
        tickerChosen = watchList[i].ticker;
        console.log("chosen ticker =", tickerChosen);
        // watchList[i].remove();
      }

      // console.log(data2);

    // angular.forEach(watchList, function(element, i) {  // loop over Firebase list
    //   console.log(i);
    //   console.log(watchList[i].ticker);
    //   if (watchList[i].ticker === stockTicker) {
    //     console.log("guess what? Found", stockTicker);
    //     console.log(watchList[i]);
    //     tickerChosen = watchList[i].ticker;
    //     console.log("chosen ticker =", tickerChosen);
    //   }

    })


    // angular.forEach(data2, function(element, i) {  // loop over Firebase list
    //   console.log("x times");
    //   console.log(data2[i].symbol);
    //   if (data2[i].symbol === stockTicker) {
    //     console.log("guess what? Found", stockTicker);
    //     watchList[i].remove();
    //   }

    // })
  }

// * END - DELETE TICKER FROM USER'S WATCHLIST ********************


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



// ++++++ USER-DEFINED SCAN FUNCTIONALITY ++++++++++++++++++++++++++++++++++++++++++++++++++++
  // ADDS NEW SCAN NAME UNDER USER'S FIREBASE ID
  $scope.newScanModal = function() {
    $('#writeScanModal').modal('show');
  }

  $(function () { $('#writeScanModal').on('hide.bs.modal', function () {
    var newScan = null;
    var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
    var currentAuth = ref.getAuth().uid;  // get current user's ID
    var listRef = new Firebase("https://market-wizard.firebaseio.com/userScans/" + currentAuth);

    var newScan = {
      "price1": $scope.addPrice1,
      "price2": $scope.addPrice2
    };

    if ($scope.scanName != undefined || null || "") {
        scanName = $scope.scanName;  // obtain name of new scan from input field
        listRef.child(scanName).push(newScan);  // add scan name to user's list of scan names
        $('#addScanModal').modal('show'); // NEED TO ADD MODAL
    }
    $scope.scanName = "";  // clear 'or enter new Watchlist' field
    })
  });

  var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
  var currentAuth = ref.getAuth().uid;  // get current user's ID
  var userScanlistRef = new Firebase("https://market-wizard.firebaseio.com/userScans/" + currentAuth);  // make reference to location of current user's scans
  var userScanList = $firebaseArray(userScanlistRef);
  $scope.userScanList = userScanList;


}  // END OF APP.CONTROLLER FUNCTION -> (all functionality goes inside this function)
]);
