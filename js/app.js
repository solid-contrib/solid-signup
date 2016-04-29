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

  // document.querySelector(".welcome").innerHTML = parser.host;

  // Add listener
  document.getElementById("user").addEventListener('keypress', function(e) {
    if (e.which == 13) {
      checkExists();
    }
  });
  document.getElementById("avatar").addEventListener('click', function(e) {
    clickFileInput();
  });
  document.getElementById('name').addEventListener('keypress', function(e) {
    if (e.which == 13) {
      updateProfile();
    }
  });

  document.getElementById("schema").innerHTML = accURL.schema;
  document.getElementById("domain").innerHTML = accURL.host;

  // Availability
  resetAvailability();

  setStep(1);

  document.getElementById("user").scrollIntoView();
}

var resetAvailability = function() {
  document.getElementById("profile").style.display = "none";
  document.getElementById("status").innerHTML = '';
  document.getElementById("claim").classList.add("hidden");
  document.getElementById("illegal").style.display = "none";
  document.getElementById("check").style.display = "";
  document.getElementById("accountinfo").classList.remove('green');
  document.getElementById("accountinfo").style.display = "none";
  document.getElementById("check").classList.add("disabled");
  document.getElementById("finish").classList.add('disabled');
  document.getElementById("finished").style.display = "none";
  document.getElementById("return").style.display = "none";
  document.getElementById("done").style.display = "none";
}

var makeURI = function(username) {
  if (username.length > 0) {
    return accURL.schema + username + '.' + accURL.host;
  }
  return null;
}

var validateProfile = function() {
  var name = document.querySelector(".fullname");
  var pic = document.querySelector('.profilepic').getAttribute('src');
  var finish = document.getElementById('finish');
  if (name.value.length > 0 && pic && pic.length > 0) {
    finish.classList.remove('disabled');
  } else {
    finish.classList.add('disabled');
  }

  if (name.value.lenth === 0) {
    name.classList.add('illegal');
  }
  if (pic && pic.lenth === 0) {
  }
}

var validateAccount = function() {
  resetAvailability();
  var account = document.getElementById("user").value;
  // cleaup
  account = account.toLowerCase().replace(/\s+/g, '-');
  if (account.indexOf('-') === 0) {
    account = account.slice(1);
  }
  var re = /^[a-zA-Z0-9-_]*$/;
  if (account.length === 0) {
    resetAvailability();
  } else if (re.test(account)) {
    document.getElementById("user").value = account;
    document.getElementById("username").innerHTML = account;
    document.getElementById("accountinfo").style.display = "";
    document.getElementById("check").classList.remove("disabled");
  } else {
    resetAvailability();
    document.getElementById("illegal").style.display = "";
  }
};


var isAvailable = function(url) {
  var email = document.getElementById("email");
  var status = document.getElementById("status");
  status.innerHTML = " is available.";
  if (email.value && email.value.length > 0) {
    status.innerHTML += " Do you want it?";
    document.getElementById("claim").classList.remove("hidden");
  } else {
    status.innerHTML += "<br><span class=\"red\">Please provide a valid email before proceeding.</span>";
    email.classList.add('illegal');
    email.focus();
  }
  document.getElementById("check").classList.add("disabled");
  // document.getElementById("profile").style.display = "";
  document.getElementById("accountinfo").classList.add('green');
  document.getElementById("accountinfo").classList.remove('red');
  window.setTimeout(function () {
    document.getElementById("claim").focus();
  }, 0);
};

var isTaken = function(url) {
  document.getElementById("status").innerHTML = " is taken.";
  document.getElementById("accountinfo").classList.remove('green');
  document.getElementById("accountinfo").classList.add('red');
}

