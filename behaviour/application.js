function hasRequiredFeatures() {
  var res = true;
  if (!("WebSocket" in window)) {
    res = false;
    console.error("No WebSocket support detected");
  }
  if (!("localStorage" in window)) {
    res = false;
    console.error("No localStorage support detected");
  }
  console.log("Browser supported: " + res);
  return res;
}

function showBrowserLinks() {
  $("#progressOverlay").hide();
  $("#canvas").hide();
  $("#fbContainer").hide();
  $("#browserLinks").show();
}

function initConsole() {
   var alertFallback = false;
   if (typeof console === "undefined" || typeof console.log === "undefined") {
     console = {};
     if (alertFallback) {
         console.log = function(msg) {
              alert(msg);
         };
         console.debug = function(msg) {
              alert(msg);
         };
         console.error = function(msg) {
              alert(msg);
         };
     } else {
         console.log = function() {};
         console.debug = function() {};
         console.error = function() {};
     }
   } else if (console && !console.debug) {
     console.debug = function() {};
   }
}

function Application() {
}

Application.prototype = {
  init: function() {
    var self = this;

    this.view = new View();
    this.messageHandler = new MessageHandler();
    
    window.game.setView(this.view);
    window.game.setMessageHandler(this.messageHandler);

    this.view.setGame(window.game);
    
    window.game.setPlayerTeam("Team Suriname");
    window.game.setCpuTeam("Team Nederland");

    var playerName = this.getStoredValue('playerName');

    if (playerName != null) {
      window.game.setPlayerName(playerName);
    } else {
        this.view.askPlayerName( function(p) {
          window.game.setPlayerName(p);
          self.storeValue('playerName', p);
        });
    }
    
    this.view.preload();
  },

  getStoredValue: function(key) {  
    var value = localStorage.getItem(key);
    console.debug("Retrieved " + key + " with value " + value);
    return value;
  },

  storeValue: function(key, value) {
    console.debug("Storing  "+ key + " with value " + value);
    localStorage.setItem(key, value);
  }

};

$(document).ready(function() {
    initConsole();
    if (hasRequiredFeatures()) {
      var application = new Application();
      application.init();
    } else {
      showBrowserLinks();
    }
});