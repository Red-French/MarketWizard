app.controller('masterListCtrl', ["$scope", "$http", "$q", "$firebaseArray",  "$location",
  function($scope, $http, $q, $firebaseArray, $location) {

  $scope.searchText = "";

// +++++ CHECK AND LOG USER'S CURRENT AUTHENTICATION STATE +++++++++++++++++++++
  // set 'Chart' button's 'display' property to 'none' if user logged out
  // set a authentication flag ('loginStaus') for use elsewhere

var ref = new Firebase("https://market-wizard.firebaseio.com");
var loginStatus = false;
ref.onAuth(authCallback);
  function authCallback(authData) {
    // Do not show 'chart' modal or ticker boards if user is logged out
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

    var naz100HistoryRef = new Firebase("https://market-wizard.firebaseio.com/NAZ100_Historical"); // reference S&P-100 Historical Data
    var naz100History = $firebaseArray(naz100HistoryRef);

    var sp100HistoryRef = new Firebase("https://market-wizard.firebaseio.com/SP100_Historical"); // reference S&P-100 Historical Data
    var sp100History = $firebaseArray(sp100HistoryRef);
    var sp100Ref = new Firebase("https://market-wizard.firebaseio.com/sp100"); // reference S&P-100 Today's Data
    var sp100 = $firebaseArray(sp100Ref);

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
    $scope.allUserScans = userScans;

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
    sp100.$loaded()
      .then(function(sp100) {  // promise
        $scope.sp100 = sp100[0];
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

// ++++ CALCULATION FUNCTIONALITY ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// * // BEGIN - GRAB DATA FOR CALCULATIONS
  function obtainData() {
    var date = new Date();
    var day = date.getDay();
    var hour = date.getHours();
    var minutes = date.getMinutes();

    var now = new Date();
    var openTime = new Date();
    var closeTime = new Date();
    openTime.setHours(8); openTime.setMinutes(29);  // 1 minute before market open
    closeTime.setHours(18); closeTime.setMinutes(14);  // 1 minute before nightly auto-update
    // console.log(now, closeTime, now.getTime() >= closeTime.getTime());

    var marketToScan = null;
    var marketHistoryToScan = null;

    // * // BEGIN - DETERMINE WHICH MARKET THE USER WANTS TO SCAN
    if ($scope.marketList.$id === "NASDAQ 100 ~live data~") {  // scan NASDAQ-100
      if ((day === 1 || day === 2 || day === 3 || day === 4 || day === 5) && ((now.getTime() > openTime.getTime()) && (now.getTime() < closeTime.getTime()))) {  // if regular market hours
        marketToScan = dataRef2;  // scan NASDAQ-100
        marketHistoryToScan = dataRef;  // vs yesterday's closing data
      } else {  // else it is after regular market hours
        marketToScan = dataRef2;  // scan NASDAQ-100
        marketHistoryToScan = naz100HistoryRef;  // vs yesterday's closing data
      }
    } else if ($scope.marketList.$id === "S&P 100") {
        marketToScan = sp100Ref;  // scan S&P-100
        marketHistoryToScan = sp100HistoryRef;  // vs yesterday's closing data
    } else if ($scope.marketList.$id === "DJ 30") {
        marketToScan = dj30Ref;  // scan DJ-30
        marketHistoryToScan = dj30HistoryRef;  // vs yesterday's closing data
    }
    // END - DETERMINE WHICH MARKET THE USER WANTS TO SCAN

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

      // * SHOULD ALWAYS BE 'LIMITTOLAST' TO COMPARE PRIOR DATA TO LATEST DATA
        marketHistoryToScan.orderByChild("symbol").limitToLast(1).on("child_added", function(snapshot3) {
          var key = snapshot3.key();  // key is the unique ID of each day's data
          var childData3 = snapshot3.val();  // childData is contents of the child
          yesterdaysData = childData3;
        }) // END 'SHOULD ALWAYS BE LIMITTOLAST'
      });  // END 'GRAB YESTERDAY'S DATA
    });  // END 'GRAB TODAY'S DATA
  }
// END - GRAB DATA FOR CALCULATIONS


// * // BEGIN - CALCULATIONS ************************************************************

  $scope.calc = function(scanners) {

// BEGIN '> 25 & <50 & >1 MIL SHARES AND ADVANCING TODAY' FUNCTION
  if (scanners.$id === ">25 & <50 & >1 mil shrs & advancing") {
    obtainData();
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
        if (yesterdaysData[i].volume > 1000000) {
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
      }
     $('#cntrlPanel').hide().show(0);  // force re-render (due to Chrome not rendering correctly at times)
   })  // END 'PERFORM CALCULATION'
 }  // END '> 25 & <50 & >1 MIL SHARES AND ADVANCING TODAY' FUNCTION


// BEGIN '> 25 & <50 & >1 MIL SHARES AND DECLINING TODAY' FUNCTION
  if (scanners.$id === ">25 & <50 & >1 mil shrs & declining") {
    obtainData();
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
        if (yesterdaysData[i].volume > 1000000) {
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
     $('#cntrlPanel').hide().show(0);  // force re-render (due to Chrome not rendering correctly at times)
    })  // END 'PERFORM CALCULATION'
  }  // END '> 25 & <50 & >1 MIL SHARES AND DECLINING TODAY' FUNCTION


