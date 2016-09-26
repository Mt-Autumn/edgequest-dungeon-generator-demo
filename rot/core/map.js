// Map object manages game world and associated objects and actors
// DEPENDS: Settings, Structures

var Map = {

    // Is overrided when a map is generated through generateMap
    _tiles: null,

    _width: Settings.mapWidth,
    _height: Settings.mapHeight,

    // Current biome in use
    _currentBiome: 'forest',

    // Store biome chances
    _OverworldBiomeChance: {
        'forest': 6,
        'dense forest': 2,
        'field': 4,
        'taiga': 1,
        'desert': 1
    },

    _UndergroundBiomeChance: {
        'cave': 1
    },

    // Overworld position
    _overworldPos: [0, 0, 0],

    // Hash map to store overworld maps
    _overworldMaps: {},

    // Getters and Setters

    getWidth: function() {
        return this._width;
    },

    getHeight: function() {
        return this._height;
    },

    // Override the current biome and regenerate it
    debugSetOverworldBiome: function(name) {
        this._overworldMaps[this._overworldPos] = this.makeBiomeTiles(name);
        this._tiles = this._overworldMaps[this._overworldPos];
    },

    // Methods

    // Generate a map based on a dungeon level
    generateMap: function(floor) {
        // Floor 0 is considered to be an infinite overworld
        if (floor == 0) {

            // Check to see if a map exists for the current overworld position
            if (this._overworldMaps[this._overworldPos] == undefined) {
                // If it does not exist, create a map
                this._overworldMaps[this._overworldPos] = this.makeBiomeTiles(ROT.RNG.getWeightedValue(this._OverworldBiomeChance));
            }

        } else if (floor < 0) {
            // Check to see if a map exists for the current overworld position
            if (this._overworldMaps[this._overworldPos] == undefined) {
                // If it does not exist, create a map
                this._overworldMaps[this._overworldPos] = this.makeBiomeTiles(ROT.RNG.getWeightedValue(this._UndergroundBiomeChance));
            }
        }

        // Load up the map for the current overworld position
        // Regardless if a map exists for the current coords or not,
        // this should always be ran
        this._tiles = this._overworldMaps[this._overworldPos];

    },

    // Get a tile from the map at an x, y
    getTile: function(x, y) {
        // Make sure we are inside the bounds. If we aren't, return
        // null tile.
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
            return Structures.nullTile;
        } else {
            return this._tiles[x][y] || Structures.nullTile;
        }
    },

    // Make a set of tiles using the generator for a specific biome
    makeBiomeTiles(name) {
        switch (name) {
            case 'forest':
                return Generator.makeDrunkForest(this._width, this._height, 3, 0.6, 400);
                break;
            case 'dense forest':
                return Generator.makeDenseForest(this._width, this._height, 3, 400);
                break;
            case 'taiga':
                return Generator.makeTaiga(this._width, this._height, 3);
                break;
            case 'cave':
                return Generator.makeNaturalCave(this._width, this._height, 3, 0.55);
                break;
            case 'field':
                return Generator.makeField(this._width, this._height, 3);
                break;
            case 'desert':
                return Generator.makeDesert(this._width, this._height);
                break;
            // Default is a field
            default:
                return Generator.makeField(this._width, this._height, 3);
                break;
        }

    },

    // Move the overworld position by dx, dy, dz
    moveOverworldPos: function(dx, dy, dz) {
        this._overworldPos[0] += dx;
        this._overworldPos[1] += dy;
        this._overworldPos[2] += dz;
    }

}
