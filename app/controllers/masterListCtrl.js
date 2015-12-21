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


// * // BEGIN LOAD 'SUMMARY'
    if (scanners.$id === "- Summary -") {
      console.log("inside calc via - SUMMARY -");
      // newData.remove();  // remove old data
      $location.path("/controlPanel");  // take user to this location
    }
// END LOAD 'SUMMARY'


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
            dataRef.orderByChild("symbol").limitToFirst(1).on("child_added", function(snapshot3) {
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
            dataRef.orderByChild("symbol").limitToFirst(1).on("child_added", function(snapshot3) {
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
            dataRef.orderByChild("symbol").limitToFirst(1).on("child_added", function(snapshot3) {
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
            dataRef.orderByChild("symbol").limitToFirst(1).on("child_added", function(snapshot3) {
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
            dataRef.orderByChild("symbol").limitToFirst(1).on("child_added", function(snapshot3) {
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


// BEGIN 'TOP % ADVANCERS' FUNCTION
    if (scanners.$id === "Top % Advancers") {
      console.log("inside calc via TOP % ADVANCERS");
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
            dataRef.orderByChild("symbol").limitToFirst(1).on("child_added", function(snapshot3) {
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
// END 'TOP % ADVANCERS' FUNCTION


// BEGIN 'TOP % DECLINERS' FUNCTION
    if (scanners.$id === "Top % Decliners") {
      console.log("inside calc via TOP % DECLINERS");
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
            dataRef.orderByChild("symbol").limitToFirst(1).on("child_added", function(snapshot4) {
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
               // $location.path("/data");  // take user to this location
                //   // to access yesterday's dataset only, get number of entries with
                //   // var length = childData.length;
                // })
              })


            })
          });
    });
    // addTen(userData);
  }
// END 'TOP % DECLINERS' FUNCTION


// PUSH TOP 10 TO FIREBASE
  // function addTen (userData) {
  //   newData.orderByChild("calculation").limitToLast(2).on("child_added", function(snapshot4) {
  //     newData.remove();  // remove old data
  //     // snapshot.forEach(function(childSnapshot4) {  // The callback function is called for each day's data
  //     // console.log("snapshot", snapshot4.val());  // log each stock (# limited above by limitToLast)
  //     var key = snapshot4.key();  // key is the unique ID of each day's data
  //     var topTenData = snapshot4.val();  // topTenData is contents of the child
  //     var topTenTicker = topTenData.ticker;
  //     var topTenCalc = topTenData.calculation;

  //     console.log("TopTen", topTenTicker, topTenCalc);

  //     // userData.$add({  // add tickers/calculations to Firebase
  //     //   ticker: topTenTicker,
  //     //   calculation: topTenCalc
  //     // });
  //   });
  // }
}  
// END CALC FUNCTION


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
    // console.log("stocks = ", $scope.stocks)


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
      var listName = $scope.watchName;
      console.log("listName = ", listName);
      listRef.child(listName)
      listRef.child(listName).push("");
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
};


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


  }  // END OF CONTROLLER FUNCTION -> (all functionality goes inside this function)
]);