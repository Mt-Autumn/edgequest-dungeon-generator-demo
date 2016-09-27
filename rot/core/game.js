// Manage the game with this object. Controls screens and keyboard input from ROT.js
// DEPENDS: Map

// The game essentially redirects and manages the screen system, where most of
// the heavy lifting is done in terms of keyboad input and managing the game
// states as well as some parts of the player (playScreen is the object to look
// at if something goes wrong)
var Game = {

    // Is overrided on init
    _currentScreen: null,

    _debugBiome: 'forest',

    _floor: 0,

    _objects: [Player],

    init: function() {
        // Make map
        this.play();
        this._currentScreen = startScreen;
        // Initial render
        this._currentScreen.renderAll();
    },

    // Getters and Setters

    getState: function() {
        return this._state;
    },

    setState: function(state) {
        this._state = state;
    },

    setFloor: function(floor) {
        this._floor = floor;
    },

    // Override the current biome
    debugSetBiome: function(name) {
        Map.debugSetOverworldBiome(name);
    },

    // Methods

    // Overrides input handling by passing it to the screen
    handleInput: function(inputType, inputData, key) {
        this._currentScreen.handleInput(inputType, inputData, key);
    },

    // Move the player's position in the overworld
    overworldMove: function(dx, dy, dz) {
        Map.moveOverworldPos(dx, dy, dz);
        Map.generateMap(this._floor);
    },

    overworldMoveHorizontal: function(dx, dy) {
        this.overworldMove(dx, dy, 0);
    },

    overworldMoveVertical: function(dz) {
        this.setFloor(this._floor + dz);
        this.overworldMove(0, 0, dz);
        if (dz < 0) { // Player going down means we need an up stairs
            Map._tiles[Player.actor.x][Player.actor.y] = Structures.getTile('up stairs');
        } else if (dz > 0) { // Player going up means we need a down stairs
            Map._tiles[Player.actor.x][Player.actor.y] = Structures.getTile('down stairs');
        }
    },

    // Play the game
    play: function() {
        Map.generateMap(this._floor);
        var pos = RandomPos.get();
        Player.actor.setPos(pos[0], pos[1]);
    },

    switchScreen: function(screen) {
        this._currentScreen = screen;
        this._currentScreen.renderAll();
    }

}
