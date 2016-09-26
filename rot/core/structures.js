// DEPENDS: Tile, Symbol

/* HOW CREATING STRUCTURES WORK

- All possible blocks that could be used for maps must be put in the
blocks dictionary.

- All possible structures that could be used for maps must be put in the
struct dictionary.

- Then, biome specific strucures can be created and added to their own
dictionary, where the key is the name of the structure, and the value is struct[key]

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
        'down stairs': ['>', '#ffffff', '#ffffff', 'black', false],
        'up stairs': ['<', '#ffffff', '#ffffff', 'black', false],
        'sand': ['.', '#f5cc4d','#f8da7d', 'black', false],
        'sandwall': ['#', '#f5cc4d','#f8da7d', 'black', true],
        'sandcrag': ['^', '#f5cc4d','#f8da7d', 'black', true],
        'cactus': ['♠', '#5c755e','#557855', 'black', false]
};

// All possible structures
var structs = {
    'clearing': ['grass',
        [[1, 1, 1, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 1, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 1, 1, 1]
        ]],
    'path': ['grass', 'grass',
        [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
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
        ]],
    'pyramid': ['sandwall', 'sandcrag', 'rock', 'down stairs',
        [[1, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 0, 0, 0, 0, 1, 0],
        [0, 0, 2, 3, 3, 2, 0, 0],
        [0, 0, 2, 1, 1, 2, 0, 0],
        [0, 0, 2, 1, 1, 2, 0, 0],
        [0, 0, 2, 2, 2, 2, 0, 0],
        [0, 1, 0, 2, 2, 0, 1, 0],
        [1, 0, 0, 2, 2, 0, 0, 1]
        ]],
    'mine': ['wall', 'rock', 'down stairs',
        [[0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 0],
        [0, 1, 2, 1, 1, 0],
        [0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 0, 0],
        ]],
    'oasis': ['water', 'grass',
        [[2, 2, 2, 1, 1, 2, 2, 2],
        [2, 2, 1, 1, 1, 1, 2, 2],
        [2, 1, 1, 1, 1, 1, 1, 2],
        [1, 1, 1, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 1, 1, 1],
        [2, 1, 1, 1, 1, 1, 1, 2],
        [2, 2, 1, 1, 1, 1, 2, 2],
        [2, 2, 2, 1, 1, 2, 2, 2]
        ]],
    'mineshaft down': ['wall', 'rock', 'down stairs',
        [[0, 1, 0],
        [1, 2, 1],
        [0, 1, 0]
        ]],
    'mineshaft up': ['wall', 'rock', 'up stairs',
        [[0, 1, 0],
        [1, 2, 1],
        [0, 1, 0]
        ]],
}

// Forest structs

var structForest = {
    'clearing': structs['clearing'],
    'path': structs['path'],
    'hut': structs['hut'],
    'mine': structs['mine']
};

var structChanceForest = {
    'clearing': 3,
    'path': 2,
    'hut': 1,
    'mine': 1
};

// Cave structs

var structCave = {
    'oasis': structs['oasis'],
    'mineshaft down': structs['mineshaft down'],
    'mineshaft up': structs['mineshaft up']
}

var structChanceCave = {
    'oasis': 3,
    'mineshaft down': 1,
    'mineshaft up': 1
}

// Field structs

var structField = {
    'oasis': structs['oasis'],
    'hut': structs['hut'],
    'mineshaft down': structs['mineshaft down']
}

var structChanceField = {
    'oasis': 5,
    'hut': 1,
    'mineshaft down': 1
}

// Desert structs

var structDesert = {
    'oasis': structs['oasis'],
    'pyramid': structs['pyramid']
}

var structChanceDesert = {
    'oasis': 5,
    'pyramid': 1
}

// Dict to hold structure dict types
var struct = {
    'forest': structForest,
    'cave': structCave,
    'field': structField,
    'desert': structDesert,
}

// Dict to hold structure dict chances
var structChance = {
    'forest': structChanceForest,
    'cave': structChanceCave,
    'field': structChanceField,
    'desert': structChanceDesert
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
