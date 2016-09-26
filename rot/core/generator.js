// Map generator
// DEPENDS: Structures, ROT.js, Settings
var Generator = {

    // Return a 2D Array of map x (mx) by map y (my) size filled with wallTile
    fill: function(mx, my, wallTile) {

        var map = []

        for (var x = 0; x < mx; x++) {

            // Create the nested array for the y values
            map.push([]);

            // Add all the tiles with a wall tile
            for (var y = 0; y < my; y++) {
                map[x].push(wallTile);
            }

        }

        return map

    },

    // Build a structure from raw data
    buildStruct: function(tx, ty, tiles, struct, rotateNum) {

        // Retrieve the raw structure data (Always the last element)
        var rawStruct = struct[struct.length-1];

        // Count the number of unique tiles (This would usually be one less than the
        // position of the rawStruct, but the 0 case must be accounted for)
        var maxTileTypes = struct.length-1;

        // First, rotate the structure
        for (var j = 0; j < rotateNum; j++) {
            rawStruct = this.rotateRight(rawStruct);
        }

        // Add to map where the top left corner will be at pos
        // Pos must be an array of two ints
        for (var x = 0; x < rawStruct.length; x++) {

            for (var y = 0; y < rawStruct[0].length; y++) {
                // struct[0] to [length - 1] contain tile data, which corresponds to
                // 0 and 1s in the struct

                if (rawStruct[x][y] < maxTileTypes) {
                    if (x + tx < Settings.screenWidth && y + ty < Settings.screenHeight) {

                        tiles[x + tx][y + ty] = Structures.getTile(struct[rawStruct[x][y]]);

                    }
                } else {
                    // do nothing for extraneous cases
                }
            }
        }

        return tiles;

    },

    // Build structures on a map of tiles
    buildStructures: function(tiles, type) {

        // Generate 0-3 structures
        var structNum = ROT.RNG.getPercentage() % 4;

        // Build them all
        for (var i = 0; i < structNum; i++) {

            // Choose how many times to rotate the structure (0-3)
            var rotateNum = ROT.RNG.getPercentage() % 4;
            // Get a random position
            var pos = RandomPos.getFor(tiles.length, tiles[0].length);

            // Add a random strucure to the map
            tiles = this.buildStruct(pos[0], pos[1], tiles, Structures.getRandStruct(type), rotateNum);

        }

        return tiles;

    },

    // Use a drunkard's walk cellular automata to turn blocking tiles into
    // floorTile.
    drunkardsWalk: function(map, floorTile, walkThresh) {

        // Get random start position
        var pos = RandomPos.getFor(map.length, map[0].length);

        // Start the walk
        var open = 0;

        while (open != walkThresh) {

            // Replace blocking tiles with floorTile
            if (map[pos[0]][pos[1]].getBlocks() == true) {
                map[pos[0]][pos[1]] = Structures.getTile(floorTile);
                open += 1;
            }

            // Roll a random direction
            switch (Math.floor((Math.random() * 4) + 1)) {
                case 1:
                    pos[0] += 1;
                    break;
                case 2:
                    pos[0] -= 1;
                    break;
                case 3:
                    pos[1] += 1;
                    break;
                case 4:
                    pos[1] -= 1;
                    break;
            }

            // Check for overflow
            // The '- 2' Prevents eating the visible border
            if (Settings.mapWidth - 2 < pos[0]) {
                pos[0] = Settings.mapWidth - 2;
            } else if (pos[0] < 0) {
                pos[0] = 0;
            } else if (pos[1] < 0) {
                pos[1] = 0;
            } else if (Settings.mapHeight - 2 < pos[1]) {
                pos[1] = Settings.mapHeight -  2 ;
            }

        }

        return map;

    },

    // Make a cave of map x (mx) by map y (my) size filled with wallTile and floorTile
    // and occasionally altWallTile
    // smoothingPasses determines the number of times the map will get cleaned up
    // density determines the density of wallTiles & altWallTiles
    makeCave: function(mx, my, wallTile, altWallTile, floorTile, smoothingPasses, density) {
        // Get a null map to start
        var map = this.fill(mx, my, Structures.nullTile);

        // Setup the map generator
        var generator = new ROT.Map.Cellular(mx, my);

        // Seed the generator with a float value from 0 to 1
        // This density value determines the density of trees, 0.5 being a middle
        // ground, 0 being none, and 1 being completely full
        generator.randomize(density);

        // Iteratively smoothen the map
        for (var i = 0; i < smoothingPasses - 1; i++) {
            generator.create();
        }

        // Smoothen it one last time and then update our map
        generator.create(function(x,y,v) {
            if (v === 1) {
                if (ROT.RNG.getNormal(0, 10) > 2) {
                    map[x][y] = Structures.getTile(wallTile);
                } else {
                    map[x][y] = Structures.getTile(altWallTile);
                }
            } else {
                map[x][y] = Structures.getTile(floorTile);
            }
        });

        // Create our map from the tiles
        return map;
    },

    // Randomly place a tile on tiles
    randomlyPlace: function(tiles, tile, times) {

            for (var i = 0 ; i < times ; i++) {
                pos = RandomPos.getFor(tiles.length, tiles[0].length);
                tiles[pos[0]][pos[1]] = Structures.getTile(tile);
            }

            return tiles;
    },

    // Rotate an array 90 degrees to the right
    rotateRight: function(array) {

        return array.map(function(col, i) {

          return array.map(function(row) {

            return row[i];

          })

        });

    },

    // Wrappers

    // Wrapper to generate a nice forest with strucutres
    makeForest: function(mx, my, smoothingPasses, density) {
        var map = this.makeCave(mx, my, 'tree_de', 'tree_ev', 'grass', smoothingPasses, density);
        return this.buildStructures(map, 'forest');
    },

    // Wrapper to generate a forest but add a drunkardsWalk to clear out a portion
    makeDrunkForest: function(mx, my, smoothingPasses, density, walkThresh) {
        var map = this.makeCave(mx, my, 'tree_de', 'tree_ev', 'grass', smoothingPasses, density);
        return this.drunkardsWalk(this.buildStructures(map, 'forest'), 'grass', walkThresh);
    },

    // Wrapper to generate a forest with structures and two fixed thresh drunkardsWalks
    // but with very dense foliage (also fixed)
    makeDenseForest: function(mx, my, smoothingPasses) {
        var map = this.makeCave(mx, my, 'tree_de', 'tree_ev', 'grass', smoothingPasses, 0.75);
        map = this.drunkardsWalk(this.buildStructures(map, 'forest'), 'grass', 200);
        return this.drunkardsWalk(map, 'grass', 200);
    },

    // Wrapper to make fields. Density is fixed
    makeField: function(mx, my, smoothingPasses) {
        var map = this.makeCave(mx, my, 'tree_de', 'tree_ev', 'grass', smoothingPasses, 0.3);
        return this.buildStructures(map, 'field');
    },

    // Wrapper to make fields. Density is fixed
    makeTaiga: function(mx, my, smoothingPasses) {
        var map = this.makeCave(mx, my, 'tree_ev', 'tree_ev', 'snow', smoothingPasses, 0.4);
        return map
    },

    // Wrapper to make deserts. Density and smoothingPasses are fixed
    makeDesert: function(mx, my) {
        var map = this.makeCave(mx, my, 'sand', 'sand', 'sand', 0, 0.4);
        map = this.randomlyPlace(map, 'cactus', 40);
        return this.buildStructures(map, 'desert');
    },

    // Make a natural cave with some strucutres
    makeNaturalCave: function(mx, my, smoothingPasses, density) {
        var map = this.makeCave(mx, my, 'wall', 'crag', 'rock', smoothingPasses, density);
        return this.buildStructures(map, 'cave');
    }

}
