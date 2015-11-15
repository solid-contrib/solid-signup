var domain = 'https://databox.me';


/* ---- DON'T EDIT BELOW ---- */
var accURL = {};
var cardPath = "/profile/card";

var init = function() {
  // Prepare domain
  var parser = document.createElement('a');
  parser.href = domain;
  accURL.host = parser.host; // => "example.com"
  accURL.path = parser.pathname; // => "/pathname/"
  accURL.schema = parser.protocol + '//';

  // Add listener
  document.querySelector(".account").addEventListener('keypress', function(e) {
    if (e.which == 13) {
      checkExists();
    }
  });

  document.querySelector(".domain").innerHTML = accURL.host;
  // Hide success
  document.querySelector(".successbox").style.display = "none";
  // Hide example
  document.querySelector(".accountinfo").style.display = "none";
  // Article
  document.querySelector(".first").style.display = "";
  document.querySelector(".second").style.display = "none";
  document.querySelector(".third").style.display = "none";
  // Tooltips
  document.querySelector(".left").style.display = "";
  document.querySelector(".middle").style.display = "none";
  document.querySelector(".right").style.display = "none";
  // Availability
  resetAvailability();

  setStep(2);
}

var resetAvailability = function() {
  document.querySelector(".email").style.display = "none";
  document.querySelector(".next").style.display = "none";
  document.querySelector(".available").style.display = "none";
  document.querySelector(".taken").style.display = "none";
  document.querySelector(".createacc").style.display = "none";
  document.querySelector(".check").style.display = "";
  document.querySelector(".accountinfo").classList.remove('green');
  document.querySelector(".check").classList.add("disabled");
  document.querySelector(".createacc").classList.remove("greenbg");
  document.querySelector(".createacc").classList.add("disabled");
}

var setProgression = function(val) {
  if (val) {
    document.querySelector(".progression").style.width = val;
  }
};

var makeURI = function(username) {
  if (username.length > 0) {
    return accURL.schema + username + '.' + accURL.host;
  }
  return null;
}

var validateAccount = function() {
  var account = document.querySelector(".account").value;
  document.querySelector(".username").innerHTML = account;
  if (account.length > 0) {
    document.querySelector(".accountinfo").style.display = "";
    document.querySelector(".account").classList.remove("disabled");
  } else {
    resetAvailability();
  }
};

var validateEmail = function() {
  // var account = document.querySelector(".account").value;
  var address = document.querySelector(".address").value;
  var re = /\S+@\S+\.\S+/;
  if (re.test(address)) {
    document.querySelector(".createacc").style.pointerEvents = "";
    document.querySelector(".createacc").classList.add("greenbg");
    document.querySelector(".createacc").classList.remove("disabled");
  } else {
    document.querySelector(".createacc").style.pointerEvents = "none";
    document.querySelector(".createacc").classList.add("disabled");
  }
};

var isAvailable = function(url) {
  document.querySelector(".available").style.display = "";
  document.querySelector(".taken").style.display = "none";
  document.querySelector(".createacc").style.display = "";
  document.querySelector(".check").style.display = "none";
  document.querySelector(".email").style.display = "";
  document.querySelector(".accountinfo").classList.add('green');
};

var isTaken = function(url) {
  document.querySelector(".available").style.display = "none";
  document.querySelector(".taken").style.display = "";
}

var checkExists = function() {
  var account = document.querySelector(".account").value;
  if (account.length > 0) {
    var url = makeURI(account) + '/';
    var http = new XMLHttpRequest();
    http.open('HEAD', url);
    http.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          if (this.status === 404) {
            isAvailable(url);
          } else {
            isTaken(url);
          }
        }
    };
    http.send();
  }
}

var createAccount = function() {
  var account = document.querySelector(".account").value;
  if (account.length > 0) {
    var url = makeURI(account) + cardPath;
    var http = new XMLHttpRequest();
    http.open('PUT', url);
    http.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          if (this.status === 200 || this.status === 201) {
            accountDone();
          } else {
            console.log('Error creating WebID at '+url);
          }
        }
    };
    http.send();
  }
}

var accountDone = function() {
  document.querySelector(".createacc").style.display = "none";
  document.querySelector(".first").style.display = "none";
  document.querySelector(".successbox").style.display = "";
  document.querySelector(".next").style.display = "";
};

var setStep = function(step) {
  console.log("Step: "+step);
  switch(step) {
    case 1:
      // Progression
      setProgression("0%");
      document.querySelector(".first-bullet").classList.remove("completed");
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
    case 2:
      // Progression
      setProgression("50%");
      document.querySelector(".first-bullet").classList.add("completed");
      document.querySelector(".second-bullet").classList.remove("completed");
      document.querySelector(".third-bullet").classList.remove("completed");
      // Article
      document.querySelector(".first").style.display = "none";
      document.querySelector(".second").style.display = "";
      document.querySelector(".third").style.display = "none";
      document.querySelector(".successbox").style.display = "none";
      // Tooltips
      document.querySelector(".left").style.display = "none";
      document.querySelector(".middle").style.display = "";
      document.querySelector(".right").style.display = "none";
      break;
    case 3:
      // Navigation
      document.querySelector(".check").innerHTML = "Finish";
      // Progression
      setProgression("100%");
      document.querySelector(".first-bullet").classList.add("completed");
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