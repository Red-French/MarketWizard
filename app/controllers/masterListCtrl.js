// * = note regarding issue to be addressed

app.controller('masterListCtrl', ["$scope", "$http", "$firebaseArray",  "$location",  
  function($scope, $http, $firebaseArray, $location) {
   // console.log("inside masterList.Ctrl"); 

  $scope.searchText = "";

// REFERENCE 'DATA' (IN FIREBASE) AND USE PROMISE TO CONFIRM IT IS LOADED
    var dataRef = new Firebase("https://market-wizard.firebaseio.com/data"); // grab data from Firebase
    var data = $firebaseArray(dataRef);
    var dataRef2 = new Firebase("https://market-wizard.firebaseio.com/data2"); // grab data from Firebase
    var data2 = $firebaseArray(dataRef2);
    var dataRef3 = dataRef2.child("today");
    var data3 = $firebaseArray(dataRef3);
    var newData = new Firebase("https://market-wizard.firebaseio.com/calculated/");
    var userData = $firebaseArray(newData);  // turn Firebase into Array for Angular
    $scope.userData = userData;
    var scans =  new Firebase("https://market-wizard.firebaseio.com/scans");
    var scanners = $firebaseArray(scans);
    $scope.scans = scanners;
    var newTop10 = new Firebase("https://market-wizard.firebaseio.com/topTen/");
    var top10 = $firebaseArray(newTop10);  // turn Firebase into Array for Angular
    $scope.top10 = top10;
    var userWatchlistRef = new Firebase("https://market-wizard.firebaseio.com/watchlists/"  + currentAuth);  // make reference to location of current user's watchlists
    var userWatching = $firebaseArray(userWatchlistRef);
    $scope.userWatchlistRef = userWatching;

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
//   $scope.priceChange = function() {
//     var dataRef = new Firebase("https://market-wizard.firebaseio.com/data"); // grab data from Firebase
//     var data = $firebaseArray(dataRef);
//     var dataRef2 = new Firebase("https://market-wizard.firebaseio.com/data2"); // grab data from Firebase
//     var data2 = $firebaseArray(dataRef2);
//     var dataRef3 = dataRef2.child("today");
//     var data3 = $firebaseArray(dataRef3);

//     // data3.$loaded().then(function() {
//     //   console.log("data3", data3.length);
//     // });

//     data.$loaded()
//       .then(function(data) {  // promise
//         $scope.data = data[0];
//         // console.log("yesterday's close", $scope.data[0].close)
//     })
//     data2.$loaded()
//       .then(function(data2) {  // promise
//         // console.log("data2.length", data2.length);
//         $scope.data2 = data2[0];
//         // console.log("data2 ", data2[0]);
//     var newData = new Firebase("https://market-wizard.firebaseio.com/calculated/");
//     userData = $firebaseArray(newData);  // turn Firebase into Array for Angular
//     scanResults = { ticker: "", calculation: ""};  // create new object to hold calculation
//     // console.log("data2.length", data2.length);
//       for (var i = 0; i < data3.length; i++) {
//         // console.log(i);
//       // console.log("current price", $scope.data2[i].lastPrice)
//       // console.log("Price Change Today in", $scope.data2[i].symbol, $scope.data2[i].lastPrice - $scope.data[i].close);
//       var ticker = $scope.data2[i].symbol;
//       var calculation = $scope.data2[i].lastPrice - $scope.data[i].close;
//       // console.log("ticker", $scope.ticker);
//       // console.log("calculation", $scope.calculation);
//       console.log("ticker", ticker);
//       console.log("calc", calculation);

// // * REMOVE DATA BEFORE ADDING
//       newData.remove();
//       userData.$add({  // add tickers/calculations to Firebase
//         ticker: ticker,
//         calculation: calculation
//       });
//       // newData.set(userData);
//     }
// })
// }

  $scope.calc = function(scanners) {
    // console.log("scanOption is ", scanOption.value);
    console.log(scanners.$id);


// * // BEGIN LOAD 'NASDAQ-100'
    if (scanners.$id === "- NASDAQ 100 -") {
      console.log("inside calc via - NASDAQ 100 -");
      // newData.remove();  // remove old data
      $location.path("/controlPanel");  // take user to this location
    }
// END LOAD 'NASDAQ-100'

// * // BEGIN LOAD 'SP-500'
    if (scanners.$id === "- S&P 500 -") {
      console.log("inside calc via - SP 500 -");
      // newData.remove();  // remove old data
      $location.path("/sp500");  // take user to this location
    }
// END LOAD 'SP-500'


// BEGIN '<20 & >5 MIL SHARES AND ADVANCING TODAY' FUNCTION
    if (scanners.$id === "<20 & >5 mil shrs & advancing") {
      console.log("inside calc via <20 & >5 MIL SHARES & ADVANCING");
      newData.remove();  // remove old data
    //  GRAB TODAY'S DATA
      dataRef2.once("value", function(snapshot) {
        dataRef2.orderByChild("symbol").on("child_added", function(snapshot2) {
        // snapshot.forEach(function(childSnapshot2) {  // The callback function is called for each day's data
          // console.log("childSnapshot2", childSnapshot2.val());  // each day's dataset is console logging
          var key = snapshot2.key();  // key is the unique ID of each day's data
          // console.log("key", key);
          var childData2 = snapshot2.val();  // childData2 is contents of the child
          $scope.childData2 = childData2;
          todaysData = $scope.childData2;
          // console.log("childData2.length", childData2.length);
          // console.log("date", childData2[2].serverTimestamp);
          // console.log("childData2", childData2.lastPrice);
          // })
      });

  // GRAB YESTERDAY'S DATA
          dataRef.once("value", function(snapshot) {
            var ticker = "";
            var lastPrice = 0;
            var close = 0;
            var high = 0;
            var low = 0;
            var volume = 0;
            var calculation = 0;
            var calcResult = 0;

  // * SHOULD ALWAYS BE 'LIMITTOLAST' TO COMPARE PRIOR CLOSE TO LATEST DATA
            dataRef.orderByChild("symbol").limitToLast(1).on("child_added", function(snapshot3) {
              var key = snapshot3.key();  // key is the unique ID of each day's data
              var childData3 = snapshot3.val();  // childData is contents of the child
              childData3 = childData3;
              yesterdaysData = childData3;

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
                if (todaysData[i].lastPrice < 20.00) {
                  if (yesterdaysData[i].volume > 5000000) {
                    if (todaysData[i].lastPrice > yesterdaysData[i].close) {

                      calculation = todaysData[i].lastPrice - yesterdaysData[i].close;
                      calcResult = calculation.toFixed(2);  // round to nearest 100th
                      console.log(ticker);
                      console.log(lastPrice, close);
                      console.log(high, low);
                      console.log(volume);

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
                //   // to access yesterday's dataset only, get number of entries with
                //   // var length = childData.length;
                })
              // })
            })
          });
});
}
  // END '<20 & >5 MIL SHARES AND ADVANCING TODAY' FUNCTION


// BEGIN '>50 & >5 MIL SHARES AND DECLINING TODAY' FUNCTION
    if (scanners.$id === ">50 & >5 mil shrs & declining") {
      console.log("inside calc via >50 & >5 MIL SHARES & DECLINING");
      newData.remove();  // remove old data
    //  GRAB TODAY'S DATA
      dataRef2.once("value", function(snapshot) {
        dataRef2.orderByChild("symbol").on("child_added", function(snapshot2) {
        // snapshot.forEach(function(childSnapshot2) {  // The callback function is called for each day's data
          // console.log("childSnapshot2", childSnapshot2.val());  // each day's dataset is console logging
          var key = snapshot2.key();  // key is the unique ID of each day's data
          // console.log("key", key);
          var childData2 = snapshot2.val();  // childData2 is contents of the child
          $scope.childData2 = childData2;
          todaysData = $scope.childData2;
          // console.log("childData2.length", childData2.length);
          // console.log("date", childData2[2].serverTimestamp);
          // console.log("childData2", childData2.lastPrice);
          // })
      });

  // GRAB YESTERDAY'S DATA
          dataRef.once("value", function(snapshot) {
            var ticker = "";
            var lastPrice = 0;
            var close = 0;
            var high = 0;
            var low = 0;
            var volume = 0;
            var calculation = 0;
            var calcResult = 0;

  // * SHOULD ALWAYS BE 'LIMITTOLAST' TO COMPARE PRIOR CLOSE TO LATEST DATA
            dataRef.orderByChild("symbol").limitToLast(1).on("child_added", function(snapshot3) {
              var key = snapshot3.key();  // key is the unique ID of each day's data
              var childData3 = snapshot3.val();  // childData is contents of the child
              childData3 = childData3;
              yesterdaysData = childData3;

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
                  if (yesterdaysData[i].volume > 5000000) {
                    if (todaysData[i].lastPrice - yesterdaysData[i].close) {

                      calculation = todaysData[i].lastPrice - yesterdaysData[i].close;
                      calcResult = calculation.toFixed(2);  // round to nearest 100th
                      console.log(ticker);
                      console.log(lastPrice, close);
                      console.log(high, low);
                      console.log(volume);

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
                //   // to access yesterday's dataset only, get number of entries with
                //   // var length = childData.length;
                })
              // })
            })
          });
});
}
  // END '>50 & >5 MIL SHARES AND DECLINING TODAY' FUNCTION


  // BEGIN 'GAP UP' FUNCTION
    if (scanners.$id === "Gap Up") {
      console.log("inside calc via GAP UP");
      newData.remove();  // remove old data
    //  GRAB TODAY'S DATA
      dataRef2.once("value", function(snapshot) {
        dataRef2.orderByChild("symbol").on("child_added", function(snapshot2) {
        // snapshot.forEach(function(childSnapshot2) {  // The callback function is called for each day's data
          // console.log("childSnapshot2", childSnapshot2.val());  // each day's dataset is console logging
          var key = snapshot2.key();  // key is the unique ID of each day's data
          // console.log("key", key);
          var childData2 = snapshot2.val();  // childData2 is contents of the child
          $scope.childData2 = childData2;
          todaysData = $scope.childData2;
          // console.log("childData2.length", childData2.length);
          // console.log("date", childData2[2].serverTimestamp);
          // console.log("childData2", childData2.lastPrice);
          // })
      });

  // GRAB YESTERDAY'S DATA
          dataRef.once("value", function(snapshot) {
            var ticker = "";
            var lastPrice = 0;
            var close = 0;
            var high = 0;
            var low = 0;
            var volume = 0;
            var calculation = 0;
            var calcResult = 0;

  // * SHOULD ALWAYS BE 'LIMITTOLAST' TO COMPARE PRIOR CLOSE TO LATEST DATA
            dataRef.orderByChild("symbol").limitToLast(1).on("child_added", function(snapshot3) {
            // snapshot.forEach(function(childSnapshot3) {  // The callback function is called for each day's data
              // console.log("snapshot", snapshot.val());  // each day's dataset is console logging
              var key = snapshot3.key();  // key is the unique ID of each day's data
              var childData3 = snapshot3.val();  // childData is contents of the child
              childData3 = childData3;
              yesterdaysData = childData3;

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
                      console.log(ticker);
                      console.log(lastPrice, close);
                      console.log(high, low);
                      console.log(volume);

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
               // $scope.$apply();
                //   // to access yesterday's dataset only, get number of entries with
                //   // var length = childData.length;
                })
              })
            // })
          });
      });
    }
// END 'GAP UP' FUNCTION

// BEGIN 'GAP DOWN' FUNCTION
    if (scanners.$id === "Gap Down") {
      console.log("inside calc via GAP DOWN");
      newData.remove();  // remove old data
    //  GRAB TODAY'S DATA
      dataRef2.once("value", function(snapshot) {
        dataRef2.orderByChild("symbol").on("child_added", function(snapshot2) {
        // snapshot.forEach(function(childSnapshot2) {  // The callback function is called for each day's data
          // console.log("childSnapshot2", childSnapshot2.val());  // each day's dataset is console logging
          var key = snapshot2.key();  // key is the unique ID of each day's data
          // console.log("key", key);
          var childData2 = snapshot2.val();  // childData2 is contents of the child
          $scope.childData2 = childData2;
          todaysData = $scope.childData2;
          // console.log("childData2.length", childData2.length);
          // console.log("date", childData2[2].serverTimestamp);
          // console.log("childData2", childData2.lastPrice);
          // })
      });

  // GRAB YESTERDAY'S DATA
          dataRef.once("value", function(snapshot) {
            var ticker = "";
            var lastPrice = 0;
            var close = 0;
            var high = 0;
            var low = 0;
            var volume = 0;
            var calculation = 0;
            var calcResult = 0;

  // * SHOULD ALWAYS BE 'LIMITTOLAST' TO COMPARE PRIOR CLOSE TO LATEST DATA
            dataRef.orderByChild("symbol").limitToLast(1).on("child_added", function(snapshot3) {
            // snapshot.forEach(function(childSnapshot3) {  // The callback function is called for each day's data
              // console.log("snapshot", snapshot.val());  // each day's dataset is console logging
              var key = snapshot3.key();  // key is the unique ID of each day's data
              var childData3 = snapshot3.val();  // childData is contents of the child
              childData3 = childData3;
              yesterdaysData = childData3;

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
                      console.log(ticker);
                      console.log(lastPrice, close);
                      console.log(high, low);
                      console.log(volume);

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
               // $scope.$apply();
                //   // to access yesterday's dataset only, get number of entries with
                //   // var length = childData.length;
                })
              })
            // })
          });
      });
    }
// END 'GAP DOWN' FUNCTION


// BEGIN 'NET CHANGE' FUNCTION
    if (scanners.$id === "Net Change") {
      console.log("inside calc via NET CHANGE");
      newData.remove();  // remove old data
    //  GRAB TODAY'S DATA
      dataRef2.once("value", function(snapshot) {
        dataRef2.orderByChild("symbol").on("child_added", function(snapshot2) {
        // snapshot.forEach(function(childSnapshot2) {  // The callback function is called for each day's data
          // console.log("childSnapshot2", childSnapshot2.val());  // each day's dataset is console logging
          var key = snapshot2.key();  // key is the unique ID of each day's data
          // console.log("key", key);
          var childData2 = snapshot2.val();  // childData2 is contents of the child
          $scope.childData2 = childData2;
          todaysData = $scope.childData2;
          // console.log("childData2.length", childData2.length);
          // console.log("date", childData2[2].serverTimestamp);
          // console.log("childData2", childData2.lastPrice);
          // })
      });

  // GRAB YESTERDAY'S DATA
          dataRef.once("value", function(snapshot) {
            var ticker = "";
            var lastPrice = 0;
            var close = 0;
            var high = 0;
            var low = 0;
            var volume = 0;
            var calculation = 0;
            var calcResult = 0;

  // * SHOULD ALWAYS BE 'LIMITTOLAST' TO COMPARE PRIOR CLOSE TO LATEST DATA
            dataRef.orderByChild("symbol").limitToLast(1).on("child_added", function(snapshot3) {
            // snapshot.forEach(function(childSnapshot3) {  // The callback function is called for each day's data
              // console.log("snapshot", snapshot.val());  // each day's dataset is console logging
              var key = snapshot3.key();  // key is the unique ID of each day's data
              var childData3 = snapshot3.val();  // childData is contents of the child
              childData3 = childData3;
              yesterdaysData = childData3;

              // PERFORM CALCULATION
              yesterdaysData.forEach(function(object2, i) {  // loop through data

                // place API data in variables
                ticker = todaysData[i].symbol;
                lastPrice = todaysData[i].lastPrice;
                close = todaysData[i].close;
                high = todaysData[i].high;
                low = todaysData[i].low;
                volume = todaysData[i].volume;

                // console.log($scope.childData2[i].symbol);
                // console.log("Price Change Today = ", todaysData[i].lastPrice - yesterdaysData[i].close);
                ticker = todaysData[i].symbol;
                calculation = todaysData[i].lastPrice - yesterdaysData[i].close;
                calcResult = calculation.toFixed(2);  // round to nearest 100th
                // console.log("ticker", ticker);
                // console.log(ticker, calcResult);

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
               // $scope.$apply();
                //   // to access yesterday's dataset only, get number of entries with
                //   // var length = childData.length;
                })
              })
            // })
          });
      });
    }
// END 'NET CHANGE' FUNCTION


// BEGIN 'TODAY'S ADVANCERS' FUNCTION
    if (scanners.$id === "Today's Advancers") {
      console.log("inside calc via TODAY'S ADVANCERS");
      newData.remove();  // remove old data
    //  GRAB TODAY'S DATA
      dataRef2.once("value", function(snapshot) {
        dataRef2.orderByChild("symbol").on("child_added", function(snapshot2) {
        // snapshot.forEach(function(childSnapshot2) {  // The callback function is called for each day's data
          // console.log("childSnapshot2", childSnapshot2.val());  // each day's dataset is console logging
          var key = snapshot2.key();  // key is the unique ID of each day's data
          // console.log("key", key);
          var childData2 = snapshot2.val();  // childData2 is contents of the child
          $scope.childData2 = childData2;
          todaysData = $scope.childData2;
          // console.log("childData2.length", childData2.length);
          // console.log("date", childData2[2].serverTimestamp);
          // console.log("childData2", childData2.lastPrice);
          // })
      });

  // GRAB YESTERDAY'S DATA
          dataRef.once("value", function(snapshot) {
            var ticker = "";
            var lastPrice = 0;
            var close = 0;
            var high = 0;
            var low = 0;
            var volume = 0;
            var calculation = 0;
            var calcResult = 0;

  // * SHOULD ALWAYS BE 'LIMITTOLAST' TO COMPARE PRIOR CLOSE TO LATEST DATA
            dataRef.orderByChild("symbol").limitToLast(1).on("child_added", function(snapshot3) {
              // snapshot.forEach(function(childSnapshot3) {  // The callback function is called for each day's data
              // console.log("duece?");
              // console.log("snapshot", snapshot.val());  // each day's dataset is console logging
              var key = snapshot3.key();  // key is the unique ID of each day's data
              var childData3 = snapshot3.val();  // childData is contents of the child
              childData3 = childData3;
              yesterdaysData = childData3;

              // PERFORM CALCULATION
              yesterdaysData.forEach(function(object2, i) {  // loop through data

                // place API data in variables
                ticker = todaysData[i].symbol;
                lastPrice = todaysData[i].lastPrice;
                close = todaysData[i].close;
                high = todaysData[i].high;
                low = todaysData[i].low;
                volume = todaysData[i].volume;

                // console.log($scope.childData2[i].symbol);
                // console.log("Price Change Today = ", todaysData[i].lastPrice - yesterdaysData[i].close);
                ticker = todaysData[i].symbol;
                // console.log("ticker ", ticker);
                if (todaysData[i].lastPrice > yesterdaysData[i].close) {
                  // console.log(ticker, " up on day");
                  var calculation = (todaysData[i].lastPrice / yesterdaysData[i].close) -1;
                  calcResult = calculation.toFixed(3) + "%";  // round to nearest 1000th
                  console.log(ticker + " up", calcResult);

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
                //   // to access yesterday's dataset only, get number of entries with
                //   // var length = childData.length;
                })
              // })
            })
          });
      });
    }
// END 'TODAY'S ADVANCERS' FUNCTION


// BEGIN 'TODAY'S DECLINERS' FUNCTION
    if (scanners.$id === "Today's Decliners") {
      console.log("inside calc via TODAY'S DECLINERS");
      newData.remove();  // remove old data
    //  GRAB TODAY'S DATA
      dataRef2.once("value", function(snapshot) {
        dataRef2.orderByChild("symbol").on("child_added", function(snapshot2) {
          var key = snapshot2.key();  // key is the unique ID of each day's data
          // console.log("key", key);
          var childData2 = snapshot2.val();  // childData2 is contents of the child
          $scope.childData2 = childData2;
          todaysData = $scope.childData2;
          // console.log("childData2.length", childData2.length);
          // console.log("date", childData2[2].serverTimestamp);
          // console.log("childData2", childData2.lastPrice);
          // })
      });

  // GRAB YESTERDAY'S DATA
          dataRef.once("value", function(snapshot) {
            var ticker = "";
            var lastPrice = 0;
            var close = 0;
            var high = 0;
            var low = 0;
            var volume = 0;
            var calculation = 0;
            var calcResult = 0;

  // * SHOULD ALWAYS BE 'LIMITTOLAST' TO COMPARE PRIOR CLOSE TO LATEST DATA
            dataRef.orderByChild("symbol").limitToLast(1).on("child_added", function(snapshot4) {
              // console.log("duece?");
              var key = snapshot4.key();  // key is the unique ID of each day's data
              var childData3 = snapshot4.val();  // childData is contents of the child
              yesterdaysData = childData3;

              // PERFORM CALCULATION
              yesterdaysData.forEach(function(object2, i) {  // loop through data

                // place API data in variables
                ticker = todaysData[i].symbol;
                lastPrice = todaysData[i].lastPrice;
                close = todaysData[i].close;
                high = todaysData[i].high;
                low = todaysData[i].low;
                volume = todaysData[i].volume;

                // console.log($scope.childData2[i].symbol);
                // console.log("Price Change Today = ", todaysData[i].lastPrice - yesterdaysData[i].close);
                // ticker = todaysData[i].symbol;
                // console.log("ticker ", ticker);
                if (todaysData[i].lastPrice < yesterdaysData[i].close) {
                  // console.log(ticker, " up on day");
                  ticker = todaysData[i].symbol;
                  var calculation = ((todaysData[i].lastPrice / yesterdaysData[i].close) -1);
                  calcResult = calculation.toFixed(3) + "%";  // round to nearest 1000th
                  // console.log(ticker + " down", calcResult);

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
                //   // to access yesterday's dataset only, get number of entries with
                //   // var length = childData.length;
                // })
              })
            })
          });
      });
    }
// END 'TODAY'S DECLINERS' FUNCTION

}  // END CALC FUNCTION

// NOT USING CURRENTLY!!!!!!! --
// PUSH TOP 10 TO FIREBASE -- 
  function addTen () {
    newData.orderByChild("calculation").limitToLast(2).on("child_added", function(snapshot5) {
      newTop10.remove();  // remove old data
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


// ++++++ USER WATCHLIST FUNCTIONALITY ++++++++++++++++++++++++++++++++++++++++++++++++++++

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
      var listName = $scope.watchName;
      console.log("listName = ", listName);
      listRef.child(listName)
      listRef.child(listName).push("");
      }

// GET CURRENT USER'S WATCHLISTS
    var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
    var currentAuth = ref.getAuth().uid;  // get current user's ID
    // console.log("current user = ", currentAuth);
    var ref = new Firebase("https://market-wizard.firebaseio.com/watchlists/"  + currentAuth);  // make reference to location of current user's watchlists
    ref.orderByKey().on("child_added", function(snapshot) {
      var userWatchlists = snapshot.key();
      // console.log("userWatchlists = ", userWatchlists);
      });

// PUT 'WATCHLISTS' (IN FIREBASE) ON $SCOPE
    var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
    // console.log("ref", ref);
    var currentAuth = ref.getAuth().uid;  // get current user's ID
    var watchRef = new Firebase("https://market-wizard.firebaseio.com/watchlists/" + currentAuth); // grab data from Firebase
    var listToWatch = $firebaseArray(watchRef);
    $scope.listToWatch = listToWatch;
    // console.log("listToWatch = ", $scope.listToWatch)




// ++++++ STOCKS FUNCTIONALITY ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// LIST OF STOCKS (CONTROL INITIAL DISPLAY)
    $scope.predicate = 'lastPrice';  // initially, list is sorted by 'last price'
    $scope.reverse = true;  // for sort functionality
    $scope.order = function(predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;  // sort functionality
      $scope.predicate = predicate;
    };

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
};

// PUT 'STOCKS' (IN FIREBASE) ON $SCOPE
    var stocksRef = new Firebase("https://market-wizard.firebaseio.com/stocks/"); // grab data from Firebase
    var stocks = $firebaseArray(stocksRef);
    $scope.stocks = stocks;
    // console.log("stocks = ", $scope.stocks)

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

// AUTOMATICALLY RETRIEVE NASDAQ-100 MARKET EOD DATA AT 6:15 P.M MONDAY-FRIDAY AND ALERT USER OF SUCCESSFUL UPDATE
setInterval(function () {
  var timer = ( function() {
      var date = new Date();
      var day = date.getDay();
      var hour = date.getHours();
      var minutes = date.getMinutes();
      // console.log("Date", date);
      // console.log("day of week is", day);
      // console.log("hour is", hour);
      // console.log("minutes is", minutes);

  if ((day === 1 || day === 2 || day === 3 || day === 4 || day === 5) && hour === 18 && minutes === 15) {
    console.log("inside update function");
    $http({
    method: 'GET',
    url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=AAL,AAPL,ADBE,ADI,ADP,ADSK,AKAM,ALXN,AMAT,AMGN,AMZN,ATVI,AVGO,BBBY,BIDU,BIIB,BMRN,CA,CELG,CERN,CHKP,CHRW,CHTR,CMCSA,CMCSK,COST,CSCO,CTSH,CTXS,DISCA,DISCK,DISH,DLR,EA,EBAY,ESRX,EXPD,EXPE,FAST,FB,FISV,FOX,FOXA,GILD,GMCR,GOOG,GOOGL,GRMN,HSIC,INCY,INTC,INTU,ILMN,ISRG,JD,KLAC,KHC,LBTYA,LBTYK,LILA,LILAK,LLTC,LMCA,LRCX,LVNTA,MAR,MAT,MDLZ,MNST,MSFT,MU,MYL,NFLX,NTAP,NVDA,NXPI,ORLY,PAYX,PCAR,PCLN,PYPL,QCOM,QVCA,REGN,ROST,SBAC,SBUX,SIRI,SNDK,SPLS,SRCL,STX,SWKS,SYMC,TSCO,TSLA,TRIP,TXN,VIAB,VIP,VOD,VRSK,VRTX,WBA,WDC,WFM,WYNN,XLNX,YHOO'
  }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      console.log("successful response from update", response.data.results);

      var dataRef = new Firebase("https://market-wizard.firebaseio.com/data");  //  make reference to database location for data to be stored

      dataRef.push(response.data.results);
      alert("Today's EOD market data successfully imported.");
    }, function errorCallback(response) {  // called asynchronously if an error occurs
                                          // or server returns response with an error status.
    });
  }
    })();
}, 60000)


// AUTOMATICALLY RETRIEVE S&P-500 MARKET EOD DATA AT 6:15 P.M MONDAY-FRIDAY AND ALERT USER OF SUCCESSFUL UPDATE
setInterval(function () {
  var timer = ( function() {
      var date = new Date();
      var day = date.getDay();
      var hour = date.getHours();
      var minutes = date.getMinutes();
      console.log("Date", date);
      console.log("day of week is", day);
      console.log("hour is", hour);
      console.log("minutes is", minutes);

  if ((day === 1 || day === 2 || day === 3 || day === 4 || day === 5) && hour === 10 && minutes === 09) {
      console.log("inside update function");
      $http({
      method: 'GET',
      url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=A,AA,AAL,AAP,AAPL,ABBV,ABC,ABT,ACE,ACN,ADBE,ADI,ADM,ADP,ADS,ADSK,ADT,AEE,AEP,AES,AET,AFL,AGN,AIG,AIV,AIZ,AKAM,ALL,ALLE,ALTR,ALXN,AMAT,AME,AMG,AMGN,AMP,AMT,AMZN,AN,ANTM,AON,APA,APC,APD,APH,ARG,ATVI,AVB,AVGO,AVY,AXP,AZO,BA,BAC,BAX,BBBY,BBT,BBY,BCR,BDX,BEN,BF.B,BHI,BIIB,BK,BLK,BLL,BMY,BRCM,BRK.B,BSX,BWA,BXLT,BXP,C,CA,CAG,CAH,CAM,CAT,CB,CBG,CBS,CCE,CCI,CCL,CELG,CERN,CF,CHK,CHRW,CI,CINF,CL,CLX,CMA,CMCSA,CMCSK,CME,CMG'
    }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.log("successful response from update1", response.data.results);
        var dataRef = new Firebase("https://market-wizard.firebaseio.com/data3");  //  make reference to database location for data to be stored
        dataRef.push(response.data.results);
      })
    .then 
      $http({
      method: 'GET',
      url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=CMI,CMS,CNP,CNX,COF,COG,COH,COL,COP,COST,CPB,CPGX,CRM,CSC,CSCO,CSRA,CSX,CTAS,CTL,CTSH,CTXS,CVC,CVS,CVX,D,DAL,DD,DE,DFS,DG,DGX,DHI,DHR,DIS,DISCA,DISCK,DLPH,DLTR,DNB,DO,DOV,DOW,DPS,DRI,DTE,DUK,DVA,DVN,EA,EBAY,ECL,ED,EFX,EIX,EL,EMC,EMN,EMR,ENDP,EOG,EQIX,EQR,EQT,ES,ESRX,ESS,ESV,ETFC,ETN,ETR,EW,EXC,EXPD,EXPE,F,FAST,FB,FCX,FDX,FE,FFIV,FIS,FISV,FITB,FLIR,FLR,FLS,FMC,FOSL,FOX,FOXA,FSLR,FTI,FTR,GAS,GD,GE,GGP,GILD,GIS'
    }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.log("successful response from update2", response.data.results);
        var dataRef = new Firebase("https://market-wizard.firebaseio.com/data3");  //  make reference to database location for data to be stored
        dataRef.push(response.data.results);
    }).then 
      $http({
      method: 'GET',
      url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=GLW,GM,GMCR,GME,GOOG,GOOGL,GPC,GPS,GRMN,GS,GT,GWW,HAL,HAR,HAS,HBAN,HBI,HCA,HCN,HCP,HD,HES,HIG,HOG,HON,HOT,HP,HPE,HPQ,HRB,HRL,HRS,HSIC,HST,HSY,HUM,IBM,ICE,IFF,ILMN,INTC,INTU,IP,IPG,IR,IRM,ISRG,ITW,IVZ,JBHT,JCI,JEC,JNJ,JNPR,JPM,JWN,K,KEY,KHC,KIM,KLAC,KMB,KMI,KMX,KO,KORS,KR,KSS,KSU,L,LB,LEG,LEN,LH,LLL,LLTC,LLY,LM,LMT,LNC,LOW,LRCX,LUK,LUV,LVLT,LYB,M,MA,MAC,MAR,MAS,MAT,MCD,MCHP,MCK,MCO,MDLZ,MDT,MET,MHFI'
    }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.log("successful response from update3", response.data.results);
        var dataRef = new Firebase("https://market-wizard.firebaseio.com/data3");  //  make reference to database location for data to be stored
        dataRef.push(response.data.results);
    }).then 
      $http({
      method: 'GET',
      url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=MHK,MJN,MKC,MLM,MMC,MMM,MNK,MNST,MO,MON,MOS,MPC,MRK,MRO,MS,MSFT,MSI,MTB,MU,MUR,MYL,NAVI,NBL,NDAQ,NEE,NEM,NFLX,NFX,NI,NKE,NLSN,NOC,NOV,NRG,NSC,NTAP,NTRS,NUE,NVDA,NWL,NWS,NWSA,O,OI,OKE,OMC,ORCL,ORLY,OXY,PAYX,PBCT,PBI,PCAR,PCG,PCL,PCLN,PCP,PDCO,PEG,PEP,PFE,PFG,PG,PGR,PH,PHM,PKI,PLD,PM,PNC,PNR,PNW,POM,PPG,PPL,PRGO,PRU,PSA,PSX,PVH,PWR,PX,PXD,PYPL,QCOM,QRVO,R,RAI,RCL,REGN,RF,RHI,RHT,RIG,RL,ROK,ROP,ROST,RRC,RSG'
    }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.log("successful response from update4", response.data.results);
        var dataRef = new Firebase("https://market-wizard.firebaseio.com/data3");  //  make reference to database location for data to be stored
        dataRef.push(response.data.results);
    }).then 
      $http({
      method: 'GET',
      url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=RTN,SBUX,SCG,SCHW,SE,SEE,SHW,SIG,SJM,SLB,SLG,SNA,SNDK,SNI,SO,SPG,SPLS,SRCL,SRE,STI,STJ,STT,STX,STZ,SWK,SWKS,SWN,SYF,SYK,SYMC,SYY,T,TAP,TDC,TE,TEL,TGNA,TGT,THC,TIF,TJX,TMK,TMO,TRIP,TROW,TRV,TSCO,TSN,TSO,TSS,TWC,TWX,TXN,TXT,TYC,UA,UAL,UHS,UNH,UNM,UNP,UPS,URBN,URI,USB,UTX,V,VAR,VFC,VIAB,VLO,VMC,VNO,VRSK,VRSN,VRTX,VTR,VZ,WAT,WBA,WDC,WEC,WFC,WFM,WHR,WM,WMB,WMT,WRK,WU,WY,WYN,WYNN,XEC,XEL,XL,XLNX,XOM,XRAY,XRX'
    }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.log("successful response from update5", response.data.results);
        var dataRef = new Firebase("https://market-wizard.firebaseio.com/data3");  //  make reference to database location for data to be stored
        dataRef.push(response.data.results);
    }).then 
      $http({
      method: 'GET',
      url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=XYL,YHOO,YUM,ZBH,ZION,ZTS'
    }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.log("successful response from update-final", response.data.results);
        var dataRef = new Firebase("https://market-wizard.firebaseio.com/data3");  //  make reference to database location for data to be stored
        dataRef.push(response.data.results);
        alert("Today's EOD market data successfully imported.");
      }, function errorCallback(response) {  // called asynchronously if an error occurs
                                            // or server returns response with an error status.
      });
  }
})();
}, 60000)


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
      alert("Today's intraday market data successfully updated.");
    }, function errorCallback(response) {  // called asynchronously if an error occurs
                                          // or server returns response with an error status.
    });
  }