// BEGIN '<50 & >1 MIL SHARES AND ADVANCING TODAY' FUNCTION
  if (scanners.$id === "<50 & >1 mil shrs & advancing") {
    obtainData();
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
        if (yesterdaysData[i].volume > 1000000) {
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
      }
      $('#cntrlPanel').hide().show(0);  // force re-render (due to Chrome not rendering correctly at times)
    })  // END 'PERFORM CALCULATION'
  }  // END '<50 & >1 MIL SHARES AND ADVANCING TODAY' FUNCTION


// BEGIN '>50 & >750k SHARES AND DECLINING TODAY' FUNCTION
  if (scanners.$id === ">50 & >750k shrs & declining") {
    obtainData();
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
      $('#cntrlPanel').hide().show(0);  // force re-render (due to Chrome not rendering correctly at times)
    })  // END 'PERFORM CALCULATION'
  }  // END '>50 & >750k SHARES AND DECLINING TODAY' FUNCTION


// BEGIN 'GAP UP' FUNCTION
  if (scanners.$id === "Gap Up") {
    obtainData();
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
      $('#cntrlPanel').hide().show(0);  // force re-render (due to Chrome not rendering correctly at times)
    })  // END 'PERFORM CALCULATION'
  }  // END 'GAP UP' FUNCTION


// BEGIN 'GAP DOWN' FUNCTION
  if (scanners.$id === "Gap Down") {
    obtainData();
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
      $('#cntrlPanel').hide().show(0);  // force re-render (due to Chrome not rendering correctly at times)
    })  // END 'PERFORM CALCULATION'
  }  // END 'GAP DOWN' FUNCTION


// BEGIN 'NET CHANGE' FUNCTION
  if (scanners.$id === "Net Change") {
    obtainData();
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
      $('#cntrlPanel').hide().show(0);  // force re-render (due to Chrome not rendering correctly at times)
    })  // END 'PERFORM CALCULATION'
  }  // END 'NET CHANGE' FUNCTION


// BEGIN 'TODAY'S ADVANCERS' FUNCTION
  if (scanners.$id === "Today's Advancers") {
    obtainData();
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
        calculation = calculation * 100;
        calcResult = calculation.toFixed(2) + "%";  // round to nearest 1000th

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
     $('#cntrlPanel').hide().show(0);  // force re-render (due to Chrome not rendering correctly at times)
   })  // END 'PERFORM CALCULATION'
 }  // END 'TODAY'S ADVANCERS' FUNCTION


