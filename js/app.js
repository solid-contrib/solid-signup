/* ---- CONFIGURATION ----- */
var DOMAIN = 'https://databox.me';
var ACCOUNT_ENDPOINT = ',system/newAccount';
var CERT_ENDPOINT = ',system/newCert';

/* ---- DON'T EDIT BELOW ---- */
var accURL = {};
var queryVals = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

var init = function() {
  // External source?
  var _domain = queryVals['domain'];
  var _accEndpoint = queryVals['acc'];
  var _crtEndpoint = queryVals['crt'];

  // Prepare domain
  var parser = document.createElement('a');
  parser.href = (_domain && _domain.length > 0)?_domain:DOMAIN;
  accURL.host = parser.host + '/'; // => "example.com"
  accURL.path = parser.pathname; // => "/pathname/"
  accURL.schema = parser.protocol + '//';

  // Prepare account endpoint
  if (_accEndpoint && _accEndpoint.length > 0) {
    ACCOUNT_ENDPOINT = _accEndpoint;
  }
  // Prepare cert endpoint
  if (_crtEndpoint && _crtEndpoint.length > 0) {
    CERT_ENDPOINT = _crtEndpoint;
  }

  document.querySelector(".welcome").innerHTML = parser.host;

  // Add listener
  document.querySelector(".account").addEventListener('keypress', function(e) {
    if (e.which == 13) {
      checkExists();
    }
  });

  document.querySelector(".schema").innerHTML = accURL.schema;
  document.querySelector(".domain").innerHTML = accURL.host;

  // Availability
  resetAvailability();

  setStep(1);

  document.querySelector(".account").scrollIntoView();
}

var resetAvailability = function() {
  document.getElementById("profile").style.display = "none";
  document.querySelector(".status").innerHTML = '';
  document.querySelector(".illegal").style.display = "none";
  document.querySelector(".createacc").style.display = "none";
  document.querySelector(".check").style.display = "";
  document.querySelector(".accountinfo").classList.remove('green');
  document.querySelector(".accountinfo").style.display = "none";
  document.querySelector(".check").classList.add("disabled");
  document.querySelector(".createacc").classList.remove("greenbg");
  document.querySelector(".createacc").classList.add("disabled");
  document.querySelector(".return").style.display = "none";
  document.querySelector(".done").style.display = "none";
}

var makeURI = function(username) {
  if (username.length > 0) {
    return accURL.schema + username + '.' + accURL.host;
  }
  return null;
}

var validateAccount = function() {
  resetAvailability();
  var account = document.querySelector(".account").value;
  // cleaup
  account = account.toLowerCase().replace(/\s+/g, '-');
  if (account.indexOf('-') === 0) {
    account = account.slice(1);
  }
  var re = /^[a-zA-Z0-9-_]*$/;
  if (account.length === 0) {
    resetAvailability();
  } else if (re.test(account)) {
    document.querySelector(".account").value = account;
    document.querySelector(".username").innerHTML = account;
    document.querySelector(".accountinfo").style.display = "";
    document.querySelector(".check").classList.remove("disabled");
    document.querySelector(".createacc").style.pointerEvents = "";
    document.querySelector(".createacc").classList.add("greenbg");
    document.querySelector(".createacc").classList.remove("disabled");
  } else {
    resetAvailability();
    document.querySelector(".illegal").style.display = "";
  }
};


var isAvailable = function(url) {
  document.querySelector(".createacc").style.display = "";
  document.querySelector(".check").style.display = "none";
  document.getElementById("profile").style.display = "";
  document.querySelector(".accountinfo").classList.add('green');
  document.querySelector(".accountinfo").classList.remove('red');
  window.setTimeout(function () {
    document.querySelector(".account").focus();
  }, 0);
};

var isTaken = function(url) {
  document.querySelector(".status").innerHTML = "is taken";
  document.querySelector(".accountinfo").classList.remove('green');
  document.querySelector(".accountinfo").classList.add('red');
}

var checkExists = function() {
  var account = document.querySelector(".account").value;
  if (account.indexOf('-') === 0) {
    account = account.slice(1);
  }
  if (account.lastIndexOf('-') === account.length - 1) {
    account = account.slice(0, -1)
  }
  document.querySelector(".account").value = account;
  document.querySelector(".username").innerHTML = account;
  if (account.length > 0) {
    var url = makeURI(account);
    var http = new XMLHttpRequest();
    http.open('HEAD', url);
    http.onreadystatechange = function() {
      console.log(this.status)
        if (this.readyState == this.DONE) {
          if (this.status === 0) {
            // disconnected
            document.querySelector(".status").innerHTML = "<strong>could not connect to server</strong>";
          } else if (this.status === 404) {
            isAvailable(url);
          } else {
            isTaken(url);
          }
        }
    };
    http.send();
  }
}

