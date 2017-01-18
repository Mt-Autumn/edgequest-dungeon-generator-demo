// Detect browser
navigator.sayswho = (function() {
    var ua = navigator.userAgent, tem,
    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if( /trident/i.test(M[1]) ) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if( M[1] === 'Chrome' ){
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

// Load up the game
window.onload = function() {

    // Check if rot.js can work on this browser
    if (!ROT.isSupported()) {

        alert("The rot.js library isn't supported by your browser.");

    } else {

        // Check browser
        if (navigator.sayswho.split(" ")[0] === 'Firefox') {
          // Known issue with firefox
          if (parseInt(navigator.sayswho.split(" ")[1]) < 32) {
            alert("The game may not be supported by your browser.");
          }
        }

        // Initialize Canvas
        Canvas.init();

        // Initialize Game
        Game.init();

        // Add the container to the ROT.js topic
        document.getElementById("topic").appendChild(Canvas.getDisplay().getContainer());

        // Bind keypress events
        var bindEventToScreen = function(event) {
            // Possible screen management goes here for main menu, pause, etc
            window.addEventListener(event, function(e) {
                var code = e.charCode;
                var key = String.fromCharCode(code);
                Game.handleInput(event, e, key);
            });
        }

        // Bind keyboard input events
        bindEventToScreen('keydown');
        bindEventToScreen('keyup');
        bindEventToScreen('keypress');

    }
};
