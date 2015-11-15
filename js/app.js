var domain = 'https://databox.me';


/* ---- DON'T EDIT BELOW ---- */
var accURL = {};

var init = function() {

  var parser = document.createElement('a');
  parser.href = domain;
  accURL.host = parser.host; // => "example.com"
  accURL.path = parser.pathname; // => "/pathname/"
  accURL.schema = parser.protocol + '//';

  document.querySelector(".domain").innerHTML = accURL.host;
  // Hide example
  document.querySelector(".accountexample").style.display = "none";
  // Article
  document.querySelector(".first").style.display = "";
  document.querySelector(".second").style.display = "none";
  document.querySelector(".third").style.display = "none";
  // Tooltips
  document.querySelector(".left").style.display = "";
  document.querySelector(".middle").style.display = "none";
  document.querySelector(".right").style.display = "none";
}

var setProgression = function(val) {
  if (val) {
    document.querySelector(".progression").style.width = val;
  }
};

var makeURI = function(username) {
  if (username.length > 0) {
    return accURL.schema + username + '.' + accURL.host + '/';
  }
  return null;
}

var updateURI = function() {
  var account = document.querySelector("#account").value;
  document.querySelector(".username").innerHTML = account;
  if (account.length > 0) {
    document.querySelector(".accountexample").style.display = "";
  } else {
    document.querySelector(".accountexample").style.display = "none";
    document.querySelector(".next").style.pointerEvents = "none";
  }
};

var checkExists = function() {
  var account = document.querySelector("#account").value;
  if (account.length > 0) {
    var url = makeURI(account);
    console.log(url);
    var http = new XMLHttpRequest();
    http.open('HEAD', url);
    http.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          if (this.status === 404) {
            console.log("available");
          } else {
            console.log("exists");
          }
        }
    };
    http.send();
  }
}

var setStep = function(step) {
  console.log("Step: "+step);
  switch(step) {
    case 0:
      // Progression
      setProgression("0%");
      document.querySelector(".first-bullet").classList.remove("completed")
      document.querySelector(".second-bullet").classList.remove("completed");
      document.querySelector(".third-bullet").classList.remove("completed");
      // Article
      document.querySelector(".first").style.display = "";
      document.querySelector(".second").style.display = "none";
      document.querySelector(".third").style.display = "none";
      // Tooltips
      document.querySelector(".left").style.display = "";
      document.querySelector(".middle").style.display = "none";
      document.querySelector(".right").style.display = "none";
      break;
    case 1:
      // Progression
      setProgression("50%");
      document.querySelector(".first-bullet").classList.add("completed")
      document.querySelector(".second-bullet").classList.remove("completed");
      document.querySelector(".third-bullet").classList.remove("completed");
      // Article
      document.querySelector(".first").style.display = "none";
      document.querySelector(".second").style.display = "";
      document.querySelector(".third").style.display = "none";
            // Tooltips
      document.querySelector(".left").style.display = "none";
      document.querySelector(".middle").style.display = "";
      document.querySelector(".right").style.display = "none";
      break;
    case 2:
      // Navigation
      document.querySelector(".next").innerHTML = "Finish";
      // Progression
      setProgression("100%");
      document.querySelector(".first-bullet").classList.add("completed")
      document.querySelector(".second-bullet").classList.add("completed");
      document.querySelector(".third-bullet").classList.remove("completed");
      // Article
      document.querySelector(".first").style.display = "none";
      document.querySelector(".second").style.display = "none";
      document.querySelector(".third").style.display = "";
      // Tooltips
      document.querySelector(".left").style.display = "none";
      document.querySelector(".middle").style.display = "none";
      document.querySelector(".right").style.display = "";

      break;
  }

}

// Init app
init();