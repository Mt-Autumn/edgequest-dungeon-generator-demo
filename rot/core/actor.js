// Actors are objects that either have AI or some level of interactability
// and need to move aroud the map accordingly without needing to be a tile
// themselves

class Actor {

    constructor(x, y, symbol) {
        this.x = x;
        this.y = y;

        // Keep track of an old position for more efficient rendering and
        // potential AI functionality
        this._oldPos = [x, y];

        this._symbol = symbol;
    }

    // Getters and Setters

    getSymbol() {
        return this._symbol;
    }

    getOldPos() {
        return this._oldPos;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    // Methods

    move(dx, dy) {
        // Update oldPos
        this._oldPos = [this.x, this.y];
        
        this.x += dx;
        this.y += dy;
    }

}
