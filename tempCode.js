temp code (possible later use)

1. order by value
2. get length
3. if length>10,
4. loop over length-10 and remove()


// Record the current time immediately, and queue an event to
// record the time at which the user disconnects.
var sessionsRef = new Firebase('https://samplechat.firebaseio-demo.com/sessions/');
var mySessionRef = sessionsRef.push();
mySessionRef.onDisconnect().update({ endedAt: Firebase.ServerValue.TIMESTAMP });
mySessionRef.update({ startedAt: Firebase.ServerValue.TIMESTAMP });



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


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++ CONNECT USER'S ID TO STOCK AND RETRIEVE STOCK +++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// ADD USER'S ID TO 'SYMBOL' IN FIREBASE 'STOCKS'
      // var userTickers = stocksRef.orderByChild("symbol").equalTo("AAL");
      // console.log("stocksRef", stocksRef);
      // console.log("userTickers", userTickers);



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

// * removes ticker from DOM but NOT from Firebase
  document.querySelector("body").addEventListener("click", function(event) {  // list for click events
    // console.log(event);
    if (event.target.className === "deleteButton") {  // if click is on a 'delete' button
      // console.log("You clicked on 'Delete'");
      console.log(event.target.parentElement);  // log html to be removed
      event.target.parentElement.remove();  // remove chosen ticker from DOM
    }
  });



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


  // // LOCATE USER'S TICKER CHOICE
  // angular.forEach(watchList, function(element, key) {  // loop over Firebase list
  //   console.log(key);
  //   console.log(watchList[key].ticker);
  //   if (watchList[key].ticker === stockTicker) {
  //     console.log("guess what? Found", stockTicker);
  //     console.log(watchList[key]);
  //     tickerChosen = watchList[key].ticker;
  //     console.log("chosen ticker and its key=", tickerChosen + " " + key);
  //     // watchList[i].remove();
  //     return;
  //   }
  // });

  // angular.forEach(watchList, function(element, i) {  // loop over Firebase list
  //   console.log(i);
  //   console.log(watchList[i].ticker);
  //   if (watchList[i].ticker === stockTicker) {
  //     console.log("guess what? Found", stockTicker);
  //     console.log(watchList[i]);
  //     tickerChosen = watchList[i].ticker;
  //     console.log("chosen ticker =", tickerChosen);
  //   }
  //
  // })









// SORT DATA
var sortData = new Firebase("https://market-wizard.firebaseio.com/data2/");
sortData.orderByValue().limitToLast(3).on("value", function(snapshot) {
  snapshot.forEach(function(data) {
    // console.log("The " + data.key() + " dinosaur's score is " + data.close);
  });
});


// $scope.changeList =  function(chosenWatchList) {
//   console.log("chosen watchlist", chosenWatchList);
//   var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
//   var currentAuth = ref.getAuth().uid;  // get current user's ID
//   // console.log("current user = ", currentAuth);
//   var stocksRef = new Firebase("https://market-wizard.firebaseio.com/watchlists/"  + currentAuth);  // make reference to location of current user's watchlists
//   // console.log("stocksRef = ", stocksRef);
//   var userStocks = $firebaseArray(stocksRef);

//   console.log("user's stock list = ", userStocks)
// }



// NOT USING CURRENTLY!!!!!!! --
// PUSH TOP 10 TO FIREBASE --
//   function addTen () {
//       newTop10.remove();  // remove old data
//     newData.orderByChild("calculation").on("child_added", function(snapshot5) {

//       // snapshot.forEach(function(childSnapshot4) {  // The callback function is called for each day's data
//       console.log("snapshot", snapshot5.val());  // log each stock (# limited above by limitToLast)
//       var key = snapshot5.key();  // key is the unique ID of each day's data
//       var topTenData = snapshot5.val();  // topTenData is contents of the child
//       var topTenTicker = topTenData.ticker;
//       var topTenCalc = topTenData.calculation;

//       console.log("TopTen", topTenTicker, topTenCalc);

//       top10.$add({  // add tickers/calculations to Firebase
//         ticker: topTenTicker,
//         calculation: topTenCalc
//       });
//     });


// newTop10.orderByChild("calculation").on("child_added", function(snapshot) {
//   console.log(snapshot.key() + " was " + snapshot.val().calculation);
// });


// var ref = new Firebase("https://dinosaur-facts.firebaseio.com/dinosaurs");
// ref.orderByChild("height").on("child_added", function(snapshot) {
//   console.log(snapshot.key() + " was " + snapshot.val().height + " meters tall");
// });


//   }