// ++++++ DISPLAY USER'S CHOSEN WATCHLIST FROM DROPDOWN ++++++++++++++++++++++++++++++++++++++

  $scope.watchListView = function(watchList) {
    // console.log(watchList);
    // console.log(watchList.$id);

  // * NEED TO LOOP THROUGH OBJECT AND MATCH TICKERS TO TICKERS IN 'DATA2' TO PULL DATA

   $location.path("/watchlist");  // take user to this location
  // $scope.$apply();
  }


// ++++++ DELETE TICKER FROM USER'S WATCHLIST ++++++++++++++++++++++++++++++++++++++++++++++++

  $scope.deleteTicker = function(stock, watchList) {
    // console.log("from 'deleteTicker' function", watchList);
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
        console.log("ticker to delete is", stock.ticker);
        var tickToRemove = stock.ticker;
        // listToWatch[i].$id.remove();

          for (var i = 0; i < 2; i++) {
            console.log("inside for-loop in deleteTicker");
            // console.log(listToWatch[i].$id);
            console.log(listToWatch[i].$id.ticker);
            // watchListID.$id.$remove(stock.ticker);
            // $scope.listToWatch.$remove(stock.ticker);
          }
        }
      }
}

document.querySelector("body").addEventListener("click", function(event) {  // list for click events
  // console.log(event);
  if (event.target.className === "deleteButton") {  // if click is on a 'delete' button
    // console.log("You clicked on 'Delete'");
    console.log(event.target.parentElement);  // log html to be removed
    event.target.parentElement.remove();  // remove chosen ticker from DOM
  }
});

