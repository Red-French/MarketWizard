// ++++++ USER-DEFINED SCAN FUNCTIONALITY ++++++++++++++++++++++++++++++++++++++++++++++++++++
// ADDS NEW SCAN NAME UNDER USER'S FIREBASE ID

  $scope.newScan = function(addToThisList) {
    console.log("inside newScan()");
    var scanName = undefined;  // for name of new scan

    var ref = new Firebase("https://market-wizard.firebaseio.com/");  // make reference to database
    // console.log("ref", ref);
    var currentAuth = ref.getAuth().uid;  // get current user's ID
    // console.log("currentAuth = ", currentAuth);
    var listRef = new Firebase("https://market-wizard.firebaseio.com/userScans/" + currentAuth);
    // console.log("listRef", listRef);
    // var scanName = $firebaseArray(listRef);  // move user's watchlists into an array
    // console.log("scanName = ", scanName);

    var newScan = {
      "scan": $scope.scanName
    };

    if ($scope.scanName != undefined || null || "") {
        scanName = $scope.scanName;  // obtain name of new scan from input field
        listRef.child(scanName).push();  // add scan name to user's list of scan names
        $('#addScanModal').modal('show'); // NEED TO ADD MODAL
    } 
    $scope.scanName = "";  // clear 'or enter new Watchlist' field
};

