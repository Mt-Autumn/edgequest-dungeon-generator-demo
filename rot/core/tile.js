// Tile to maintain specific properties associated with certain tiles
// Has nothing in it, but can be expanded for things like tile health,
// liquid terrain, doors, etc
class Tile {

    constructor(symbol, blocks) {
        this._symbol = symbol || new Symbol();
        this.blocks = blocks || false;
    }

    // Getters and Setters

    getSymbol() {
        return this._symbol;
    }

    getBlocks() {
        return this.blocks;
    }

}
