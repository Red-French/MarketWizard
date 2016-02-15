// * removes ticker from DOM but NOT from Firebase
  document.querySelector("body").addEventListener("click", function(event) {  // list for click events
    // console.log(event);
    if (event.target.className === "deleteButton") {  // if click is on a 'delete' button
      // console.log("You clicked on 'Delete'");
      console.log(event.target.parentElement);  // log html to be removed
      event.target.parentElement.remove();  // remove chosen ticker from DOM
    }
  });