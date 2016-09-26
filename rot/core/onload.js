// Load up the game
window.onload = function() {

    // Check if rot.js can work on this browser
    if (!ROT.isSupported()) {

        alert("The rot.js library isn't supported by your browser.");

    } else {

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
