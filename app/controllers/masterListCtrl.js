app.controller('masterListCtrl', ["$scope", "$http", "$firebaseArray",  
  function($scope, $http, $firebaseArray) {
   console.log("inside masterList.Ctrl"); 

  $scope.searchText = "";

// Grab data:
// Just like in the RequireJS version of Music History, make a reference
    var dataRef = new Firebase("https://market-wizard.firebaseio.com/data"); // grab data from Firebase
    var data;
    var data = $firebaseArray(dataRef);

    data.$loaded()
    .then(function(data) {  // promise
      $scope.data = data[0]
      console.log($scope.data)
    })
 


// update data via API call on user click of 'update'
  $scope.update = function() {
    console.log("inside update function");
    $http({
    method: 'GET',
    url: 'http://marketdata.websol.barchart.com/getQuote.json?key=c9babb86c20c5590c36e517422ff237c&symbols=AAL,AAPL,ADBE,ADI,ADP,ADSK,AKAM,ALXN,AMAT,AMGN,AMZN,ATVI,AVGO,BBBY,BIDU,BIIB,BMRN,CA,CELG,CERN,CHKP,CHRW,CHTR,CMCSA,CMCSK,COST,CSCO,CTSH,CTXS,DISCA,DISCK,DISH,DLR,EA,EBAY,ESRX,EXPD,EXPE,FAST,FB,FISV,FOX,FOXA,GILD,GMCR,GOOG,GOOGL,GRMN,HSIC,INCY,INTC,INTU,ILMN,ISRG,JD,KLAC,KHC,LBTYA,LBTYK,LILA,LILAK,LLTC,LMCA,LRCX,LVNTA,MAR,MAT,MDLZ,MNST,MSFT,MU,MYL,NFLX,NTAP,NVDA,NXPI,ORLY,PAYX,PCAR,PCLN,PYPL,QCOM,QVCA,REGN,ROST,SBAC,SBUX,SIRI,SNDK,SPLS,SRCL,STX,SWKS,SYMC,TSCO,TSLA,TRIP,TXN,VIAB,VIP,VOD,VRSK,VRTX,WBA,WDC,WFM,WYNN,XLNX,YHOO'
  }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      console.log("successful response for red ", response.data.results);

      var dataRef = new Firebase("https://market-wizard.firebaseio.com/data");
      
      var monthArray = ["jan", "feb", "mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]

      var today = new Date();
      var dayNum = today.getDay().toString();
      var month = monthArray[today.getMonth()];
      var year = today.getFullYear();

      var full = month + dayNum + year;

      // dataRef.child(full).push(
      //   response.data.results
      // );

      dataRef.push(response.data.results);

    }, function errorCallback(response) {  // called asynchronously if an error occurs
                                          // or server returns response with an error status.
    });
  }

// Creates new watchlist for user
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

  $scope.newTicker = function() {
    console.log("inside newTicker function");
    console.log("user 'add to watchlist' input field value = ", $scope.addTicker);

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
      // console.log("listName = ", listName);
      // listRef.child(listName).push(newStock);

      var newStock = $scope.addTicker;
      console.log("stock = ", newStock);
      listRef.child(listName).push(newStock);

      }


  $scope.predicate = 'lastPrice';
  $scope.reverse = true;
  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
  };


    $scope.colors = [
      {name:'black', shade:'dark'},
      {name:'white', shade:'light', notAnOption: true},
      {name:'red', shade:'dark'},
      {name:'blue', shade:'dark', notAnOption: true},
      {name:'yellow', shade:'light', notAnOption: false}
    ];
    $scope.myColor = $scope.colors[2]; // red
  
  }  // end of controller function (all functionality goes inside this function)
]);




