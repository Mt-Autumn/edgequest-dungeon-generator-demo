// Renderer will send things to the Canvas to draw
// DEPENDS: Map
var Renderer = {

    init: function() {

    },

    // Clear a display
    clear: function(display) {
        display.clear();
    },

    // Write text to canvas
    // NOTE: Could be very much more robust and fleshed out
    writeText: function(display, x, y, text, color) {
        c = color || 'white';
        display.drawText(x, y, '%c{'+color+'}'+text);
    },

    // Render everything (mostly the map)
    renderAll: function(display) {
        // Iterate through all map cells
        for (var x = 0; x < Map.getWidth(); x++) {
            for (var y = 0; y < Map.getHeight(); y++) {
                // Fetch the symbol for the tile and render it to the screen
                var symbol = Map.getTile(x, y).getSymbol();
                display.draw(x, y, symbol.getChar(), symbol.getFG(), symbol.getBG());
            }
        }
        var symbol = Player.actor.getSymbol();
        display.draw(Player.actor.x, Player.actor.y, symbol.getChar(), symbol.getFG(), symbol.getBG());
    },

    // More optimized renderer, but implies the map has been previously rendered
    // fully
    renderSelect: function(display) {
        // Objects
        var symbol = Player.actor.getSymbol();
        var oldPos = Player.actor.getOldPos();
        display.draw(Player.actor.x, Player.actor.y, symbol.getChar(), symbol.getFG(), symbol.getBG());
        // Map
        symbol = Map.getTile(oldPos[0], oldPos[1]).getSymbol();
        display.draw(oldPos[0], oldPos[1], symbol.getChar(), symbol.getFG(), symbol.getBG());
    }
};