var setStep = function(step) {
  switch(step) {
    case 1:
      // Hide buttons
      document.querySelector(".update").style.display = "none";
      document.querySelector(".issue").style.display = "none";
      // Hide success
      document.querySelector(".successbox").style.display = "none";
      // Hide example
      document.querySelector(".accountinfo").style.display = "none";
      // Article
      document.querySelector(".signup").style.display = "";
      document.querySelector(".finish").style.display = "none";
      // Scroll into view
      scrollIntoView('.account');
      break;
    case 2:
      // Hide buttons
      document.querySelector(".createacc").style.display = "none";
      document.querySelector(".check").style.display = "none";
      document.querySelector(".issue").style.display = "none";
      document.querySelector(".update").style.display = "";
      // Article
      document.querySelector(".signup").style.display = "none";
      document.querySelector(".finish").style.display = "";
      document.querySelector(".successbox").style.display = "none";
      // Scroll into view
      scrollIntoView('.fullname');
      // Gravatar
      setGravatar();
      // Focus
      window.setTimeout(function () {
        document.querySelector(".fullname").focus();
      }, 0);
      break;
    case 3:
      // Hide buttons
      document.querySelector(".check").style.display = "none";
      document.querySelector(".createacc").style.display = "none";
      document.querySelector(".update").style.display = "none";
      document.querySelector(".issue").style.display = "";
      // Article
      document.querySelector(".successbox").style.display = "none";
      document.querySelector(".signup").style.display = "none";
      document.querySelector(".finish").style.display = "";
      // Set cert name
      var certname = document.querySelector('.fullname').value;
      if (certname.length === 0) {
        account = document.querySelector('.account').value;
        certname = "My "+account+" WebID account";
      }
      document.querySelector(".certname").value = certname;
      // Scroll into view
      scrollIntoView();
      break;
  }
};

var clickFileInput = function() {
  document.querySelector("#inputFileToLoad").click();
}

var loadImageFileAsURL = function() {
  var dataURL;
  var filesSelected = document.getElementById("inputFileToLoad").files;
  console.log(filesSelected)
  if (filesSelected.length > 0) {
    var fileToLoad = filesSelected[0];
    var img = document.querySelector(".profilepic");

    if (fileToLoad.type.match("image.*")) {
      var fileReader = new FileReader();
      fileReader.onload = function(fileLoadedEvent) {
        img.src = fileLoadedEvent.target.result;
        var canvas = document.createElement("canvas");
        canvas.style.display = "none";
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var MAX_WIDTH = 300;
        var MAX_HEIGHT = 300;
        var width = img.width;
        var height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // show new image
        document.querySelector(".camera-wrap").classList.add('hidden');
        img.classList.remove('hidden');

        // prepare to upload profile image
        var dataURI = canvas.toDataURL(fileToLoad.type);

        // clean up used elements
        delete canvas;
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  }
};

var updateProfile = function() {
  console.log("Called update");
  var profile = {};
  profile.fullname = document.querySelector('.fullname').value;

  var account = document.querySelector(".account").value;
  if (account.length > 0) {
    var url = makeURI(account) + 'profile/';
    profile.url = url+'card';
    // upload profile picture
    var dataURI = document.querySelector('.profilepic').getAttribute('src');
    if (dataURI && dataURI.length > 0) {
      if (dataURI.slice(0, 4) === 'http') {
        profile.picture = dataURI;
        patchProfile(profile);
        return
      }
      // convert dataURL to blob (binary)
      var byteString = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var ext = mimeString.split('/')[1];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++)
      {
          ia[i] = byteString.charCodeAt(i);
      }

      var bb = new Blob([ab], { "type": mimeString });

      var fd = new FormData();
      fd.append("File", bb, 'avatar.'+ext);
      // xhr request
      var http = new XMLHttpRequest();
      http.open("POST", url);
      http.withCredentials = true;
      http.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          if (this.status === 200 || this.status === 201) {
            // patch profile
            profile.picture = this.getResponseHeader('Location');
            patchProfile(profile);
          }
        }
      };
      http.send(fd);
    } else {
      patchProfile(profile);
    }
  }
};