// BEGIN 'TODAY'S DECLINERS' FUNCTION
  if (scanners.$id === "Today's Decliners") {
    obtainData();
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
        calculation = calculation * 100;
        calcResult = calculation.toFixed(2) + "%";  // round to nearest 1000th

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
     $('#cntrlPanel').hide().show(0);  // force re-render (due to Chrome not rendering correctly at times)
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
    var cappedTicker = $scope.addTicker.toUpperCase();
    var newTicker = {
      "ticker": cappedTicker
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
    var cappedTicker = $scope.addTicker.toUpperCase();
    var newTicker = {
      "ticker": cappedTicker
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
// EOD UPDATE FOR ALL MARKETS
// AUTOMATICALLY RETRIEVE NASDAQ-100, S&P-100, AND DJ-30 MARKET EOD DATA AT 6:15 P.M MONDAY-FRIDAY AND ALERT USER OF SUCCESSFUL UPDATE
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
        url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=AAL,AAPL,ADBE,ADI,ADP,ADSK,AKAM,ALXN,AMAT,AMGN,AMZN,ATVI,AVGO,BBBY,BIDU,BIIB,BMRN,CA,CELG,CERN,CHKP,CHTR,COST,CSCO,CSX,CTRP,CTSH,CTXS,DISH,DLTR,EA,EBAY,ENDP,ESRX,EXPE,FAST,FB,FISV,FOX,FOXA,GILD,GOOG,GOOGL,ILMN,INCY,INTC,INTU,ISRG,JD,KHC,LLTC,LMCA,LMCK,LRCX,LVNTA,MAR,MAT,MDLZ,MNST,MSFT,MU,MXIM,MYL,NCLH,NFLX,NTAP,NTES,NVDA,NXPI,ORLY,PAYX,PCAR,PCLN,PYPL,QCOM,QVCA,REGN,ROST,SBAC,SBUX,SIRI,SRCL,STX,SWKS,SYMC,TMUS,TRIP,TSCO,TSLA,TXN,ULTA,VIAB,VOD,VRSK,VRTX,WBA,WDC,WFM,XLNX,YHOO'
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log("NASDAQ-100 successfully updated", response.data.results);
          var dataRef = new Firebase("https://market-wizard.firebaseio.com/data");  //  make reference to database location for data to be stored
          var dataRef2 = new Firebase("https://market-wizard.firebaseio.com/data2/today");  //  make reference to database location for data to be stored

          //  GRAB YESTERDAY'S NAZ-100 DATA
          dataRef.orderByChild("symbol").on("child_added", function(snapshot) {
            var key = snapshot.key();  // key is the unique ID of each day's data
            var childData = snapshot.val();  // childData2 is contents of the child
            $scope.childData = childData;
            yesterdaysData = $scope.childData;
          });

          naz100HistoryRef.push(yesterdaysData);  // move yesterday's NAZ-100 data to 'NAZ100_Historical' in Firebase
          dataRef.push(response.data.results);  // push today's EOD data to dataRef to hold for push to naz100HistoryRef tomorrow
          dataRef2.set(response.data.results);  // grab today's EOD data (for after-hours comparison - during market hours, dataRef2 holds 'live' data)
          }, function errorCallback(response) {  // called asynchronously if an error occurs
                                                // or server returns response with an error status.
        })
        .then
        // UPDATE S&P-100
          $http({
          method: 'GET',
          url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=AAPL,ABBV,ABT,ACN,AIG,ALL,AMGN,AMZN,APA,NEE,AXP,BA,BAC,BAX,BIIB,BK,BLK,BMY,BRK.B,C,CAT,CL,CMCSA,COF,COP,COST,CSCO,CVS,CVX,DD,DIS,DOW,DVN,EBAY,EMC,EMR,EXC,F,FB,FCX,FDX,FOXA,GD,GE,GILD,GM,GOOG,GS,HAL,HD,HON,IBM,INTC,JNJ,JPM,KO,LLY,LMT,LOW,MA,MCD,MDLZ,MDT,MET,MMM,MO,MON,MRK,MS,MSFT,NKE,NOV,NSC,ORCL,OXY,PEP,PFE,PG,PM,QCOM,RTN,SBUX,SLB,SO,SPG,T,TGT,TWX,TXN,UNH,UNP,UPS,USB,UTX,V,VZ,WBA,WFC,WMT,XOM'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("S&P-100 api call successful", response.data.results);

            //  GRAB YESTERDAY'S SP-100 DATA
              sp100Ref.orderByChild("symbol").on("child_added", function(snapshot) {
                var key = snapshot.key();  // key is the unique ID of each day's data
                var childData = snapshot.val();  // childData2 is contents of the child
                $scope.childData = childData;
                yesterdaysData = $scope.childData;
              });
              sp100HistoryRef.push(yesterdaysData);  // move yesterday's SP-100 data to 'SP100_Historical' in Firebase
              sp100Ref.push(response.data.results);  // grab today's EOD SP-100 data and push to Firebase
            }, function errorCallback(response) {  // called asynchronously if an error occurs
                                                  // or server returns response with an error status.
          }).then
        // UPDATE DOW-JONES-30
          $http({
          method: 'GET',
          url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=AAPL,AXP,BA,CAT,CSCO,CVX,DD,DIS,GE,GS,HD,IBM,INTC,JNJ,JPM,KO,MCD,MMM,MRK,MSFT,NKE,PFE,PG,TRV,UNH,UTX,V,VZ,WMT,XOM'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("DJ-30 successfully updated", response.data.results);

          //  GRAB TODAY'S DJ-30 DATA
            dj30Ref.orderByChild("symbol").on("child_added", function(snapshot) {
              var key = snapshot.key();  // key is the unique ID of each day's data
              var childData = snapshot.val();  // childData2 is contents of the child
              $scope.childData = childData;
              yesterdaysData = $scope.childData;
            });
            dj30HistoryRef.push(yesterdaysData);  // move yesterday's DJ-30 data to 'DJ_Historical' in Firebase
            dj30Ref.push(response.data.results);  // grab today's EOD DJ-30 data and push to Firebase
            $('#nightlyUpdateModal').modal('show');
          }, function errorCallback(response) {  // called asynchronously if an error occurs
                                                // or server returns response with an error status.
          });
      }  //  end of 'if' statement
    })();  // end of 'timer' IIFE
  // }  // end of 'if loginStatus === true'
}, 60000)  // end of 'setInterval'