// var userWatchlistRef = new Firebase("https://market-wizard.firebaseio.com/watchlists/");
// userWatchlistRef.orderByKey().on("child_added", function(snapshot) {
// console.log(snapshot.key());
// snapshot.forEach(function(snapshot2) {  // The callback function is called for each day's data
// // console.log("childSnapshot2", childSnapshot2.val());  // each day's dataset is console logging
// var key = snapshot2.key();  // key is the unique ID of each day's data
// // console.log("key", key);
// var childData2 = snapshot2.val();  // childData2 is contents of the child
// $scope.childData2 = childData2;
// todaysData = $scope.childData2;
// console.log(todaysData.ticker);
// })

// });




    // var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
    // var currentAuth = ref.getAuth().uid;  // get current user's ID
    // // console.log("current user = ", currentAuth);
    // var ref = new Firebase("https://market-wizard.firebaseio.com/watchlists/"  + currentAuth);  // make reference to location of current user's watchlists
    // ref.orderByKey().on("child_added", function(snapshot) {
    //   var userWatchlists = snapshot.key();
      // console.log("userWatchlists = ", userWatchlists);


//     var ref = new Firebase("https://market-wizard.firebaseio.com/watchlists/"  + currentAuth);  // make reference to location of current user's watchlists
//     $scope.userLists = $firebaseArray(ref);
//     $scope.userLists.$remove(stock);
//       ref.orderByKey().on("child_added", function(snapshot) {
//       var userWatchlists = snapshot.key();
//       console.log("userLists = ", userLists.value);
//       console.log("userLists.length", userLists.length);
//       console.log("userWatchlists.length", userWatchlists.length);
//     });




    // userLists.forEach(function(object2, i) {  // loop through data

    // }

  //   for (var i = 0; i < listToWatch.length; i++) {
  //     if (listToWatch[i] === watchList.$id) {
  //       console.log("chosen watchlist is", listToWatch.[i]);
  //       // watchList[i].$remove();
  //     }
  //   }
  //   console.log("from 'deleteTicker' function", watchList.$id);
  //   console.log("stock.ticker", stock.ticker);
  //   console.log(stock.ticker, " to be deleted");

  //   angular.forEach(?????, function(element, i) {  // loop over Firebase list
  //     console.log("x times");
  //     console.log(watchList[i].ticker);
  //     if (watchList[i].ticker === stock.ticker) {
  //       console.log("guess what? Found", stock.ticker);
  //       watchList[i].$remove();
  //     }

  //   })
  // }

//     var array = [];
//     angular.forEach(watchList, function(element) {
//       array.push(element);
//     });
//     console.log(array);
//     console.log("array.length", array.length);
// for (var i = 0; i < array.length - 3; i++) {
//     // array.forEach(function(object, i) {  // loop through data
//     console.log("array[i]", array[i].ticker);
//     if (array[i].ticker === stock.ticker)
//       console.log(array[i].ticker, " will be deleted");

//     }
                




 


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


  }  // END OF CONTROLLER FUNCTION -> (all functionality goes inside this function)
]);