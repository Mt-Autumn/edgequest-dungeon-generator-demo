var Settings = {
    screenWidth: 80,
    screenHeight: 30,
    mapWidth: 80,
    mapHeight: 30,
}

// Should probably make a seperate camera file once it actually gets implemented
// However this is useless right now
// var Camera = {
//     _centerX: 0,
//     _centerY: 0
// }

// NOTE: Could be done a lot better
var RandomPos = {
    get: function() {
        return [Math.floor(Math.random() * Settings.mapWidth), Math.floor(Math.random() * Settings.mapHeight)]
    },
    getFor: function(x, y) {
        return [Math.floor(Math.random() * x), Math.floor(Math.random() * y)]
    }
}