// LIVE UPDATE!!
// ---> AUTOMATICALLY RETRIEVE NASDAQ-100 DATA EVERY 10 SECONDS DURING TRADING HOURS
setInterval(function () {  // a callback function after the specified time interval
  if (loginStatus === true) {  // if user is logged in

    var timer = ( function() {
      var date = new Date();
      var day = date.getDay();
      var hour = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();

        if ((day === 1 || day === 2 || day === 3 || day === 4 || day === 5) && (hour > 8) && (hour < 16)) {  // catches 1/2 hour of premarket and 1 hour of postmarket CST
          console.log("inside update function");
          // UPDATE NASDAQ-100
          $http({
          method: 'GET',
          url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=AAL,AAPL,ADBE,ADI,ADP,ADSK,AKAM,ALXN,AMAT,AMGN,AMZN,ATVI,AVGO,BBBY,BIDU,BIIB,BMRN,CA,CELG,CERN,CHKP,CHTR,COST,CSCO,CSX,CTRP,CTSH,CTXS,DISH,DLTR,EA,EBAY,ENDP,ESRX,EXPE,FAST,FB,FISV,FOX,FOXA,GILD,GOOG,GOOGL,ILMN,INCY,INTC,INTU,ISRG,JD,KHC,LLTC,LMCA,LMCK,LRCX,LVNTA,MAR,MAT,MDLZ,MNST,MSFT,MU,MXIM,MYL,NCLH,NFLX,NTAP,NTES,NVDA,NXPI,ORLY,PAYX,PCAR,PCLN,PYPL,QCOM,QVCA,REGN,ROST,SBAC,SBUX,SIRI,SRCL,STX,SWKS,SYMC,TMUS,TRIP,TSCO,TSLA,TXN,ULTA,VIAB,VOD,VRSK,VRTX,WBA,WDC,WFM,XLNX,YHOO'
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
            $("#updateTime").html("<span class='userMsg'><span class='boldIt'>Market Closed</span><br><span class='smallFont'>(EOD auto-update at 6:15 CST)</span></span>");  // Replace contents in DOM element
        }  //  end of 'if' statement
    })();  // end of 'timer' IIFE
  }  // end of 'if loginStatus === true'
}, 10000)  // end of 'setInterval'

// * END - DATA UPDATES ***************************************************


// * BEGIN - 'FIND MATCHING TICKER DATA' (when user clicks on ticker in user's watchlist) ******************************
  newtickerData.remove();  // remove old data on page load so it doesn't display until user clicks a ticker

  $scope.getTickerData = function(stockTicker, watchList) {
    newtickerData.remove();  // remove old data from DOM

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
// * END - 'FIND MATCHING TICKER DATA' ******************************


//++++++ USER-DEFINED SCAN FUNCTIONALITY ++++++++++++++++++++++++++++++++++++++++++++++++++++

  // ADDS NEW SCAN NAME UNDER USER'S FIREBASE ID
  $scope.newScanModal = function() {
    $('#writeScanModal').modal('show');
  }
  // NEW-SCAN MODAL  *** FOR VERSION 2.0
  // $(function () { $('#writeScanModal').on('hide.bs.modal', function () {
  //   var newScan = null;
  //   var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
  //   var currentAuth = ref.getAuth().uid;  // get current user's ID
  //   var listRef = new Firebase("https://market-wizard.firebaseio.com/userScans/" + currentAuth);
  //
  //   var newScan = {
  //     "price1": $scope.addPrice1,
  //     "price2": $scope.addPrice2
  //   };
  //
  //   if ($scope.scanName != undefined || null || "") {
  //       scanName = $scope.scanName;  // obtain name of new scan from input field
  //       listRef.child(scanName).push(newScan);  // add scan name to user's list of scan names
  //       $('#addScanModal').modal('show');
  //   }
  //   $scope.price1 = "";  // clear 'Add Ticker' input field
  //   $scope.price2 = "";  // clear 'Add Ticker' input field
  //   $scope.scanName = "";  // clear 'or enter new Watchlist' field
  //   })
  // });
  // END - ADDS NEW SCAN NAME UNDER USER'S FIREBASE ID


// ++++ BEGIN - DELETE FUNCTIONALITY ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  //  * BEGIN - DELETE TICKER FROM USER'S WATCHLIST ********************
      $scope.watchTicks = [];
      $scope.deleteTicker = function (thing) {
        var currentWatchList = $scope.watchList.$id;
        var userListRef = new Firebase("https://market-wizard.firebaseio.com/watchlists/" + currentAuth + "/" + currentWatchList);  // make reference to location of current user's watchlists
        var tickerToDelete = thing.ticker;
        $scope.watchTicks = $firebaseArray(userListRef);
        $scope.watchTicks.$loaded().then(function() {  // promise
          $scope.watchTicks.forEach(function(object) {
              if (object.ticker === thing.ticker) {
                $scope.watchTicks.$remove(object).then(function() {  // promise
                  $('#deleteTickerModal').modal('show');
                })
              }
          });
        })
      };


  //  DELETE WATCHLIST FROM FIREBASE
  $scope.deleteWatchlist = function (usersWatchlist) {
    $scope.userWatchlistRef.forEach(function(thisList) {
      if (thisList.$id === usersWatchlist.$id) {
        $scope.userWatchlistRef.$remove(thisList).then(function() {  // promise
          $('#deleteWatchlistModal').modal('show');
        })
      }
    })
  }


  //  DELETE SCAN FROM FIREBASE
  $scope.deleteScan = function (usersScan) {
    $scope.allUserScans.forEach(function(thisScan) {
      if (thisScan.$id === usersScan.$id) {
        $scope.allUserScans.$remove(thisScan).then(function() {  // promise
          $('#deleteScanModal').modal('show');
        })
      }
    })
  }

// ++++ END - DELETE FUNCTIONALITY ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // ++++ CALCULATION FUNCTIONALITY FOR USER-DEFINED SCANS ++++++++++++++++++++++++++++++++++
  var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
  var currentAuth = ref.getAuth().uid;  // get current user's ID
  var userScanlistRef = new Firebase("https://market-wizard.firebaseio.com/userScans/" + currentAuth);  // make reference to location of current user's scans
  var userScanList = $firebaseArray(userScanlistRef);
  $scope.userScanList = userScanList;

  $scope.userCalc = function(usersScan) {
    var scanChoice = usersScan.$id; // obtain name of scan from dropdown list

    var currentScan = userScanList.$getRecord(scanChoice);

      $scope.userScanList.forEach(function(thisScan, i) {
        if (thisScan.$id === scanChoice) {
          console.log(thisScan.$id  + ' is a match!');
        }
      })

      //  GRAB SCAN DATA
      userScanlistRef.once("value", function(snapshot) {
        userScanlistRef.orderByChild("id").on("child_added", function(snapshot2) {
          var key = snapshot2.key();  // key is the unique ID of each scan data
          var childData2 = snapshot2.val();  // childData2 is contents of the child
          $scope.childData2 = childData2;
          scanData = $scope.childData2;
        })
      })

      userScanList.$loaded()
      .then(function(userScanList) {  // promise
        $scope.userScanList = userScanList;
      });
      userScanList.forEach(function(object, i) {  // loop through data
        console.log(object.$id);
      })
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      obtainData();
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
      $('#cntrlPanel').hide().show(0);  // force re-render (due to Chrome not rendering correctly at times)
        // angular.forEach($scope.userScanList, function(element, i) {  // loop over Firebase list
        //   console.log(i);
        //   console.log($scope.userScanList[i].$id);
        //   if ($scope.userScanList[i].$id === usersScan.$id) {
        //     console.log("guess what? Found", $scope.userScanList[i].$id);
        //     console.log($scope.userScanList[i]);
        //     scanChosen = $scope.userScanList[i].$id;
        //     console.log("chosen scan =", scanChosen);
        //     // watchList[i].remove();
        //   }
        // })


      })  // END 'PERFORM CALCULATION'
    // }  // END USER-DEFINED SCAN
  }  // END USERCALC FUNCTION


}  // END OF APP.CONTROLLER FUNCTION -> (all functionality goes inside this function)
]);
