app.controller('dataDump', ["$scope", "$firebaseArray", 
  function($scope, $firebaseArray) {

   console.log("inside dataDump!"); 


curl -X PUT -d '""' \
  'https://market-wizard.firebaseio.com/data1.json'


// Just like in the RequireJS version of Music History, make a reference
    var ref = new Firebase("https://market-wizard.firebaseio.com/stocks");
// console.log(ref);
  // Instead of snapshot.val(), use this syntax to get stocks
    $scope.stocks = $firebaseArray(ref);

    console.log("stocks = ", $scope.stocks);
  }
// ]);

  var stock_list;

  function loadStocks () {
    return $q(function(resolve, reject) {  // promises
      $http.get('../../data/data2.json')  // $http is the Angular AJAX call
      .success(  // promises uses '.success' for success or failure of the call
        function(objectFromJSONFile) { 
          /* 
          Convert Firebase's object of objects into an array of objects, and store it in the private variable
          */
          // stock_list = Object.keys(objectFromJSONFile.stocks).map(stock => objectFromJSONFile.stocks[stock]);
          stock_list = objectFromJSONFile.Dec1015;  // move array of objects into variable
          console.log("stockFactory>loadStocks()>stock_list", objectFromJSONFile.Dec1015);
          resolve(objectFromJSONFile.stocks);  // if call is successful
        }, function(error) {  // if call fails
          reject(error);
        }
      );
    });
  }
]);