temp code (possible later use)

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


