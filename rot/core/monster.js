// Store all monsters and give methods to make them easily

// TODO: Create chances and possible monsters for each biome. Add method
// to Map to create monsters for each biome through a method in Monsters

// Possible monster configurations are stored here
var mon = {
    'ant': ['a', 'red', 'dumb']
}

var Monsters = {
    // Monster names get parsed into actual monsters
    makeMonster: function(x, y, name) {
        var monArr = mon[name];
        switch (monArr[2]) {
            case 'dumb':
                return new DumbAI(new Actor(x, y, new Symbol(monArr[0], monArr[1], 'black')));
                break;
            default:
                return new DumbAI(new Actor(x, y, new Symbol(monArr[0], monArr[1], 'black')));
                break;
        }
    }
}