var patchProfile = function(profile) {
  var query = '';
  var toUpdate = 0;

  if (profile && profile.fullname && profile.fullname.length > 0) {
    toUpdate++;
    query += "INSERT DATA { <#me> <http://xmlns.com/foaf/0.1/name> \""+profile.fullname+"\" . }";
  }

  if (profile && profile.picture && profile.picture.length > 0) {
    toUpdate++;
    query += " ;\n";
    query += "INSERT DATA { <#me> <http://xmlns.com/foaf/0.1/img> <"+profile.picture+"> . }";
  }

  if (toUpdate > 0) {
    var http = new XMLHttpRequest();
    http.open("PATCH", profile.url);
    http.setRequestHeader('Content-Type', 'application/sparql-update');
    http.withCredentials = true;
    http.onreadystatechange = function() {
      if (this.readyState == this.DONE) {
        if (this.status === 200) {
          console.log("Updated profile!");
          setStep(3);
        }
      }
    };
    http.send(query);
  } else {
    setStep(3);
  }
};

var createAccount = function() {
  var account = document.querySelector(".account").value;
  var email = document.querySelector(".address").value;
  if (account.length > 0) {
    var url = makeURI(account) + ACCOUNT_ENDPOINT;
    var data = "username="+account+"&email="+email;
    var http = new XMLHttpRequest();
    http.open('POST', url);
    http.withCredentials = true;
    http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          if (this.status === 200) {
            var webid = this.getResponseHeader("User");
            if (webid && webid.length > 0) {
              document.querySelector(".webid").value = webid;
            }
            updateProfile();
          } else {
            console.log('Error creating account at '+url);
            setStep(1);
            isAvailable(url);
          }
        }
    };
    http.send(data);
  }
};

var genCert = function() {
  var account = document.querySelector(".account").value;
  if (document.querySelector(".certname").value.length === 0) {
    document.querySelector(".certname").value = "My "+account+" WebID account ";
  }
  document.querySelector(".spkacform").setAttribute("action", makeURI(account)+CERT_ENDPOINT);
  document.querySelector(".spkacform").submit();
  certDone();
};

var certDone = function() {
  document.querySelector(".finish").style.display = "none";
  document.querySelector(".issue").style.display = "none";
  document.querySelector(".notifymessage").innerHTML = "You're all set!<br>A certificate should have been installed in your browser ";
  document.querySelector(".notifymessage").innerHTML += "(<a href=\"#\" onclick=\"genCert()\">or click here if it hasn't</a>).";
  document.querySelector(".successbox").style.display = "";

  // Prompt Firefox users to restart browser in order to use the client cert
  if (navigator.userAgent.indexOf('Firefox') >= 0) {
    document.querySelector(".notifymessage").innerHTML += "<br><strong>You must restart your browser to be able to use the certificate.</strong>";
  }

  if (queryVals['origin'] && queryVals['origin'].length > 0) {
    document.querySelector(".return").style.display = "";
  } else {
    document.querySelector(".done").style.display = "";
  }

  // Scroll into view
  scrollIntoView();
};

var returnToApp = function() {
  var origin = queryVals['origin'];
  if (!origin || origin.length === 0) {
    origin = '*';
  }
  // send to parent window
  if (window.opener) {
    window.opener.postMessage('User:'+document.querySelector(".webid").value, origin);
    window.close();
  } else {
    // send to parent iframe creator
    parent.postMessage('User:'+document.querySelector(".webid").value, origin);
  }
};

var showAccount = function() {
    var account = document.querySelector(".account").value;
    window.location.replace(makeURI(account));
}

var setGravatar = function() {
  var email = document.querySelector(".address").value;
  var pic = document.querySelector(".profilepic").src;
  console.log(pic.length)
  if (email.length > 0 && pic.length === 0) {
    var url = 'https://www.gravatar.com/avatar/' + hex_md5(email.replace(' ', '').toLowerCase())+'?d=404&s=300';
    var http = new XMLHttpRequest();
    http.open('HEAD', url);
    http.onreadystatechange = function() {
        if (this.readyState == this.DONE && this.status === 200) {
          document.querySelector(".profilepic").src = url;
          document.querySelector(".camera-wrap").classList.add("hidden");
          document.querySelector(".profilepic").classList.remove("hidden");
        }
    };
    http.send();
  }
}

var removePicture = function() {
  document.querySelector(".profilepic").removeAttribute('src');
  document.querySelector(".camera-wrap").classList.remove("hidden");
  document.querySelector(".profilepic").classList.add("hidden");
}

var scrollIntoView = function(elm) {
  if (!elm) {
    elm = 'footer';
  }
  document.querySelector(elm).scrollIntoView(true);
};

// Init app
init();
