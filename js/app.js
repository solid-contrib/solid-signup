var domain = 'databox.me';


/* ---- DON'T EDIT BELOW ---- */
var step = 0;

var init = function() {
  document.querySelector(".domain").innerHTML = domain;
  // Hide example
  document.querySelector(".accountexample").style.display = "none";
  // Prev button
  document.querySelector(".prev").style.display = "none";
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

var updateURI = function() {
  var account = document.querySelector("#account").value;
  document.querySelector(".username").innerHTML = account;
  if (account.length > 0) {
    document.querySelector(".accountexample").style.display = "";
  } else {
    document.querySelector(".accountexample").style.display = "none";
  }

};

var setStep = function() {
  console.log("Step: "+step);
  switch(step) {
    case 0:
      document.querySelector(".prev").style.display = "none";
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
      document.querySelector(".prev").style.display = "";
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
      document.querySelector(".prev").style.display = "none";
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

var prevStep = function() {
  if (step >= 1) {
    step--;
    setStep();
  }
}

var nextStep = function() {
  step++;
  setStep();
}

// Init app
init();