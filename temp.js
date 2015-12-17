// CALCULATE TODAY'S DATA VS YESTERDAY'S DATA
    dataRef2.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {  // The callback function is called for each day's data
        // console.log("snapshot", snapshot.val());  // each day's dataset is console logging
        var key = childSnapshot.key();  // key is the unique ID of each day's data
        console.log("key", key);
        var childData = childSnapshot.val();  // childData is contents of the child
        // console.log("childData.length", childData.length);
        console.log("date", childData[0].serverTimestamp);

        childData.forEach(function(object) {  // loops through TODAY'S data
        // console.log("object.name", object.name);
        // console.log("object.lastPrice", object.lastPrice);

      // loops through YESTERDAY'S data and compares to TODAY'S data
          dataRef.once("value", function(snapshot) {
            snapshot.forEach(function(yesterdayChildSnapshot) {  // The callback function is called for each day's data
          //     // console.log("snapshot", snapshot.val());  // each day's dataset is console logging
              var key = yesterdayChildSnapshot.key();  // key is the unique ID of each day's data
              console.log("key", key);
          //     var childData = yesterdayChildSnapshot.val();  // childData is contents of the child
          //     // console.log("childData.length", childData.length);
          //     console.log("date", childData[0].serverTimestamp);
            })
          });
        })
      });
    });

// 
// 
// NO NESTED LOOP
    dataRef2.once("value", function(snapshot2) {
      snapshot2.forEach(function(childSnapshot2) {  // The callback function is called for each day's data
        // console.log("snapshot", snapshot.val());  // each day's dataset is console logging
        var key = childSnapshot2.key();  // key is the unique ID of each day's data
        console.log("key", key);
        var childData2 = childSnapshot2.val();  // childData2 is contents of the child
        // console.log("childData2.length", childData2.length);
        // console.log("date", childData2[2].serverTimestamp);
        // console.log("childData2", childData2.lastPrice);
          childData2.forEach(function(object) {  // loop through data
            // console.log("object.name", object.name);
            var tickerToday = object;
            $scope.tickerToday;
            // console.log("object.lastPrice", object.lastPrice);
          })
        })
    });

    dataRef.once("value", function(snapshot) {
      console.log("INSIDE DATAREF.ONCE");

                  dataRef.orderByChild("symbol").limitToLast(1).on("child_added", function(snapshot3) {
      // snapshot.forEach(function(childSnapshot) {  // The callback function is called for each day's data
        // console.log("snapshot", snapshot.val());  // each day's dataset is console logging
        var key = snapshot3.key();  // key is the unique ID of each day's data
        console.log("key", key);
        var childData = snapshot3.val();  // childData is contents of the child
        // console.log("childData.length", childData.length);
        // console.log("date", childData[0].serverTimestamp);
          // childData.forEach(function(object) {  // loop through data
            // console.log("object.name", object.name);
            // console.log("object.lastPrice", object.lastPrice);

        // to access yesterday's dataset only, get number of entries with
        // var length = childData.length;
        // 
        // MATH FUNCTIONALITY GOES HERE
        // MATH FUNCTIONALITY GOES HERE
        // MATH FUNCTIONALITY GOES HERE

        // MATH FUNCTIONALITY GOES HERE
        // MATH FUNCTIONALITY GOES HERE
        // MATH FUNCTIONALITY GOES HERE
        })
      // });
});
    // });