// Screens are used to manage the game by providing methods for rendering,
// and for keyboard handling
// DEPENDS: Game, Renderer, Map, Canvas

/* HOW SCREENS WORK

Screens have 2 main components:
    1) The renderAll method
    2) The handleInput method

The renderAll method renders everything the screen needs to function properly

The handleInput method is what the handleInput method in Game points to

*/

/* NOTE: Game and Screens are heavily tied together considering they use
the same objects (Map for example) but they are not a circular dependency.
Techincally the Game object has no idea a Screen object exists, but it still
calls functions from it and passes data to it. Therefore, it's okay to reference
Game in a screen.
*/

// Main title screen
var startScreen = {

    renderAll: function() {
        // Render our prompt to the screen
        Canvas.getDisplay().drawText(1, 1, "%c{yellow}Javascript Dungeon Generator");
        Canvas.getDisplay().drawText(1, 3, "- Arrow keys to move");
        Canvas.getDisplay().drawText(1, 4, "- 'p' to pause");
        Canvas.getDisplay().drawText(1, 5, "- Worlds are infinite, you aren't confined by the screen!");
        Canvas.getDisplay().drawText(1, 6, "- Use keys from 'a' to 'g' to override the current biome");
        Canvas.getDisplay().drawText(1, 7, "- Press '<' and '>' on their respective tiles to go up and down");
        Canvas.getDisplay().drawText(1, 9, "Press [Enter] to start!");
    },

    // When [Enter] is pressed, go to the play screen
    handleInput: function(inputType, inputData, key) {
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(playScreen);
            }
        }
    }
}

// Handles the main game, therefore has a lot more power than the other screens.
var playScreen = {
    // Render the entire game
    renderAll: function() {
        Renderer.renderAll(Canvas.getDisplay());
    },

    // Alternate render function that is faster, but
    // has limitations
    render: function() {
        Renderer.renderSelect(Canvas.getDisplay());
    },

    // Check for certain player conditions
    checkPlayer: function() {
        // Check to see if the player passed the map edge
        // If they did, that means the overworld position must be shifted
        if (Player.actor.x < 0) {
            Player.actor.setPos(Map.getWidth()-1, Player.actor.y);
            Game.overworldMoveHorizontal(-1, 0);
            this.renderAll();
        } else if (Player.actor.x >= Map.getWidth()) {
            Player.actor.setPos(0, Player.actor.y);
            Game.overworldMoveHorizontal(1, 0);
            this.renderAll();
        } else if (Player.actor.y < 0) {
            Player.actor.setPos(Player.actor.x, Map.getHeight()-1);
            Game.overworldMoveHorizontal(0, -1);
            this.renderAll();
        } else if (Player.actor.y >= Map.getHeight()) {
            Player.actor.setPos(Player.actor.x, 0);
            Game.overworldMoveHorizontal(0, 1);
            this.renderAll();
        }
    },

    handleInput: function(inputType, inputData, key) {
        if (inputType === 'keypress') {

            // Render override
            if (inputData.keyCode === ROT.VK_RETURN) {
                this.renderAll();

            // Movement
            } else if (inputData.keyCode === ROT.VK_LEFT) {
                Player.move(-1, 0);
                Game.setState('playing');
            } else if (inputData.keyCode === ROT.VK_RIGHT) {
                Player.move(1, 0);
                Game.setState('playing');
            } else if (inputData.keyCode === ROT.VK_UP) {
                Player.move(0, -1);
                Game.setState('playing');
            } else if (inputData.keyCode === ROT.VK_DOWN) {
                Player.move(0, 1);
                Game.setState('playing');

            // Stairs
        } else if (key === '>') { // Up
                if (Map.getTile(Player.actor.x, Player.actor.y).getSymbol().getChar() == '>') {
                    Game.overworldMoveVertical(-1);
                    Game.setState('playing');
                    this.renderAll();
                } else {
                    Game.setState('no turn');
                }
            } else if (key === '<') { // Down
                if (Map.getTile(Player.actor.x, Player.actor.y).getSymbol().getChar() == '<') {
                    Game.overworldMoveVertical(1);
                    Game.setState('playing');
                    this.renderAll();
                } else {
                    Game.setState('no turn');
                }

            // Pause
            } else if (key === "p") {
                Game.setState('no turn');
                Game.switchScreen(pauseScreen);

            // Debug biome shifting
            } else if (key === "a") {
                Game.debugSetBiome('dense forest');
                this.renderAll();
            } else if (key === "s") {
                Game.debugSetBiome('forest');
                this.renderAll();
            } else if (key === "d") {
                Game.debugSetBiome('field');
                this.renderAll();
            } else if (key === "f") {
                Game.debugSetBiome('cave');
                this.renderAll();
            } else if (key === "g") {
                Game.debugSetBiome('taiga');
                this.renderAll();

            } else {
                Game.setState('no turn');
            }

            // Render the game if the player moved
            if (Game.getState() === 'playing') {
                this.render();
                this.checkPlayer();
            }

        }
    }
}

// Pause screen. Game is turned based so this is pointless, but it makes
// people feel better
var pauseScreen = {
    // Render the pause screen
    renderAll: function() {
        Renderer.clear(Canvas.getDisplay());
        Renderer.writeText(Canvas.getDisplay(), 1, 1, "Game Paused", 'yellow');
        Renderer.writeText(Canvas.getDisplay(), 1, 2, "Press any key to return", 'white');
    },

    // Wait for input to cancel the pause
    handleInput: function(inputType, inputData, key) {
        if (inputType === 'keydown') {

            Game.switchScreen(playScreen);

        }
    }
}
