// DEPENDS: Tile, Symbol

/* HOW CREATING STRUCTURES WORK

- All possible blocks that could be used for maps must be put in the
blocks dictionary.

- Then, biome specific strucures can be created and added to their own
dictionary, where the key is the name of the structure

- From there, another dictionary is needed to house their chances of randomly
appearing, where the key is once again the name of the structure.

- Finally two more dictionaries are needed: one to pair a biome name with it's
structures, and another to pair a biome name to it's chance dict

- From there, structures can be returned from the Structures object using
the methods getRandStruct or getStruct

- These are taken by Generator to add to the map

*/

// Dict to store some tile data
var blocks = {
        'wall': ['#', '#A0522D', '#a96342', 'black', true],
        'crag': ['^', '#A0522D', '#a96342', 'black', true],
        'rock': ['.', 'gray', '#a8a8a8', 'black', false],
        'dirt': ['.', 'brown', 'brown', 'black', false],
        'grass': ['.', '#00FF00', 'green', 'black', false],
        'snow': ['.', '#FFFAFA', '#E5E1E1', 'black', false],
        'tree_ev': ['♠', '#214402', '#02884d', 'black', true],
        'tree_de': ['♣', '#214402', '#02884d', 'black', true],
        // 'tree_ev': ['🌲', '#214402', '#02884d', 'black', true],
        // 'tree_de': ['🌳', '#214402', '#02884d', 'black', true],
        'water': ['≈', '#40a4df', '#6093ac', 'black', true],
        'lava': ['≈', '#cf1020', '#b70e1c', 'black', true],
        'sand': ['.', '#f4a460','#f4a460', 'black', false]
};

// Dict for things in forests
var structForest = {
    'clearing': ['tree_de', 'grass',
                [[0, 0, 0, 0, 1, 0, 0, 0, 0],
                 [0, 0, 0, 1, 1, 1, 0, 0, 0],
                 [0, 0, 1, 1, 1, 1, 1, 0, 0],
                 [0, 1, 1, 1, 1, 1, 1, 1, 0],
                 [1, 1, 1, 1, 1, 1, 1, 1, 1],
                 [0, 1, 1, 1, 1, 1, 1, 1, 0],
                 [0, 0, 1, 1, 1, 1, 1, 0, 0],
                 [0, 0, 0, 1, 1, 1, 0, 0, 0],
                 [0, 0, 0, 0, 1, 0, 0, 0, 0]
                ]],
    'path': ['tree_de', 'grass',
            [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]],
    'hut': ['wall', 'rock',
           [[0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 1, 1, 0, 0, 0]
           ]]
};

// Dict for strucure chances in forests
var structChanceForest = {
    'clearing': 3,
    'path': 2,
    'hut': 1,
};

var structCave = {
    'oasis': ['water', 'grass',
           [[2, 2, 2, 1, 1, 2, 2, 2],
            [2, 2, 1, 1, 1, 1, 2, 2],
            [2, 1, 1, 1, 1, 1, 1, 2],
            [1, 1, 1, 0, 0, 1, 1, 1],
            [1, 1, 1, 0, 0, 1, 1, 1],
            [2, 1, 1, 1, 1, 1, 1, 2],
            [2, 2, 1, 1, 1, 1, 2, 2],
            [2, 2, 2, 1, 1, 2, 2, 2]
           ]]
}

var structChanceCave = {
    'oasis': 1
}

var structField = {
    'oasis': ['tree_de', 'grass',
           [[2, 2, 2, 1, 1, 2, 2, 2],
            [2, 2, 1, 1, 1, 1, 2, 2],
            [2, 1, 1, 1, 1, 1, 1, 2],
            [1, 1, 1, 0, 0, 1, 1, 1],
            [1, 1, 1, 0, 0, 1, 1, 1],
            [2, 1, 1, 1, 1, 1, 1, 2],
            [2, 2, 1, 1, 1, 1, 2, 2],
            [2, 2, 2, 1, 1, 2, 2, 2]
        ]],
    'hut': ['wall', 'rock',
           [[0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 1, 1, 0, 0, 0]
       ]]
}

var structChanceField = {
    'oasis': 5,
    'hut': 1
}

// Dict to hold structure dict types
var struct = {
    'forest': structForest,
    'cave': structCave,
    'field': structField
}

// Dict to hold structure dict chances
var structChance = {
    'forest': structChanceForest,
    'cave': structChanceCave,
    'field': structChanceField,
}

// Wrap the creation of tiles
var makeTile = function(chr, fg, bg, blocks) {
    return new Tile(new Symbol(chr, fg, bg), blocks);
};

// Provide framework for managing tiles
var Structures = {

    // Null tile, used when theres an error
    nullTile: new Tile(new Symbol('?', 'white', 'black'), false),

    // Retrieve a tile from blocks by name, always creates new instance
    getTile: function(name) {
        if (ROT.RNG.getNormal(0, 10) > 2) {
            return makeTile(blocks[name][0], blocks[name][2], blocks[name][3], blocks[name][4]);
        } else {
            return makeTile(blocks[name][0], blocks[name][1], blocks[name][3], blocks[name][4]);
        }
    },

    // Get a random struct from it's type defined in struct
    getRandStruct: function(type) {
        return struct[type][ROT.RNG.getWeightedValue(structChance[type])];
    },

    // Get a specific structure from it's type and name
    getStruct: function(type, name) {
        return struct[type][name];
    }

};
