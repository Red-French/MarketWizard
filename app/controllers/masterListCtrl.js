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

    var testRef = new Firebase("https://market-wizard.firebaseio.com/data");
    
    var monthArray = ["jan", "feb", "mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]

    var today = new Date();
    var dayNum = today.getDay().toString();
    var month = monthArray[today.getMonth()];
    var year = today.getFullYear();

    var full = month + dayNum + year;

    // testRef.child(full).push(
    //   response.data.results
    // );

    testRef.push(response.data.results);

  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
}



  }
]);



  // var ref = new Firebase("https://market-wizard.firebaseio.com/");  // reference database and get current user ID
  // var currentAuth = ref.getAuth();
  // var userRef = new Firebase("https://market-wizard.firebaseio.com/users/" + currentAuth.uid);  // referencing firebase data by current user's id


  // var userData = $firebaseObject(userRef);
  //   console.log("userData", userData);
  //   $scope.userData = userData;

  // var stocksRef = new Firebase("https://market-wizard.firebaseio.com/stocks");  // changing the objects in firebase into an array for angularjs
  // $scope.tickers = $firebaseArray(stocksRef);


  // var userwatchlistRef = new Firebase(userRef + "/watchlists")

  //   var newWatchlist = {
  //     "headerText": event.target.title,
  //     "blurbText": event.target.attributes.description.nodeValue,
  //     "img": event.target.attributes.imageurl.nodeValue
  //   }
  //   console.log("newWatchlist", newWatchlist);

  //   userRef.child("newWatchlist").push(newWatchlist);


  // $scope.logout = function() {
  // // get authdata object by calling firebase method on reference created up top
  // var authData = ref.getAuth();
  // console.log("authData", authData);
  // console.log("authData.uid", authData.uid);
  // // unauthorize user location
  // userRef.unauth();
  // console.log("authData", authData);
  // }
// }]);