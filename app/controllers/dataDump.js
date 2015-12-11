app.controller('dataDump', ["$scope", "$firebaseArray", "$q", "$http", 
  function($scope, $firebaseArray, $q, $http) {

// PRIVATE

   console.log("inside dataDump!"); 

// Just like in the RequireJS version of Music History, make a reference
    var ref = new Firebase("https://market-wizard.firebaseio.com/stocks");
// console.log(ref);
  // Instead of snapshot.val(), use this syntax to get stocks
    $scope.stocks = $firebaseArray(ref);

    console.log("stocks = ", $scope.stocks);
  }
]);

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

  var stockPromise = loadStocks();  // Store the promise as a private variable

// PUBLIC

  return {
    loadStocks: function() {
      return stockPromise;
    },
    getStocks: function() {
      console.log("Factory returning stock_list", stock_list);
      return stock_list;
    },
    getStock: function(name) {
      console.log("Factory returning single stock");
      return stock_list.filter(function(stock){
        return stock.name === name;
      })[0];
    },
    addStocks: function(stocks) {
      // stock_list = Object.keys(stocks).map(s => stocks[s]);
      stock_list = objectFromJSONFile.Dec1015;  // move array of objects into variable
      console.log("Stock list added to factory");
      // stock_list = stocks;
      return stock_list;
    },
    addStock: function(stock) {
      console.log("Add single stock to factory");
      stock_list.push(stock);
      return stock_list;
    }
  }
}
]);