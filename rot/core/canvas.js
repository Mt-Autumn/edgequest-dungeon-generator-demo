// Canvas object to explicitly manage the ROT display
// DEPENDS: ROT.js, Settings
var Canvas = {

    _display: null,
    _width: Settings.screenWidth,
    _height: Settings.screenHeight,
    _state: 'playing',

    init: function() {
        // Create a display 80 characters wide and 20 characters tall
        this._display = new ROT.Display({width: this._width, height: this._height});

        // Set font options of display
        this._display.setOptions({
            fontFamily: "monospace",
            fontSize: 24
        });

    },

    // Getters and Setters

    getDisplay: function() {
        return this._display;
    },

};