var checkExists = function() {
  var account = document.getElementById("user").value;
  if (account.indexOf('-') === 0) {
    account = account.slice(1);
  }
  if (account.lastIndexOf('-') === account.length - 1) {
    account = account.slice(0, -1)
  }
  document.getElementById("user").value = account;
  document.getElementById("username").innerHTML = account;
  if (account.length > 0) {
    var url = makeURI(account);
    var http = new XMLHttpRequest();
    http.open('HEAD', url);
    http.onreadystatechange = function() {
      console.log(this.status)
        if (this.readyState == this.DONE) {
          if (this.status === 0) {
            // disconnected
            document.getElementById("status").innerHTML = "<strong>could not connect to server</strong>";
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
      document.getElementById("successbox").style.display = "none";
      // Hide example
      document.getElementById("accountinfo").style.display = "none";
      // Article
      document.getElementById("signup").style.display = "";
      // Scroll into view
      scrollIntoView('#user');
      break;
    case 2:
      // Hide buttons
      document.getElementById("successbox").style.display = "none";
      document.getElementById("signup").style.display = "none";
      document.getElementById("profile").style.display = "";
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
      document.getElementById("check").style.display = "none";
      // Article
      document.getElementById("signup").style.display = "none";
      document.getElementById("profile").style.display = "none";
      document.getElementById("successbox").style.display = "";
      document.getElementById("finished").style.display = "";
      // Set cert name
      var certname = document.querySelector('.fullname').value;
      if (certname.length === 0) {
        account = document.getElementById('user').value;
        certname = "My "+account+" WebID account";
      }
      document.getElementById("certname").value = certname;
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

        // focus the name input and validate profile
        document.querySelector('.fullname').focus();
        validateProfile();

        // clean up used elements
        delete canvas;
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  }
};

var updateProfile = function() {
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
          // setStep(3);
          genCert();
        }
      }
    };
    http.send(query);
  } else {
    // setStep(3);
  }
};

var createAccount = function() {
  var account = document.getElementById("user").value;
  var email = document.getElementById("email").value;
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
              document.getElementById("webid").value = webid;
            }
            setStep(2);
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
  var account = document.getElementById("user").value;
  if (document.getElementById("certname").value.length === 0) {
    document.getElementById("certname").value = "My "+account+" WebID account ";
  }
  document.getElementById("spkacform").setAttribute("action", makeURI(account)+CERT_ENDPOINT);
  document.getElementById("spkacform").submit();
  certDone();
};

var certDone = function() {
  // document.getElementById("notifymessage").innerHTML = "You're all set!<br>A certificate should have been installed in your browser ";
  // document.getElementById("notifymessage").innerHTML += "(<a href=\"#\" onclick=\"genCert()\">or click here if it hasn't</a>).";

  // Prompt Firefox users to restart browser in order to use the client cert
  // if (navigator.userAgent.indexOf('Firefox') >= 0) {
  //   document.getElementById("notifymessage").innerHTML += "<br><strong>You must restart your browser to be able to use the certificate.</strong>";
  // }

  if (queryVals['origin'] && queryVals['origin'].length > 0) {
    document.getElementById("return").style.display = "";
  } else {
    document.getElementById("done").style.display = "";
  }

  // Scroll into view
  scrollIntoView();
  setStep(3);
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
  var email = document.getElementById("email");
  var pic = document.querySelector(".profilepic").src;
  var status = document.getElementById("status");
  var claim = document.getElementById("claim");
  var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (!re.test(email.value)) {
    claim.classList.add("hidden");
    status.innerHTML = "<br><span class=\"red\">Please provide a valid email before proceeding.</span>";
    email.classList.add('illegal');
    email.focus();
  } else if (email.value.length > 0 && pic.length === 0) {
    document.getElementById("check").classList.remove("disabled");
    var url = 'https://www.gravatar.com/avatar/' + hex_md5(email.value.replace(' ', '').toLowerCase())+'?d=404&s=300';
    var http = new XMLHttpRequest();
    http.open('HEAD', url);
    http.onreadystatechange = function() {
        if (this.readyState == this.DONE && this.status === 200) {
          document.querySelector(".profilepic").src = url;
          document.querySelector(".camera-wrap").classList.add("hidden");
          document.querySelector(".profilepic").classList.remove("hidden");
        }
        status.innerHTML = " is available. Do you want it?";
        claim.classList.remove("hidden");
        claim.focus();
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
